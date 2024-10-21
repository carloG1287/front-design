import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import LargeAlert from "../../LargeAlert.jsx";

@inject("store")
@observer
class LogoutBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      isError: false,
    };

    this.handleLogoutSubmit = this.handleLogoutSubmit.bind(this);
  }

  async handleLogoutSubmit(e) {
    e.preventDefault();

    this.setState({ isDisabled: true });

    this.setState({
      isError: false,
      isDisabled: true,
    });

    this.props.store.cambiarNombreDeUsuario("");
    this.props.store.cambiarTokenDeAcceso("");
    this.props.store.cambiarTokenDeSesion("");
    this.props.store.cambiarInicioDeSesion(false);

    this.props.store.cambiarModuloLogout(false);

    localStorage.removeItem('token')

    return window.location.pathname = '/inicio-sesion'
  }

  render() {
    return (
      <div className="vertical-container">
        <div style={{ display: 'flex', width: '100%', flexWrap: 'nowrap', gap: '10px' }}>
          <Button
            variant="danger"
            className="login-submit-button"
            style={{ width: 'calc(50% - 10px)', background: 'red' }}
            onClick={() => {
              this.props.store.cambiarModuloLogout(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="info"
            className="login-submit-button"
            style={{ width: 'calc(50% - 10px)' }}
            disabled={this.state.isDisabled}
            onClick={(e) => {
              this.handleLogoutSubmit(e);
            }}
          >
            Salir
          </Button>
        </div>
        {this.state.isError && (
          <LargeAlert message="Some ErrorOcurred" variant="info" />
        )}
      </div>
    );
  }
}

export default LogoutBody;
