#!/bin/bash

cargo build --release
(cd frontend &&  yarn && yarn build)
mv frontned/build/* ./public
cargo install diesel_cli --no-default-features --features postgres
diesel database setup
