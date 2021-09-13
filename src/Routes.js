import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { DetalhesPais } from "./components/DetalhesPais";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/:region?" component={Home} />
        <Route path="/detalhes-pais/:name" component={DetalhesPais} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes