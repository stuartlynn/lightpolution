use deadpool_postgres::Client;
use crate::config::Config;
use tokio_postgres::NoTls;
use deadpool_postgres::Pool;

pub async fn establish_connection(config: &Config) -> Pool{
    config.pg.create_pool(NoTls).expect("FAILED TO CONNECT TO DB")
}
