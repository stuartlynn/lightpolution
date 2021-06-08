CREATE TABLE light_sources(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    location geometry(Point, 4326),
    extent geometry(Polygon, 4326),
    nodes VARCHAR,
    target_id INT,
    known_object_type VARCHAR,
    known_object_id INT 
)