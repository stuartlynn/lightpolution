import React from 'react'
import { Styles } from 'Components/Controls/ControlsStyles'
import Select from 'react-select'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';

interface ControlsProps{
    showIncorporated: boolean,
    showNightLight: boolean,
    showTargets: boolean,
    nightLightOpacity: number 
    baseMap: string,
    minFlux: number,
    showPowerPlants: boolean,
    onSetBaseMap: (baseMap: string)=>void,
    onSetShowIncorparted: (show : boolean )=>void,
    onSetShowNightLight: (show : boolean )=>void,
    onSetNightLightOpacity: (opacity:number) =>void,
    onSetShowTargets:(show: boolean)=>void,
    onSetShowPowerPlants:(show: boolean)=>void,
    onMinFluxChange: (flux: number)=>void
}

const MapOptions =[
    {value:"satellite-v9", label: "Satellite"},
    {value:"light-v10", label:'Light'},
    {value:"dark-v10" , label:'Dark'},
    {value:"streets-v11", label: 'Streets'},
    {value:"outdoors-v11", label:"Outdoors"}
]

export const Controls: React.FC<ControlsProps> =({
    showIncorporated,
    showNightLight, 
    showTargets,
    showPowerPlants,
    minFlux,
    onMinFluxChange,
    nightLightOpacity, 
    onSetBaseMap,
    baseMap,
    onSetShowIncorparted,
    onSetShowNightLight,
    onSetShowTargets,
    onSetShowPowerPlants
})=>{
    const selection = MapOptions.find(mo => mo.value===baseMap)

    return(
        <Styles.Controls>
            <Styles.Form>
            <label >Show incorporated places
                <input type='checkbox' checked={showIncorporated} onChange={(e)=> onSetShowIncorparted(e.target.checked)} /> 
            </label>
            <label>Show night light
                <input type='checkbox' checked={showNightLight} onChange={(e)=> onSetShowNightLight(e.target.checked)} /> 
            </label>
            <label>Show targets 
                <input type='checkbox' checked={showTargets} onChange={(e)=> onSetShowTargets(e.target.checked)} /> 
            </label>
            <label>Show powerplants 
                <input type='checkbox' checked={showPowerPlants} onChange={(e)=> onSetShowPowerPlants(e.target.checked)} /> 
            </label>

            <Select options={MapOptions} value={selection} placeholder="BaseMap" onChange={(option)=> onSetBaseMap(option!.value)}/>
            <label>
                Min target flux
                <Slider min={0} max={1000} step={10} value={minFlux} onChange={onMinFluxChange}/>
            </label>
            </Styles.Form>
        </Styles.Controls>
    )
}