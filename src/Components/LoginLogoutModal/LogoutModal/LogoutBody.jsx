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

    return window.location.pathname = '/login'
  }

  render() {
    return (
      <div className="vertical-container">
        <Button
          variant="danger"
          className="login-submit-button"
          disabled={this.state.isDisabled}
          onClick={(e) => {
            this.handleLogoutSubmit(e);
          }}
        >
          Logout
        </Button>
        {this.state.isError && (
          <LargeAlert message="Some ErrorOcurred" variant="danger" />
        )}
      </div>
    );
  }
}

export default LogoutBody;
