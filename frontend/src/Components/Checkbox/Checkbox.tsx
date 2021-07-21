import React from 'react'
import {CheckBox as GormmetCheckbox} from 'grommet'
import {SpacedText} from '@zooniverse/react-components'

interface CheckboxProps{
  checked:boolean,
  onChange: (checked:boolean)=>void,
  label: string
}

export const Checkbox: React.FC<CheckboxProps> = ({checked,onChange,label})=>{

    return(
      <GormmetCheckbox
        checked={checked}
        onChange= {()=> onChange(!checked)}
        label = {<SpacedText>{label}</SpacedText>}
        toggle
      />
    )
}
