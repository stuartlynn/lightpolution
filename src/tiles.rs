use serde::{Serialize,Deserialize};
use std::f64::consts::PI;

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