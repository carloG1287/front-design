import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../../Utils/Utils";
import axios from "axios";
import { BASE_URL_AUTH, USERS } from "../../../Constants.js";
import LargeAlert from "../../LargeAlert.jsx";
import SmallAlert from "../../SmallAlert";

@inject("store")
@observer
class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupUsernameValue: "",
      signupEmailValue: "",
      signupPasswordValue: "",
      signupPasswordConfirmationValue: "",
      signupQuestionValue: "¿Cuál es el nombre de su primera mascota?",
      signupAnswerValue: "",

      signupUsernameFormatError: false,
      signupEmailFormatError: false,
      signupPasswordFormatError: false,
      signupPasswordConfirmationFormatError: false,
      signupQuestionFormatError: false,
      signupAnswerFormatError: false,

      isDisabled: true,
      isRegistered: false,
      isEmailExists: false,
      isError: false,
    };
  }

  // Función para actualizar el estado de `isDisabled` en base a los errores
  updateDisabledState = () => {
    const {
      signupUsernameFormatError,
      signupEmailFormatError,
      signupPasswordFormatError,
      signupPasswordConfirmationFormatError,
      signupQuestionFormatError,
      signupAnswerFormatError,
    } = this.state;

    this.setState({
      isDisabled:
        signupUsernameFormatError ||
        signupEmailFormatError ||
        signupPasswordFormatError ||
        signupPasswordConfirmationFormatError ||
        signupQuestionFormatError ||
        signupAnswerFormatError,
    });
  };

  handleSignupUsernameChange = (e) => {
    const value = e.target.value;
    this.setState(
      {
        signupUsernameValue: value,
        signupUsernameFormatError: !validateUsername(value),
      },
      this.updateDisabledState
    );
  };

  handleSignupEmailChange = (e) => {
    const value = e.target.value;
    this.setState(
      {
        signupEmailValue: value,
        signupEmailFormatError: !validateEmail(value),
      },
      this.updateDisabledState
    );
  };

  handleSignupPasswordChange = (e) => {
    const value = e.target.value;
    this.setState(
      {
        signupPasswordValue: value,
        signupPasswordFormatError: !validatePassword(value),
      },
      this.updateDisabledState
    );
  };

  handleSignupPasswordConfirmationChange = (e) => {
    const value = e.target.value;
    this.setState(
      {
        signupPasswordConfirmationValue: value,
        signupPasswordConfirmationFormatError:
          this.state.signupPasswordValue !== value,
      },
      this.updateDisabledState
    );
  };

  handleSignupQuestionChange = (e) => {
    const value = e.target.value;
    this.setState(
      {
        signupQuestionValue: value,
        signupQuestionFormatError: value === "",
      },
      this.updateDisabledState
    );
  };

  handleSignupAnswerChange = (e) => {
    const value = e.target.value;
    this.setState(
      {
        signupAnswerValue: value,
        signupAnswerFormatError: value === "",
      },
      this.updateDisabledState
    );
  };

  handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!this.state.isDisabled) {
      const user = {
        name: this.state.signupUsernameValue,
        username: this.state.signupUsernameValue,
        email: this.state.signupEmailValue,
        password: this.state.signupPasswordValue,
        password_confirmation: this.state.signupPasswordConfirmationValue,
        security_question: this.state.signupQuestionValue,
        security_answer: this.state.signupAnswerValue,
      };

      try {
        await axios.post(`${BASE_URL_AUTH}${USERS}`, user);
        this.setState({
          isError: false,
          isEmailExists: false,
          isDisabled: true,
          isRegistered: true,
        });
        window.location.pathname = "/inicio-sesion";
      } catch (e) {
        if (e.response) {
          if (e.response.status === 403) {
            this.setState({ isEmailExists: true });
          } else {
            this.setState({ isError: true });
          }
        } else {
          this.setState({ isError: true });
        }
      }
    }
  };

  render() {
    return (
      <div className="vertical-container">
        <form className="login-form" onSubmit={this.handleSignupSubmit}>
          {this.state.signupUsernameFormatError && (
            <SmallAlert message="Usuario inválido" variant="danger" />
          )}
          <div className="login-form-input-space">
            <input
              placeholder="Usuario"
              type="text"
              value={this.state.signupUsernameValue}
              onChange={this.handleSignupUsernameChange}
              className="login-form-input"
            />
          </div>
          {this.state.signupEmailFormatError && (
            <SmallAlert message="Correo inválido" variant="danger" />
          )}
          <div className="login-form-input-space">
            <input
              placeholder="Correo electrónico"
              type="email"
              value={this.state.signupEmailValue}
              onChange={this.handleSignupEmailChange}
              className="login-form-input"
            />
          </div>
          <div className="login-form-input-space">
            <input
              placeholder="Contraseña"
              type="password"
              value={this.state.signupPasswordValue}
              onChange={this.handleSignupPasswordChange}
              className="login-form-input"
            />
          </div>
          {this.state.signupPasswordFormatError && (
            <SmallAlert
              message="Contraseña inválida: Debe tener al menos 8 caracteres, incluir letras, números y caracteres especiales."
              variant="danger"
            />
          )}
          <div className="login-form-input-space">
            <input
              placeholder="Confirmar contraseña"
              type="password"
              value={this.state.signupPasswordConfirmationValue}
              onChange={this.handleSignupPasswordConfirmationChange}
              className="login-form-input"
            />
          </div>
          {this.state.signupPasswordConfirmationFormatError && (
            <SmallAlert
              message="Las contraseñas no coinciden"
              variant="danger"
            />
          )}
          <div className="login-form-input-space">
            <select
              className="login-form-input"
              value={this.state.signupQuestionValue}
              onChange={this.handleSignupQuestionChange}
            >
              <option>¿Cuál es el nombre de su primera mascota?</option>
              <option>¿Cuál es el segundo nombre de su madre?</option>
              <option>¿En qué ciudad nació usted?</option>
              <option>¿En qué año terminó su carrera?</option>
              <option>¿Quién es su profesor de seminario favorito?</option>
            </select>
          </div>
          <div className="login-form-input-space">
            <input
              placeholder="Respuesta de seguridad"
              type="text"
              value={this.state.signupAnswerValue}
              onChange={this.handleSignupAnswerChange}
              className="login-form-input"
            />
          </div>
          <Button
            variant="info"
            className="login-submit-button"
            type="submit"
            disabled={this.state.isDisabled}
          >
            Registrarse
          </Button>
        </form>

        {this.state.isRegistered && (
          <LargeAlert
            message="Usuario registrado correctamente"
            variant="success"
          />
        )}
        {this.state.isError && (
          <LargeAlert
            message="Error en el registro, intente nuevamente"
            variant="danger"
          />
        )}
        {this.state.isEmailExists && (
          <LargeAlert
            message="El correo electrónico ya está registrado"
            variant="danger"
          />
        )}
      </div>
    );
  }
}

export default SignupForm;
