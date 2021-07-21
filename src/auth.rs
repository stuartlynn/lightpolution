use anyhow;
use oauth2::{
    AuthorizationCode,
    AuthUrl,
    ClientId,
    ClientSecret,
    CsrfToken,
    PkceCodeChallenge,
    RedirectUrl,
    Scope,
    TokenResponse,
    TokenUrl,
};
use oauth2::basic::BasicClient;
use oauth2::reqwest::async_http_client;
use crate::app_state::State;
use serde::{Deserialize};

use actix_web::{get, Error,HttpResponse, Responder, web, http::header};

pub fn auth_client() -> anyhow::Result<BasicClient> {
    let client =
    BasicClient::new(
        ClientId::new("1b1a4f2cb3de2b7a2a76291093b2148bbba4ce6ad38544da773794d0adaceec8".to_string()),
        Some(ClientSecret::new("4280f2c3617c60f3a556e6f913db47f85c088ebb3060bbb80272b1aab61a922c".to_string())),
        AuthUrl::new("https://www.zooniverse.org/oauth/authorize".to_string())?,
        Some(TokenUrl::new("https://panoptes.zooniverse.org/oauth/token".to_string())?)
    )
    // Set the URL the user will be redirected to after the authorization process.
    .set_redirect_uri(RedirectUrl::new("http://localhost:8080".to_string())?);

    Ok(client)
}

#[get("/login")]
pub async fn login(state: web::Data<State>) ->impl Responder{
    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();
    let (auth_url, csrf_token) = state.auth_client
    .authorize_url(CsrfToken::new_random)
    // Set the desired scopes.
    .add_scope(Scope::new("user".to_string()))
    .add_scope(Scope::new("project".to_string()))
    .add_scope(Scope::new("group".to_string()))
    .add_scope(Scope::new("collection".to_string()))
    .add_scope(Scope::new("subject".to_string()))
    .add_scope(Scope::new("classification".to_string()))
    .add_scope(Scope::new("subject".to_string()))
    .add_scope(Scope::new("medium".to_string()))
    .add_scope(Scope::new("organization".to_string()))
    .add_scope(Scope::new("translation".to_string()))
    .add_scope(Scope::new("public".to_string()))
    // Set the PKCE code challenge.
    // .set_pkce_challenge(pkce_challenge)
    .use_implicit_flow()
    .url();

    println!("Redirecting to {}", auth_url);

    HttpResponse::Found()
        .header(header::LOCATION, auth_url.to_string())
        .finish()
}

#[derive(Deserialize,Debug )]
pub struct ZooniverseAuthResponse{
    access_token:String ,
    token_type: String,
    expires_in: u32,
    state:String
}
#[get("/zooniverse")]
pub async fn zooniverse_auth(state: web::Data<State>, request: web::HttpRequest) -> impl Responder{
    let headers = request.headers();
    println!("{:?}",headers);

    let uri = request.uri();
    
    // let parts = uri.parts();
    // let query_path = parts.query_path;


    // println!(" response is {:?}",auth_response);
    HttpResponse::Ok().body(format!("{} {}",request.path(), request.query_string()))
    // let token_result =
    // state.auth_client 
    //     .exchange_code(AuthorizationCode::new(auth_response.code.clone()))
    //     // Set the PKCE code verifier.
    //     // .set_pkce_verifier(pkce_verifier)
    //     .request_async(async_http_client).await;
    // match token_result{
    //     Ok(token) => HttpResponse::Ok().body(format!("got token from zooniverse {:?}",token)),
    //     Err(e) => HttpResponse::Ok().body(format!("Failed to get token {:?})",e))
    // }
    
}
