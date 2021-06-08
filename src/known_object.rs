
use serde::{Serialize,Deserialize}

#[derive(Queryable, Serialize,Deserialize)]
pub struct KnownObject{
    pub id: usize,
    pub name: String,
    pub location: Option<Point>,
    pub known_object_type: Option<String>,
}