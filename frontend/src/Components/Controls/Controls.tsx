import React from 'react'
import { Styles } from 'Components/Controls/ControlsStyles'
import Select from 'react-select'

interface ControlsProps{
    showIncorporated: boolean,
    showNightLight: boolean,
    showTargets: boolean,
    nightLightOpacity: number 
    baseMap: string,
    onSetBaseMap: (baseMap: string)=>void,
    onSetShowIncorparted: (show : boolean )=>void,
    onSetShowNightLight: (show : boolean )=>void,
    onSetNightLightOpacity: (opacity:number) =>void,
    onSetShowTargets:(show: boolean)=>void
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
    nightLightOpacity, 
    onSetBaseMap,
    baseMap,
    onSetShowIncorparted,
    onSetShowNightLight,
    onSetShowTargets
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

            <Select options={MapOptions} value={selection} placeholder="BaseMap" onChange={(option)=> onSetBaseMap(option!.value)}/>
            </Styles.Form>
        </Styles.Controls>
    )
}