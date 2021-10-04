use crate::db::{DBPool, TilePool};
use oauth2::basic::BasicClient;
use awc::Client;



#[derive(Clone)]
pub struct State{
    pub db: DBPool,
    pub client: Client,
    pub tiles: TilePool,
    // pub lp_tiles: TilePool,
    pub auth_client: BasicClient
}
