import "./App.css";

import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Periodos from "./components/periodos";
import NuevoPeriodo from "./components/crearperiodo";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/periodos">
            <Periodos />
          </Route>
          <Route path="/formulario-registro-periodo">
            <NuevoPeriodo />
          </Route>
          <Route path="/">no estas permitido</Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
