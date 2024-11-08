import React, { Component } from "react";
import Homepage from "./Components/Homepage.jsx";
import { inject, observer } from "mobx-react";
import AuthRoute from "./Components/AuthRoute/AuthRoute.jsx";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Forget from "./Components/Forget.jsx";

@inject("store")
@observer
class App extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/view/:viewKey" component={Homepage} />
          <Route path="/inicio-sesion" component={Login} />
          <Route path="/olvide-mi-contrasena" component={Forget} />
          <Route path="/registro" component={Register} />
          
          {/* Rutas protegidas */}
          <AuthRoute exact path="/" component={Homepage} />
          
          {/* Ruta para cualquier otra página no encontrada */}
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

export default App;
