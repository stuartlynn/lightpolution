use actix_web::{error,Result};
use derive_more::{Display,Error};

#[derive(Debug,Display,Error)]
#[display(fmt="Error: {}",name)]
pub struct LPError{
    pub name: &'static str
}

impl error::ResponseError for LPError{}


