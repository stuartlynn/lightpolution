import styled from 'styled-components'

const Controls = styled.div`
    position:absolute;
    top:20px;
    right:20px;
    background-color: white;
    filter: drop-shadow(0 0 30px #333);
    box-sizing: border-box;
    padding: 20px;
    border-radius:10px;
    z-index:1;
`
const Form = styled.div`
    display:grid;
    grid-template-columns:1fr; 
    grid-row-gap: 10px;
    align-items:center;
`

export const Styles={
    Controls,
    Form
}