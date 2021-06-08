pub use ::config::ConfigError;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct Config {
    pub pg: deadpool_postgres::Config,
}

impl Config {
    pub fn from_env() -> Result<Self, ConfigError> {
        let mut cfg = ::config::Config::new();
        cfg.set_default("pg.dbname", "lightpolution");
        cfg.set_default("pg.host", "localhost");
        cfg.set_default("pg.user", "stuart");
        cfg.merge(::config::Environment::new())?;
        cfg.try_into()
    }
}