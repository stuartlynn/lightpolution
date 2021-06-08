use actix_files as fs;
use actix_web::client::Client;

use actix_web::{get, post, web, App, Error, HttpResponse, HttpServer, Responder};
use futures::future::Future;
use futures::TryFutureExt;
use serde::{Deserialize, Serialize};
use crate::config::Config;
use db::establish_connection;
use deadpool_postgres::Pool;
use crate::light_source::LightSource;
use crate::tiles::{bbox,TileID};
use std::ops::{DerefMut};


extern crate dotenv;
extern crate refinery;

mod db;
mod config;
mod light_source;
mod tiles;

mod embedded {
    use refinery::embed_migrations;
    embed_migrations!("./migrations");
}

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().body("Still alive!")
}


#[get("/light_sources/{id}")]
async fn get_target(state :web::Data<State>, web::Path(id): web::Path<u32>)-> impl Responder{
    let source = LightSource::find(&state.db,id).await;

    source.unwrap().to_geojson(false).to_string()
}

#[get("/light_polution/{x}/{y}/{z}")]
async fn lp_tile(
    client: web::Data<Client>,
    web::Path(params): web::Path<TileID>,
) -> Result<HttpResponse, Error> {
    let bbox = bbox(&params);
    let bbox_str = format!("{},{},{},{}", bbox[0], bbox[3], bbox[2], bbox[1]);
    let url = format!("https://lighttrends.lightpollutionmap.info/geoserver/gwc/service/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&TILED=true&SRS=EPSG:3857&LAYERS=lighttrends:viirs_npp_201600&STYLES=viirs_c1&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={}", bbox_str);

    client
        .get(url)
        .send()
        .map_err(Error::from)
        .and_then(|res| {
            HttpResponse::build(res.status())
                .header("Content-Type", "image/png")
                .header(
                    "Content-Disposition",
                    "inline; filename=geoserver-dispatch.image",
                )
                .streaming(res)
        })
        .await
}

#[derive(Clone)]
struct State{
    pub db: Pool,
    pub client: Client
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    // Parse config
    let config = Config::from_env().unwrap();

    // Create DB Pool
    let pool = establish_connection(&config).await;

    // // Run migrations 
    // let mut conn = pool.get().await.unwrap();
    // let m = conn.deref_mut().deref_mut();
    // embedded::migrations::runner().run_async(m).await.unwrap();

    // Define routes and start server!

    HttpServer::new(move || {
        let state = State{
            db:pool.clone(),
            client: Client::new()
        };
        App::new()
            .data(state.clone())
            .service(health)
            .service(lp_tile)
            .service(get_target)
            .service(fs::Files::new("/", "./public").index_file("index.html"))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
