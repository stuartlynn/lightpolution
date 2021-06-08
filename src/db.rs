use crate::config::Config;
use sqlx::postgres::PgPoolOptions;

pub type DBPool = sqlx::PgPool;



pub async fn establish_connection_sqlx(config: &Config)-> DBPool {
    let data_pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
        .expect("FAiled to connect to DB");
    data_pool
}