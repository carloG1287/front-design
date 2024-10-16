import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import ModuloLogin from "../LoginLogoutModal/LoginModal/LoginModal";
import ModuloLogout from "../LoginLogoutModal/LogoutModal/LogoutModal";
import NameDisplay from "./NameDisplay.jsx";
import CompanyName from "./CompanyName.jsx";
import ModuloInformacion from "./InfoModal";
import ModuloRepetir from "./RepeatModal";

@inject("store")
@observer
class TopBar extends Component {
  constructor(props) {
    super(props);
    this.handleLoginShow = this.handleLoginShow.bind(this);
    this.handleLogoutShow = this.handleLogoutShow.bind(this);
    this.handleInfoShow = this.handleInfoShow.bind(this);
  }

  handleLoginShow(e) {
    e.preventDefault();
    this.props.store.cambiarModuloLogin(true);
  }

  handleLogoutShow(e) {
    e.preventDefault();
    this.props.store.cambiarModuloLogout(true);
  }

  handleInfoShow(e) {
    e.preventDefault();
    this.props.store.cambiarModuloInformacion(true);
  }

  render() {
    const { store } = this.props;
    return (
      <div className="top-bar">  
        <CompanyName message={`Interior${'\u00A0'}Design`} />
        <div>
          {store.obtenerInicioDeSesion && (
            <NameDisplay nombreDeUsuario={store.nombreDeUsuario} />
          )}
        </div>
        <ModuloRepetir />
        <ModuloInformacion />
        <ModuloLogin />
        <ModuloLogout />
      </div>
    );
  }
}

export default TopBar;
