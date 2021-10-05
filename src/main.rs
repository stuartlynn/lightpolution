use actix_files as fs;
use awc::Client;

use actix_web::{get, post, web, App, Error, HttpResponse, HttpServer, Responder};
use futures::future::Future;
use futures::TryFutureExt;
use serde::{Deserialize, Serialize};
use crate::config::Config;
use db::{establish_connection_sqlx, DBPool,TilePool};
use deadpool_postgres::Pool;
use crate::light_source::LightSource;
use crate::tiles::{bbox,TileID};
use std::ops::{DerefMut};
use geotiff::TIFF;
use oauth2::basic::BasicClient;
use app_state::State;

extern crate dotenv;
// extern crate refinery;

mod db;
mod config;
mod light_source;
mod tiles;
mod error;
mod auth;
mod app_state;
// mod embedded {
//     use refinery::embed_migrations;
//     embed_migrations!("./migrations");
// }


#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().body("Still alive!")
}

#[derive(Deserialize)]
struct LightSourceParams{
    pub id: i32
}

#[get("/light_sources/{id}")]
async fn get_target(state :web::Data<State>, params: web::Path<LightSourceParams>)-> impl Responder{
    let source = LightSource::find(&state.db,params.id).await;

    source.unwrap().to_geojson(false).to_string()
}

#[get("/light_sources")]
async fn get_targets(state :web::Data<State>)-> impl Responder{
    let source = LightSource::to_feature_col(LightSource::all(&state.db).await.unwrap());
    source.to_string()
}

#[derive(sqlx::FromRow)]
struct MBTile {
    tile_data: Vec<u8>
} 

#[get("/incorp_places/{z}/{x}/{y}")]
async fn get_incorp_places(
    state: web::Data<State>,
    tile_id: web::Path<TileID>
)->Result<HttpResponse, Error>{
    let query = "select tile_data from tiles where zoom_level = $1 and tile_column = $2 and tile_row = $3";

    let y = ( 1 << tile_id.z) -1 - tile_id.y; 

    let row: MBTile = sqlx::query_as(query)
        .bind(tile_id.z as u32)
        .bind(tile_id.x as u32)
        .bind( y as u32)
        .fetch_one(&state.tiles).await
        .map_err(|e| {
            println!("{:?}",e);
            actix_web::error::ErrorNotFound(&"Failed to get mbtile")
        })?;

    Ok(HttpResponse::Ok()
    .header(
        "Content-Type", "application/x-protobuf"
    )
    .header(
        "Content-Encoding", "gzip"
    )
    .body(row.tile_data))

}

// #[get("/light_polution/{x}/{y}/{z}")]
// async fn lp_tile_local(
//     state: web::Data<State>,
//     tile_id: web::Path<TileID>
// ) -> Result<HttpResponse<actix_web::dev::Body>, Error>{

//     let query = "select tile_data from tiles where zoom_level = $1 and tile_column = $2 and tile_row = $3";

//     let y = ( 1 << tile_id.z) -1 - tile_id.y; 

//     let row: MBTile = sqlx::query_as(query)
//         .bind(tile_id.z as u32)
//         .bind(tile_id.x as u32)
//         .bind( y as u32)
//         .fetch_one(&state.lp_tiles).await
//         .map_err(|e| {
//             println!("{:?}",e);
//             actix_web::error::ErrorNotFound(format!("Failed to get mbtile {:?}", tile_id))
//         })?;

//     Ok(HttpResponse::Ok()
//     .header(
//         "Content-Type", "image/png"
//     )
//     .body(row.tile_data))
// }

#[get("/light_polution/{x}/{y}/{z}")]
async fn lp_tile(
    state: web::Data<State>,
    tileID : web::Path<TileID>,
) -> Result<HttpResponse<actix_web::dev::Body>, Error> {
    let bbox = bbox(&tileID);
    let bbox_str = format!("{},{},{},{}", bbox[0], bbox[3], bbox[2], bbox[1]);
// https://lighttrends.lightpollutionmap.info/geoserver/gwc/service/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&SRS=EPSG%3A3857&LAYERS=lighttrends%3Aviirs_npp_202000&STYLES=viirs_c1&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&BBOX=-12523489.9598912%2C3757046.9879673603%2C-11897315.46189664%2C4383221.485961921
    let url = format!("https://lighttrends.lightpollutionmap.info/geoserver/gwc/service/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&TILED=true&SRS=EPSG:3857&LAYERS=lighttrends:viirs_npp_202000&STYLES=viirs_c1&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={}", bbox_str);

    let res  = state.client
        .get(url)
        .send()
        .map_err(Error::from)
        .and_then(|res| {
            let r =HttpResponse::build(res.status())
                .header("Content-Type", "image/png")
                .header(
                    "Content-Disposition",
                    "inline; filename=geoserver-dispatch.image",
                )
                .streaming(res);
            r
        }).await;

    res
    // Ok(HttpResponse::Ok().body("ALL OK!"))
}

fn get_geo_tiff_headers(){
    let tiff = TIFF::open("images/reprog_VNL_cog.tif") ;
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    // Parse config
    let config = Config::from_env().unwrap();

    // Create DB Pool
    let (pool,tile_pool) = establish_connection_sqlx(&config).await;

    // // Run migrations 
    // let mut conn = pool.get().await.unwrap();
    // let m = conn.deref_mut().deref_mut();
    // embedded::migrations::runner().run_async(m).await.unwrap();

    // Define routes and start server!
    //
    get_geo_tiff_headers();

    let auth_client = auth::auth_client(config.auth_redirect_url).expect("Failed to setup auth client");

    HttpServer::new(move || {
        let state = State{
            db:pool.clone(),
            tiles:tile_pool.clone(),
            // lp_tiles:lp_tiles.clone(),
            client: Client::new(),
            auth_client: auth_client.clone()
        };
        App::new()
            .data(state.clone())
            .service(health)
            .service(lp_tile)
            .service(auth::zooniverse_auth)
            .service(auth::login)
            .service(get_targets)
            .service(get_target)
            .service(get_incorp_places)
            .service(fs::Files::new("/", "./public").index_file("index.html"))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
