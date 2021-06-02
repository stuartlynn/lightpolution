import geopandas as gp
import pandas as pd 
import requests
from pathlib import Path

RAW_PATH = Path("./raw")
PROCESSING_PATH = Path("./processing")
DONE_PATH = Path("./done")


def download_file(state_no):
    file_name = f"tl_2020_{state_no:0>2}_place" 
    cached_file = (RAW_PATH / file_name).with_suffix(".geojson")
    if(cached_file.exists()):
        print(cached_file)
        return gp.read_file(cached_file)
    else:
        data = gp.read_file(f"https://www2.census.gov/geo/tiger/TIGER2020/PLACE/{file_name}.zip")
        data = data.to_crs("EPSG:4326")
        data.to_file(cached_file, driver="GeoJSON")
        return data

def download_and_combine():
    combined = gp.GeoDataFrame()
    for state in range(1,76):
        try:
            places = download_file(state)
            combined = combined.append(places)
        except:
            print("issue with state ",state)
    combined.to_file(PROCESSING_PATH / "combined.geojson", driver="GeoJSON")



def remove_columns_and_simplify():
    data = gp.read_file(PROCESSING_PATH / "combined.geojson")
    data = data[['NAME',"geometry","GEOID"]]
    data = data.simplify(0.0001)
    data.to_file(DONE_PATH / "incorporated_places.geojson", driver="GeoJSON")

