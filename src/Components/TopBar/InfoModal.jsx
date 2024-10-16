import "../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { FaInfoCircle, FaEnvelope } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";

@inject("store")
@observer
class moduloLogin extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.store.cambiarModuloInformacion(false);
  }

  render() {
    const { store } = this.props;
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={store.verModuloInformacion}
        onHide={() => this.handleClose()}
        id="moduloInformacion"
      >
        <Modal.Body>
          <div className="login-form-space">
            <h2>
              <FaInfoCircle /> Información
            </h2>
            <hr className="small-underline" />
            <p className="info-text">
              Interior Design es una aplicación web que permite a los usuarios crear y visualizar diseños de interiores en 3D. Con esta herramienta, se puede planificar la distribución de espacios, seleccionar muebles y decoraciones de una extensa biblioteca y ver cómo quedarían en la realidad. La aplicación ofrece una interfaz intuitiva que facilita el modelado de habitaciones, casas o incluso edificios completos, brindando la posibilidad de explorar y modificar los diseños en tiempo real. Además, algunos servicios similares proporcionan renders fotorrealistas y vistas panorámicas para una experiencia más inmersiva.
              <br />
              <br />
              <p style={{ "font-weight": "600" }}>
                <FaEnvelope /> interiordesign@gmail.com
              </p>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default moduloLogin;
