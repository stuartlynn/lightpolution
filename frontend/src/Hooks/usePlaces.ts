import { useState, useEffect, useRef } from 'react';

const BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const ACCESS_TOKEN="pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw"
const GEOCODE_EARTH='https://api.geocode.earth/v1/reverse?api_key=ge-6fe5563f30049298'

export function usePlaces(
    loc: [number, number] | undefined
): any[] {

    const [results,setResults] = useState<any[]>([])
    useEffect(()=>{
        if(loc){
            fetch(`${BASE_URL}${loc[0]},${loc[1]}.json?types=poi,address&access_token=${ACCESS_TOKEN}`)
            .then((r)=>r.json())
            .then((result)=>{
                setResults(result.features)
            })
        }
    },[loc])

    return results
}


export function usePlagesGeocodeEarth(
    loc:[number,number] | undefined
):any[]{
    const [results,setResults] = useState<any[]>([])
    useEffect(()=>{
        if(loc){
            fetch(`${GEOCODE_EARTH}&point.lat=${loc[1]}&point.lon=${loc[0]}&layers=venue,address`)
            .then((r)=>r.json())
            .then((result)=>{
                setResults(result.features)
            })
        }
    },[loc])

    return results
}
