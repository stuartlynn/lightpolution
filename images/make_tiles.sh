#!/bin/bash
docker run --rm -v $(pwd):/data/ joeakeem/gdal2mbtiles --name lp_2020 -v --min-resolution 8 --max-resolution 12 --no-fill-borders /data/VNL_v2_npp_2020_global_vcmslcfg_c202101211500.average.tif  /data/VNL_v2_npp_2020_global_vcmslcfg_c202101211500.average.mbtiles
