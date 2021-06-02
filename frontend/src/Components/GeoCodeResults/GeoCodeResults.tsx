import React from 'react'
import {Styles} from './GeoCodeResultsStyles'

interface GeoCodingResultsProps{
    isSearchPrimed:boolean,
    onSetPrimeSearch: (prime: boolean)=>void,
    results: any[],
    searchLoc: [number,number] | undefined
}

export const GeoCodeResults: React.FC<GeoCodingResultsProps>=({isSearchPrimed,results, searchLoc, onSetPrimeSearch})=>{
    return(
        <Styles.GeoCodeResults>
            <button type='submit' onClick={()=>onSetPrimeSearch(true)}>{isSearchPrimed ? 'Click map to search' : "Search Loc"}</button>
            {searchLoc &&
                <span>{searchLoc[0].toFixed(2)},{searchLoc[1].toFixed(2)}</span>
            }
            <Styles.Results>
                {results.map((result)=>
                    <Styles.Result key={result.id}>
                        {result.text}
                    </Styles.Result>
                )}
            </Styles.Results>
        </Styles.GeoCodeResults>
    )
}