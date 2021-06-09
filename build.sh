#!/bin/bash

cargo build --release
(cd frontend &&  yarn && yarn build)
rm -rf public
mv frontend/build ./public
cargo install diesel_cli --no-default-features --features postgres
