use serde::{Serialize,Deserialize}

#[derive(Queryable, Serialize,Deserialize)]
pub struct LightSource{
    pub id: usize,
    pub name: String,
    pub address: Option<String>,
    pub location: Option<Point>,
    pub extent: Option<Polygon>,
    pub nodes: Option<String>
}