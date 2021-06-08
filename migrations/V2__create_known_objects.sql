CREATE TABLE known_sources(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    address VARCHAR,
    location geometry(Point, 4326),
    known_object_type VARCHAR
)