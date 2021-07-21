import React from "react";
import { Styles } from "Components/Controls/ControlsStyles";
import {Checkbox} from 'Components/Checkbox/Checkbox'
import Select from "react-select";
import Slider from "rc-slider";
import { PrimaryButton, Tab, Tabs, SpacedText, AdminCheckbox } from "@zooniverse/react-components";
import "rc-slider/assets/index.css";

interface ControlsProps {
  showIncorporated: boolean;
  showNightLight: boolean;
  showTargets: boolean;
  nightLightOpacity: number;
  baseMap: string;
  minFlux: number;
  showPowerPlants: boolean;
  onSetBaseMap: (baseMap: string) => void;
  onSetShowIncorparted: (show: boolean) => void;
  onSetShowNightLight: (show: boolean) => void;
  onSetNightLightOpacity: (opacity: number) => void;
  onSetShowTargets: (show: boolean) => void;
  onSetShowPowerPlants: (show: boolean) => void;
  onMinFluxChange: (flux: number) => void;
  onNextSubject: ()=>void;
}

const MapOptions = [
  { value: "satellite-v9", label: "Satellite" },
  { value: "light-v10", label: "Light" },
  { value: "dark-v10", label: "Dark" },
  { value: "streets-v11", label: "Streets" },
  { value: "outdoors-v11", label: "Outdoors" },
];

export const Controls: React.FC<ControlsProps> = ({
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
  onSetShowPowerPlants,
  onNextSubject
}) => {
  const selection = MapOptions.find((mo) => mo.value === baseMap);

  return (
    <Styles.Controls>
      <Tabs>
        <Tab title="Guided">
          <Styles.Form>
            <Checkbox checked={showIncorporated} onChange={onSetShowIncorparted} label = 'Show incorporated places'/>
            <Checkbox checked={showNightLight} onChange={ onSetShowNightLight} label = 'Show light polution'/>
            <Checkbox checked={showTargets} onChange={onSetShowTargets} label = 'Show candidates'/>
            <Checkbox checked={showPowerPlants} onChange={onSetShowPowerPlants} label = 'Show power plants'/>

            <Select
              options={MapOptions}
              value={selection}
              placeholder="BaseMap"
              onChange={(option) => onSetBaseMap(option!.value)}
            />
            <label>
              Min target flux {minFlux}
              <Slider
                min={0}
                max={1000}
                step={10}
                value={minFlux}
                onChange={onMinFluxChange}
              />
            </label>
           <PrimaryButton  onClick={onNextSubject} label="Next Subject" />
          </Styles.Form>
        </Tab>
          <Tab title="Free">
            <p>Use this mode to identify targets our automated methods missed </p>
          </Tab>
      </Tabs>
    </Styles.Controls>
  );
};
