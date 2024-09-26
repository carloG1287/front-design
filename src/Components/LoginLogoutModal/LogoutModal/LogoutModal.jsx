import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Modal from "react-bootstrap/Modal";
import LogoutBody from "./LogoutBody.jsx";

@inject("store")
@observer
class moduloLogin extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.store.cambiarModuloLogout(false);
  }

  render() {
    const { store } = this.props;
    return (
      <Modal
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={store.mostrarModuloLogout}
        onHide={() => this.handleClose()}
        id="moduloLogout"
      >
        <Modal.Body>
          <div className="modal-plain-text">Confirm Log out?</div>
          <LogoutBody />
        </Modal.Body>
      </Modal>
    );
  }
}

export default moduloLogin;
