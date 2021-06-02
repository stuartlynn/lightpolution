import React, {useState} from 'react'
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer, GeoJsonLayer, IconLayer} from '@deck.gl/layers';
import {Controls} from 'Components/Controls/Controls'
import {GeoCodeResults} from 'Components/GeoCodeResults/GeoCodeResults'
import { usePlaces } from 'Hooks/usePlaces';
import {Styles} from './HomePageStyles'

const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.828175,
  zoom: 5,
  pitch: 0,
  bearing: 0
};

export const HomePage: React.FC = () => {
    const [showNightLight, setShowNightLight] = useState(true)
    const [showIncorporated, setShowIncorportaed] = useState(true)
    const [showTargets, setShowTargets] = useState(false)
    const [searchPrimed, setSearchPrimed] = useState(false)
    const [searchLoc, setSearchLoc] = useState<[number,number] | undefined>(undefined)
    const [nightLightOpacity, setNightLightOpacity] = useState(0.7)
    const [baseMap , setBaseMap] = useState<string>("satellite-v9")

    const geocodeResults =usePlaces(searchLoc)
    console.log("Geocode results ", geocodeResults);

    const LightPolutionLayer = new TileLayer({
        data: "/light_polution/{x}/{y}/{z}",
        visible: showNightLight,
        opacity: nightLightOpacity,
        renderSubLayers: props => {
            const {
                bbox: {west, south, east, north}
            } = props.tile;

            return [
                new BitmapLayer(props, {
                    data: null,
                    image: props.data,
                    bounds: [west, south, east, north]
                })
            ]
        }
    })
    
    const handleSelect = (point:any)=>{
        if(searchPrimed){
            setSearchPrimed(false); 
            setSearchLoc(point.coordinate)
        }
    }

    const ICON_MAPPING = {
        marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
    };

    const SearchMarkerLayer = new IconLayer({
        id:'search_marker',
        data: searchLoc ? [{coords: searchLoc}] : [],
        iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        getIcon: d => 'marker',
        sizeScale: 15,
        getPosition: (d:any) => d.coords,
        getSize: d => 2,
    })

    const TargetsLayer = new GeoJsonLayer({
        id:'targets',
        data: "/non_incorporated_sources.geojson",
        visible: showTargets,
        getRadius:10,
        pointRadiusUnits: "pixels",
        stroked:true,
        filled: true,
        getFillColor: [255,0,0,255],
        getStrokeColor: [255,255,255,255]
    })

    const IncorporatedPlacesLayer  = new GeoJsonLayer({
        data:"incorporated_places.geojson",
        visible: showIncorporated,
        stroked: true,
        filled: true,
        getFillColor: [255,255,255,255],
        getLineColor: [255,0,0,0]
    })

    return(
        <Styles.HomePage>
            <Controls 
                showIncorporated={showIncorporated}
                showNightLight= {showNightLight}
                showTargets = {showTargets}
                baseMap ={ baseMap}
                onSetBaseMap= {setBaseMap}
                onSetShowIncorparted={setShowIncorportaed}
                onSetShowNightLight={setShowNightLight}
                onSetNightLightOpacity={setNightLightOpacity}
                onSetShowTargets={setShowTargets}
                nightLightOpacity={nightLightOpacity}
            />

            <GeoCodeResults 
                isSearchPrimed={searchPrimed}
                onSetPrimeSearch={setSearchPrimed}
                searchLoc= {searchLoc}
                results= {geocodeResults}
            />

            <DeckGL 
            initialViewState={INITIAL_VIEW_STATE}
            controller
            // @ts-ignore
            layers={[LightPolutionLayer,IncorporatedPlacesLayer, TargetsLayer, SearchMarkerLayer ]}
            onClick={handleSelect}
            >
                <StaticMap  mapStyle={`mapbox://styles/mapbox/${baseMap}`} mapboxApiAccessToken="pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw" />
            </DeckGL>
            Home Page
        </Styles.HomePage>
    )
}
