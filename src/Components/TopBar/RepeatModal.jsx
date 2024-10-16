import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { FaInfoCircle, FaEnvelope, FaArrowAltCircleDown } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";

@inject("store")
@observer
class moduloRepetir extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.store.cambiarModuloRepetir(false)
  }

  render() {
    const { store } = this.props;
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={store.verModuloRepetir}
        onHide={() => this.handleClose()}
        id="moduloRepetir"
      >
        <Modal.Body>
          <div className="login-form-space">
            <h2>
              <FaArrowAltCircleDown /> Quiere repetir su plano?
            </h2>
            <hr className="small-underline" />
            <p className="info-text">
              Al aceptar repetirá el plano a su estado por defecto.
              <br />
              <br />
            </p>
            <Button
              variant="info"
              className="login-submit-button"
              onClick={this.handleClose}
            >
              Repetir
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default moduloRepetir;
