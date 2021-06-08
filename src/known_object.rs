use serde::{Serialize,Deserialize}

#[derive(Queryable, Serialize,Deserialize)]
pub struct KnownObject{
    pub id: u32,
    pub name: String,
    pub location: Option<Point>,
    pub known_object_type: Option<String>,
}

impl from
