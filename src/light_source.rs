use serde::{Serialize,Deserialize};
use geo_types::{Point,Polygon};
use tokio_postgres::Row;
use std::convert::From;
use geozero::wkt::WktWriter;
use geozero::wkb;
use deadpool_postgres::Pool;
use actix_web::Error;
use geojson::{GeoJson, Feature, Geometry,Value};
use serde_json::{to_value,Map};

#[derive(Serialize,Deserialize,Default,Debug)]
pub struct LightSource{
    pub id: u32,
    pub name: String,
    pub address: Option<String>,
    pub location: Option<Point<f64>>,
    pub extent: Option<Polygon<f64>>,
    pub nodes: Option<String>,
    pub target_id:Option<String>,
    pub known_object_type: Option<u32>,
    pub known_object_id: Option<u32>
}


impl From<Row> for  LightSource{
    fn from(row:Row) ->Self{

        let extent: wkb::Decode<geo_types::Geometry<f64>> = row.get("extent");
        let extent  = if let Some(geo_types::Geometry::Polygon(poly)) = extent.geometry{
            Some(poly)
        }
        else{
            None
        };

        Self{
            id: row.get("id"),
            name: row.get("name"),
            address: row.get("address"),
            location: row.get("location"),
            extent,
            nodes: row.get("nodes"),
            target_id: row.get("target_id"),
            known_object_type: row.get("known_object_type"),
            known_object_id: row.get("known_object_id")
        }
    }
}

impl LightSource{
    pub async fn find(pool:&Pool, id:u32)-> Result<Self, Error>{
        let conn = pool.get().await.unwrap();
        let stmt = conn.prepare_cached("SELECT * from light_sources where id = $1").await.unwrap();
        let result = conn.query_one(&stmt, &[&id]).await.unwrap().into();
        Ok(result)
    }

    pub fn to_geojson(&self, extent:bool)-> Feature{

        let mut properties = Map::new(); 
        properties.insert("id".into(), to_value(self.id).unwrap());
        properties.insert("name".into(), to_value(&self.name).unwrap());
        properties.insert("address".into(), to_value(&self.address).unwrap());
        properties.insert("nodes".into(), to_value(&self.nodes).unwrap());
        properties.insert("target_id".into(), to_value(&self.target_id).unwrap());
        properties.insert("known_object_type".into(), to_value(&self.known_object_type).unwrap());


        let extent_geom: Option<geojson::Geometry>=  match &self.extent{
            Some(poly) => Some(geojson::Value::from(poly).into()),
            None => None 
        } ;

        let point_geom: Option<geojson::Geometry>=  match &self.location{
            Some(point) => Some(geojson::Value::from(point).into()),
            None => None 
        } ;

        let geometry = match extent{
            True => extent_geom,
            False => point_geom
        };

        Feature{
            bbox:None,
            geometry, 
            properties: Some(properties),
            foreign_members: None,
            id:None
        }
    }
}