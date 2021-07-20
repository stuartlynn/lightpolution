import styled from "styled-components";

const GeoCodeResults = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: white;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 10px;
  z-index: 1;
  filter: drop-shadow(0 0 7px #333);
  width: 246px;
  min-height: 100px;
`;

const Results = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
`;
const Result = styled.li`
  border-bottom: 1px solid grey;
  box-sizing: border-box;
  padding: 5px 10px;
`;
export const Styles = {
  GeoCodeResults,
  Results,
  Result,
};
