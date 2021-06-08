use serde::{Serialize,Deserialize};
use geo_types::{Point,Polygon};
use std::convert::From;
use geozero::wkt::WktWriter;
use geozero::wkb;
use deadpool_postgres::Pool;
use actix_web::Error;
use geojson::{GeoJson, Feature, Geometry,Value, FeatureCollection};
use serde_json::{to_value,Map};
use sqlx::postgres::{PgRow};
use sqlx::{Column, Row,TypeInfo};
use crate::db::DBPool;
use crate::error::LPError;

#[derive(Serialize,Deserialize,Default,Debug)]
pub struct LightSource{
    pub id: i32,
    pub name: String,
    pub address: Option<String>,
    pub location: Option<Point<f64>>,
    pub extent: Option<Polygon<f64>>,
    pub nodes: Option<String>,
    pub target_id:Option<String>,
    pub known_object_type: Option<u32>,
    pub known_object_id: Option<u32>
}

impl From<PgRow> for LightSource{
    fn from(row:PgRow) ->Self{
        let extent: wkb::Decode<geo_types::Geometry<f64>> = row.get("extent");
        let extent  = if let Some(geo_types::Geometry::Polygon(poly)) = extent.geometry{
            Some(poly)
        }
        else{
            None
        };

        let location: wkb::Decode<geo_types::Geometry<f64>> = row.get("location");
        let location = if let Some(geo_types::Geometry::Point(point)) = location.geometry{
            Some(point)
        }
        else{
            None
        };

        println!("location is {:?}", location);

        Self{
            id: row.get("id"),
            name: row.get("name"),
            address: row.get("address"),
            location,
            extent,
            nodes: row.get("nodes"),
            target_id: row.get("target_id"),
            known_object_type: row.get("known_object_type"),
            known_object_id: row.get("known_object_id")
        }
    }
}

impl LightSource{
    pub async fn find(pool:&DBPool, id:i32)-> Result<Self, LPError>{
        let query =sqlx::query("SELECT * FROM light_sources where id = $1");


        let result: Self = query
                          .bind(id)
                          .map(|row: PgRow| row.into())
                          .fetch_one(pool)
                          .await
                          .map_err(|_| LPError{name: "Failed to get light sources"})?;
        
        Ok(result)
    }

    pub async fn all(pool:&DBPool) -> Result<Vec<Self>,LPError>{
        let query =sqlx::query("SELECT * FROM light_sources");

        let result: Vec<Self> = query
                          .map(|row: PgRow| row.into())
                          .fetch_all(pool)
                          .await
                          .map_err(|_| LPError{name: "Failed to get light sources"})?;
        
        Ok(result)
    }

    pub fn to_feature_col(features: Vec<Self>)->FeatureCollection{
        let geo_features : Vec<Feature> = features.iter().map(|f| f.to_geojson(false)).collect(); 
        FeatureCollection{
            bbox:None,
            features: geo_features,
            foreign_members:None
        }
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
            true => extent_geom,
            false => point_geom
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