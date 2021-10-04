use crate::config::Config;
use sqlx::postgres::PgPoolOptions;
use sqlx::sqlite::SqlitePoolOptions;

pub type DBPool = sqlx::PgPool;
pub type TilePool = sqlx::SqlitePool;


pub async fn establish_connection_sqlx(config: &Config)-> (DBPool,TilePool) {

    let data_pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
        .expect("FAiled to connect to datapool database");

    let tile_pool = SqlitePoolOptions::new()
        .max_connections(10)
        .connect(&config.tile_url)
        .await
        .expect("FAiled to connect to tile database");

    // let lp_tile_pool = SqlitePoolOptions::new()
    //     .max_connections(10)
    //     .connect(&config.lp_tile_url)
    //     .await
    //     .expect("FAiled to connect to lp tile pool DB");

    (data_pool, tile_pool )

}
