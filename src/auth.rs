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


use actix_web::{get, Error,HttpResponse, Responder, web};

pub fn auth_client() -> anyhow::Result<BasicClient> {
    let client =
    BasicClient::new(
        ClientId::new("1b1a4f2cb3de2b7a2a76291093b2148bbba4ce6ad38544da773794d0adaceec8".to_string()),
        Some(ClientSecret::new("4280f2c3617c60f3a556e6f913db47f85c088ebb3060bbb80272b1aab61a922c".to_string())),
        AuthUrl::new("http://authorize".to_string())?,
        Some(TokenUrl::new("http://token".to_string())?)
    )
    // Set the URL the user will be redirected to after the authorization process.
    .set_redirect_uri(RedirectUrl::new("http://redirect".to_string())?);

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
    .set_pkce_challenge(pkce_challenge)
    .url();

    HttpResponse::Ok().body(auth_url.to_string())
}

#[get("/zooniverse")]
pub async fn zooniverse_auth() -> impl Responder{
    HttpResponse::Ok().body("zooniverse route")
}
