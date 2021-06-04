import pandas as pd 
from urllib.request import urlretrieve
from zipfile import ZipFile
import geopandas as gp
from pathlib import Path

RAW_PATH = Path("./raw")
PROCESSING_PATH = Path("./processing")
DONE_PATH = Path("./done")

# https://datasets.wri.org/dataset/globalpowerplantdatabase 
url ="https://wri-dataportal-prod.s3.amazonaws.com/manual/global_power_plant_database_v_1_3.zip"

def download_file():
    urlretrieve(url, RAW_PATH / "global_power_plant_database_v_1_3.zip")

def extract_csv():
    with ZipFile(RAW_PATH / "global_power_plant_database_v_1_3.zip") as zf:
        data = pd.read_csv(zf.open("global_power_plant_database.csv"),low_memory=False)
    return data


def save_result(data):
    geo = gp.GeoDataFrame(data, geometry= gp.points_from_xy(data.longitude, data.latitude), crs='epsg:4326')
    geo.to_file(DONE_PATH / "power_plants.geojson", driver='GeoJSON')

if __name__ == "__main__":
    download_file()
    data = extract_csv()
    save_result(data)
    print("Done!")