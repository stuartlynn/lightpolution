use serde::{Serialize,Deserialize}

#[derive(Queryable, Serialize,Deserialize)]
pub struct KnownObject{
    pub id: i32,
    pub name: String,
    pub location: Option<Point>,
    pub known_object_type: Option<String>,
}

impl From<PgRow> for KnownObject{
    fn from(row:PgRow) ->Self{
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
            location,
            extent,
            known_object_type: row.get("known_object_type"),
        }
    }
}
