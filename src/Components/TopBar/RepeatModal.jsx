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
    this.handleAccept = this.handleAccept.bind(this);
  }

  handleClose() {
    this.props.store.cambiarModuloRepetir(false)
  }

  handleAccept() {
    this.props.store.cambiarModuloRepetir(false)
    return window.location.reload()
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
            <div style={{ display: 'flex', width: '100%', flexWrap: 'nowrap', gap: '10px' }}>
              <Button
                variant="danger"
                className="login-submit-button"
                style={{ width: 'calc(50% - 10px)', background: 'red' }}
                onClick={this.handleClose}
              >
                Cerrar
              </Button>
              <Button
                variant="info"
                className="login-submit-button"
                style={{ width: 'calc(50% - 10px)' }}
                onClick={this.handleAccept}
              >
                Repetir
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default moduloRepetir;
