use actix_files as fs;
use actix_web::client::Client;
use actix_web::{get, post, web, App, Error, HttpResponse, HttpServer, Responder};
use futures::future::Future;
use futures::TryFutureExt;
use serde::{Deserialize, Serialize};
use std::f64::consts::PI;

#[macro_use]
extern crate diesel;
extern crate dotenv;

mod db;

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().body("Still alive!")
}

#[derive(Serialize, Deserialize)]
pub struct TileID {
    x: usize,
    y: usize,
    z: usize,
}

pub fn bbox(tile_id: &TileID) -> [f64; 4] {
    let x = tile_id.x;
    let y = tile_id.y;
    let z = tile_id.z;

    let max = 6378137.0 * PI;
    let res = max * 2.0 / 2.0_f64.powf(z as f64) as f64;

    [
        -max + (x as f64) * res,
        max - ((y as f64) * res),
        -max + (x as f64) * res + res,
        max - ((y as f64) * res) - res,
    ]
}

#[get("/light_polution/{x}/{y}/{z}")]
async fn lp_tile(
    client: web::Data<Client>,
    web::Path(params): web::Path<TileID>,
) -> Result<HttpResponse, Error> {
    let bbox = bbox(&params);
    let bbox_str = format!("{},{},{},{}", bbox[0], bbox[3], bbox[2], bbox[1]);
    let url = format!("https://lighttrends.lightpollutionmap.info/geoserver/gwc/service/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&TILED=true&SRS=EPSG:3857&LAYERS=lighttrends:viirs_npp_201600&STYLES=viirs_c1&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&BBOX={}", bbox_str);
    println!("proxting {}", url);
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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Connecting");
    HttpServer::new(|| {
        App::new()
            .data(Client::new())
            .service(health)
            .service(lp_tile)
            .service(fs::Files::new("/", "./public").index_file("index.html"))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
