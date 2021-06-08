use serde::{Serialize,Deserialize};
use geo_types::{Point};
use postgres::rows::Row;


#[derive(Serialize,Deserialize)]
pub struct Target{
    pub id: usize,
    pub flux: f64,
    pub sharpness: f64,
    pub roundness1: f64,
    pub roundness2: f64,
    pub npix: f64,
    pub peak: f64,
    pub location: Option<Point> 
}

impl From<Row> for Target{
    fn from(row:Row)->Seld{
        id: row.get("id"),
        flux: row.get("flux"),
        sharpness: row.get("sharpness"),
        roundness1: row.get("roundness1"),
        roundness2: row.get("roundness2"),
        npix: row.get("npix"),
        peak: row.get("peak"),
        location: row.get("location"),

    }
}