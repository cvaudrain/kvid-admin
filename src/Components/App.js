import React from "react"
import {useContext, useState,useEffect} from "react"
import { Switch, Route, Link, Redirect,useLocation, useHistory } from "react-router-dom";

import axios from 'axios';
import Header from "./Header"
import JobCreator from './JobCreator';
import JobViewer from "./JobViewer";

function App() {
const history = useHistory();

  return (
    <div className="gallery-br">
{/* <Header/> */}
    <Switch>

    <Route exact path="/create-job">
    <Header
      alignment={"align-l"}
      buttonText={"Job Viewer"}
      navArg={"/"}
      faClass={"fas fa-3x fa-arrow-circle-left"}
    />
    <JobCreator />
    </Route>

    <Route exact path = "/">
    <Header
      alignment={"align-r"}
      buttonText={"Job Creator"}
      navArg={"/create-job"}
      faClass={"fas fa-3x fa-arrow-circle-right"}
    />
    <JobViewer/>
    </Route>

    </Switch>
    </div>
  );
}

export default App;
