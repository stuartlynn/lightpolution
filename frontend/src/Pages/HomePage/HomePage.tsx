import React, { useState, useEffect } from "react";
import { FlyToInterpolator } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";
import { TileLayer, MVTLayer } from "@deck.gl/geo-layers";
import { BitmapLayer, GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import { Controls } from "Components/Controls/Controls";
import { GeoCodeResults } from "Components/GeoCodeResults/GeoCodeResults";
import { usePlaces, usePlagesGeocodeEarth } from "Hooks/usePlaces";
import { DataFilterExtension } from "@deck.gl/extensions";
import chroma from "chroma-js";
import { useCurrentSubject } from "Hooks/useCurrentSubject";
import { Styles } from "./HomePageStyles";

const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.828175,
  zoom: 5,
  pitch: 0,
  bearing: 0,
};

const COLOR = [
  "#66C5CC",
  "#F6CF71",
  "#F89C74",
  "#DCB0F2",
  "#87C55F",
  "#9EB9F3",
  "#FE88B1",
  "#C9DB74",
  "#8BE0A4",
  "#B497E7",
  "#D3B484",
  "#B3B3B3",
];

export const HomePage: React.FC = () => {
  const [showNightLight, setShowNightLight] = useState(true);
  const [showIncorporated, setShowIncorportaed] = useState(true);
  const [showTargets, setShowTargets] = useState(false);
  const [showPowerPlants, setShowPowerPlants] = useState(false);
  const [minFlux, setMinFlux] = useState(0);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const [searchPrimed, setSearchPrimed] = useState(false);
  const [searchLoc, setSearchLoc] =
    useState<[number, number] | undefined>(undefined);
  const [nightLightOpacity, setNightLightOpacity] = useState(0.7);
  const [baseMap, setBaseMap] = useState<string>("satellite-v9");

  const geocodeResults = usePlaces(searchLoc);
  const geocodeEarthResults = usePlagesGeocodeEarth(searchLoc);

  const {currentSubject, nextSubject} = useCurrentSubject();

  // Zooms to the currently active subject
  useEffect(() => {
    if (currentSubject) {
      setViewState({
        ...INITIAL_VIEW_STATE,
        latitude: currentSubject.metadata.lat,
        longitude: currentSubject.metadata.lng,
        zoom: 13,
        // @ts-ignore
        transitionDuration: 1000,
        // @ts-ignore
        transitionInterpolator: new FlyToInterpolator(),
      });
    }
  }, [currentSubject, INITIAL_VIEW_STATE]);

  const LightPolutionLayer = new TileLayer({
    data: "/light_polution/{x}/{y}/{z}",
    visible: showNightLight,
    opacity: nightLightOpacity,
    maxZoom: 8,
    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return [
        new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north],
        }),
      ];
    },
  });

  const handleSelect = (point: any) => {
    if (searchPrimed) {
      setSearchPrimed(false);
      setSearchLoc(point.coordinate);
    }
  };

  const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
  };


  const SearchMarkerLayer = new IconLayer({
    id: "search_marker",
    data: currentSubject ?  [{coords:[currentSubject.metadata.lng, currentSubject.metadata.lat]}] : [] 
,
    iconAtlas:
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    iconMapping: ICON_MAPPING,
    getIcon: (d) => "marker",
    sizeScale: 8,
    getPosition: (d: any) => d.coords,
    getSize: (d) => 10,
  });

  const TargetsLayer = new GeoJsonLayer({
    id: "targets",
    data: "/non_incorporated_sources.geojson",
    visible: showTargets,
    getRadius: 5,
    pointRadiusUnits: "pixels",
    stroked: true,
    filled: true,
    getFillColor: chroma(COLOR[2]).rgb(),
    radiusMinPixels: 10,
    lineWidthMinPixels: 2,
    getLineColor: [255, 255, 255, 255],
    getFilterValue: (f: any) => f.properties.flux,
    extensions: [new DataFilterExtension()],
    filterRange: [minFlux, 40000],
  });

  const PowerPlantLayer = new GeoJsonLayer({
    id: "powerplants",
    data: "/power_plants.geojson",
    visible: showPowerPlants,
    getRadius: 5,
    pointRadiusUnits: "pixels",
    stroked: true,
    filled: true,
    radiusMinPixels: 10,
    lineWidthMinPixels: 2,
    getLineColor: [255, 255, 255, 255],
    getFillColor: chroma(COLOR[3]).rgb(),
  });

  // const IncorporatedPlacesLayer  = new GeoJsonLayer({
  //     data:"incorporated_places.geojson",
  //     visible: showIncorporated,
  //     stroked: true,
  //     filled: true,
  //     getFillColor: chroma(COLOR[1]).rgb(),
  //     getLineColor: [255,255,255],
  //     lineWidthMinPixels:1,
  //     getLineWidth: 1

  // })

  const IncorporatedPlacesLayer = new MVTLayer({
    data: "/incorp_places/{z}/{x}/{y}",
    visible: showIncorporated,
    // @ts-ignore
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],
    getLineWidth: 10,
    lineWidthMinPixels: 1,
    // getFillColor: chroma(COLOR[1]).rgb(),
    // getLineColor: [255,255,255],
    // lineWidthMinPixels:1,
    // getLineWidth: 1
  });

  return (
    <Styles.HomePage>
      <Controls
        showIncorporated={showIncorporated}
        showNightLight={showNightLight}
        showTargets={showTargets}
        showPowerPlants={showPowerPlants}
        baseMap={baseMap}
        onSetBaseMap={setBaseMap}
        onSetShowIncorparted={setShowIncorportaed}
        onSetShowNightLight={setShowNightLight}
        onSetNightLightOpacity={setNightLightOpacity}
        onSetShowTargets={setShowTargets}
        onSetShowPowerPlants={setShowPowerPlants}
        nightLightOpacity={nightLightOpacity}
        minFlux={minFlux}
        onMinFluxChange={setMinFlux}
        onNextSubject={nextSubject}
      />
      <GeoCodeResults
        isSearchPrimed={searchPrimed}
        onSetPrimeSearch={setSearchPrimed}
        searchLoc={searchLoc}
        results={geocodeResults}
      />
      <DeckGL
        initialViewState={viewState}
        controller
        // @ts-ignore
        layers={[
          LightPolutionLayer,
          IncorporatedPlacesLayer,
          TargetsLayer,
          SearchMarkerLayer,
          PowerPlantLayer,
        ]}
        onClick={handleSelect}
      >
        <StaticMap
          mapStyle={`mapbox://styles/mapbox/${baseMap}`}
          mapboxApiAccessToken="pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw"
        />
      </DeckGL>
      Home Page
    </Styles.HomePage>
  );
};
