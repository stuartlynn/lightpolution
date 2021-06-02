table! {
    light_sources (id) {
        id -> Int4,
        name -> Varchar,
        address -> Nullable<Varchar>,
        location -> Nullable<Point>,
        extent -> Nullable<Polygon>,
        notes -> Nullable<Varchar>,
    }
}
