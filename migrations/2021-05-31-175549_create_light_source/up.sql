-- Your SQL goes here
CREATE TABLE light_sources(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    address VARCHAR,
    location POINT,
    extent POLYGON,
    notes VARCHAR 
)