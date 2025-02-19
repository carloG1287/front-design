/* eslint-disable no-undef */
import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import SmallAlert from "../../SmallAlert.jsx";
import store from "../../../InteriorDesignStore.js";
import { debounce } from "lodash";

@inject("store")
@observer
class ForgetForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forgetUsername: "",
      forgetNewPassword: "",
      forgetNewConfirmPassword: "",
      forgetSecurityAnswer: "",
      forgetUsernameFormatError: false,

      isDisabled: false,
      securityQuestion: "",
      isEmailExists: true,
      isPasswordCorrect: true,
      isError: false,
      showSmallAlert: false, // Mostrar alerta pequeña
    };

    this.handleForgetUsername = debounce(
      this.handleForgetUsername.bind(this),
      500
    );
    this.handleForgetNewPassword = this.handleForgetNewPassword.bind(this);
    this.handleForgetNewConfirmPassword =
      this.handleForgetNewConfirmPassword.bind(this);
    this.handleForgetSecurityAnswer =
      this.handleForgetSecurityAnswer.bind(this);
  }

  async handleForgetUsername(username) {
    this.setState({ forgetUsername: username });

    if (username.length === 0) {
      // Si el campo está vacío, no hacer la solicitud
      this.setState({
        securityQuestion: "",
        isDisabled: true,
        isError: false,
      });
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/users/question/${username}`
      );

      if (
        response.status === 200 &&
        typeof response.data.question === "string" &&
        response.data.question.length > 0
      ) {
        console.log("Pregunta de seguridad recibida:", response.data.question);
        this.setState({
          securityQuestion: response.data.question,
          isDisabled: false,
          isError: false,
        });
      } else {
        this.setState({
          securityQuestion: "Pregunta de seguridad no válida.",
          isDisabled: true,
          isError: true,
        });
      }
    } catch (error) {
      this.setState({
        securityQuestion: "Pregunta de seguridad no encontrada.",
        isDisabled: true,
        isError: true,
      });
    }
  }

  handleForgetNewPassword(e) {
    this.setState({ forgetNewPassword: e.target.value });
  }

  handleForgetNewConfirmPassword(e) {
    this.setState({ forgetNewConfirmPassword: e.target.value });
  }

  handleForgetSecurityAnswer(e) {
    this.setState({ forgetSecurityAnswer: e.target.value });
  }

  handleLogin = () => {
    store.cambiarInicioDeSesion(true);
  };

  async handleChangePassword(e) {
    e.preventDefault();

    const { forgetUsername, forgetNewPassword, forgetSecurityAnswer } =
      this.state;

    if (forgetUsername && forgetNewPassword && forgetSecurityAnswer) {
      const body = {
        security_answer: forgetSecurityAnswer,
        password: forgetNewPassword,
      };

      try {
        await axios.put(
          `http://localhost:3000/users/change_password/${forgetUsername}`,
          body
        );

        this.setState({ showSmallAlert: false });
        window.location.pathname = "/inicio-sesion";
      } catch (error) {
        // Actualiza el estado con el mensaje de error específico
        let errorMessage = "Ha ocurrido un problema"; // Mensaje por defecto

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          // Usa el mensaje del backend si está disponible
          errorMessage = error.response.data.message;
        }

        this.setState({
          showSmallAlert: true,
          smallAlertMessage: errorMessage,
        });
      }
    }
  }

  render() {
    return (
      <div className="vertical-container">
        <form
          className="login-form"
          onSubmit={(e) => {
            this.handleChangePassword(e);
          }}
        >
          {this.state.forgetUsernameFormatError && (
            <SmallAlert message="Usuario inválido" variant="info" />
          )}
          <div className="login-form-input-space">
            <input
              placeholder="Usuario"
              variant="secondary"
              type="text"
              value={this.state.forgetUsername}
              onChange={(e) => {
                const username = e.target.value;
                this.setState({ forgetUsername: username }); // Actualiza el estado inmediatamente
                this.handleForgetUsername(username); // Llama a la función con debounce
              }}
              className="login-form-input"
              disabled={this.state.isDisabled}
            />
          </div>
          <div className="login-form-input-space">
            <input
              placeholder="Nueva contraseña"
              variant="secondary"
              size="sm"
              type="password"
              value={this.state.forgetNewPassword}
              onChange={(e) => {
                this.handleForgetNewPassword(e);
              }}
              className="login-form-input"
            />
          </div>
          <div className="login-form-input-space">
            <input
              placeholder="Confirmar nueva contraseña"
              variant="secondary"
              size="sm"
              type="password"
              value={this.state.forgetNewConfirmPassword}
              onChange={(e) => {
                this.handleForgetNewConfirmPassword(e);
              }}
              className="login-form-input"
            />
          </div>
          {this.state.securityQuestion && (
            <div className="security-question">
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                {this.state.securityQuestion}
              </p>
            </div>
          )}
          <div className="login-form-input-space">
            <input
              placeholder="Respuesta de seguridad"
              variant="secondary"
              size="sm"
              type="text"
              value={this.state.forgetSecurityAnswer}
              onChange={(e) => {
                this.handleForgetSecurityAnswer(e);
              }}
              className="login-form-input"
            />
          </div>
          <Button
            variant="info"
            className="login-submit-button"
            disabled={this.state.isDisabled}
            type="submit"
            style={{ marginBottom: "-10px" }}
          >
            Cambiar contraseña
          </Button>
        </form>

        {this.state.showSmallAlert && (
          <SmallAlert
            message={this.state.smallAlertMessage} // Muestra el mensaje específico
            variant="danger"
          />
        )}
      </div>
    );
  }
}

export default ForgetForm;
