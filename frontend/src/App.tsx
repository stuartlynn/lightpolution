import React from "react";
import "./App.css";
import {BrowserRouter as Router} from 'react-router-dom'
import {Switch,Route} from 'react-router'
import {HomePage} from 'Pages/HomePage/HomePage'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/' component={HomePage} exact/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
