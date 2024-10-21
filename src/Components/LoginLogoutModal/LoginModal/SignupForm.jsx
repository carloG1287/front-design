import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import { FaEnvelope, FaExclamation, FaKey, FaQuestion, FaUser } from "react-icons/fa";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../../Utils/Utils";
import axios from "axios";
import { BASE_URL_AUTH, USERS, REGISTER } from "../../../Constants.js";
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

    this.handleSignupUsernameChange = this.handleSignupUsernameChange.bind(
      this
    );
    this.handleSignupEmailChange = this.handleSignupEmailChange.bind(this);
    this.handleSignupPasswordChange = this.handleSignupPasswordChange.bind(
      this
    );
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
  }

  handleSignupUsernameChange(e) {
    if (!validateUsername(e.target.value)) {
      this.setState({ signupUsernameFormatError: true });
      this.setState({ isDisabled: true })
    } else {
      this.setState({ signupUsernameFormatError: false });
      this.setState({ isDisabled: false })
    }
    this.setState({ signupUsernameValue: e.target.value });
  }

  handleSignupEmailChange(e) {
    if (!validateEmail(e.target.value)) {
      this.setState({ signupEmailFormatError: true });
      this.setState({ isDisabled: true })
    } else {
      this.setState({ signupEmailFormatError: false });
      this.setState({ isDisabled: false })
    }
    this.setState({ signupEmailValue: e.target.value });
  }

  handleSignupPasswordChange(e) {
    if (!validatePassword(e.target.value)) {
      this.setState({ signupPasswordFormatError: true });
      this.setState({ isDisabled: true })
    } else {
      this.setState({ signupPasswordFormatError: false });
      this.setState({ isDisabled: false })
    }
    this.setState({ signupPasswordValue: e.target.value });
  }

  handleSignupPasswordConfirmationChange(e) {
    if (this.signupPasswordValue === e.target.value) {
      this.setState({ signupPasswordConfirmationFormatError: true });
      this.setState({ isDisabled: true })
    } else {
      this.setState({ signupPasswordConfirmationFormatError: false });
      this.setState({ isDisabled: false })
    }
    this.setState({ signupPasswordConfirmationValue: e.target.value });
  }

  handleSignupQuestionChange(e) {
    if (e.target.value === '') {
      this.setState({ signupQuestionFormatError: true });
      this.setState({ isDisabled: true })
    } else {
      this.setState({ signupQuestionFormatError: false });
      this.setState({ isDisabled: false })
    }
    this.setState({ signupQuestionValue: e.target.value });
  }

  handleSignupAnswerChange(e) {
    if (e.target.value === '') {
      this.setState({ signupAnswerFormatError: true });
      this.setState({ isDisabled: true })
    } else {
      this.setState({ signupAnswerFormatError: false });
      this.setState({ isDisabled: false })
    }
    this.setState({ signupAnswerValue: e.target.value });
  }
  async handleSignupSubmit(e) {
    e.preventDefault();

    if (
      !this.state.signupUsernameFormatError &&
      !this.state.signupEmailFormatError &&
      !this.state.signupPasswordFormatError &&
      !this.state.signupQuestionFormatError &&
      !this.state.signupAnswerFormatError &&
      !this.state.signupPasswordConfirmationFormatError &&
      this.state.signupUsernameValue !== "" &&
      this.state.signupEmailValue !== "" &&
      this.state.signupPasswordValue !== "" && 
      this.state.signupQuestionValue !== "" && 
      this.state.signupAnswerValue !== "" &&
      this.state.signupPasswordConfirmationValue === this.state.signupPasswordValue
    ) {
      this.setState({ isDisabled: true });
      const user = {
        name: this.state.signupUsernameValue,
        username: this.state.signupUsernameValue,
        email: this.state.signupEmailValue,
        password: this.state.signupPasswordValue,
        password_confirmation: this.state.signupPasswordConfirmationValue,
        security_question: this.state.signupQuestionValue,
        security_answer: this.state.signupAnswerValue
      };
      try {
        await axios.post(BASE_URL_AUTH + USERS, user);
        this.setState({
          isError: false,
          isEmailExists: false,
          isDisabled: true,
          isRegistered: true,
        });

        return window.location.pathname = '/inicio-sesion' 
      } catch (e) {
        if (e.response === undefined) {
          this.setState({
            isError: true,
            isEmailExists: false,
            isDisabled: true,
          });
        } else if (e.response.status === 403) {
          this.setState({
            isError: false,
            isEmailExists: true,
            isDisabled: false,
          });
        } else {
          this.setState({
            isError: true,
            isEmailExists: false,
            isDisabled: false,
          });
        }
      }
    }
  }

  render() {
    return (
      <div className="vertical-container">
        <form
          className="login-form"
          onSubmit={(e) => {
            this.handleSignupSubmit(e);
          }}
        >
          {this.state.signupUsernameFormatError && (
            <SmallAlert message="Usuario inválido" variant="danger" />
          )}
          <div className="login-form-input-space">
            <input
              placeholder="Usuario"
              variant="secondary"
              size="sm"
              type="text"
              value={this.state.signupUsernameValue}
              onChange={(e) => {
                this.handleSignupUsernameChange(e);
              }}
              className="login-form-input"
            />
          </div>
          {this.state.signupEmailFormatError && (
            <SmallAlert message="Correo inválido" variant="danger" />
          )}
          <div className="login-form-input-space">
            <input
              placeholder="Correo electrónico"
              variant="secondary"
              size="sm"
              type="email"
              value={this.state.signupEmailValue}
              onChange={(e) => {
                this.handleSignupEmailChange(e);
              }}
              className="login-form-input"
            />
          </div>
          <div className="login-form-input-space">
            <input
              placeholder="Contraseña"
              variant="secondary"
              size="sm"
              type="password"
              value={this.state.signupPasswordValue}
              onChange={(e) => {
                this.handleSignupPasswordChange(e);
              }}
              className="login-form-input"
            />
          </div>
          <div className="login-form-input-space">
            <input
              placeholder="Confirmar contraseña"
              variant="secondary"
              size="sm"
              type="password"
              value={this.state.signupPasswordConfirmationValue}
              onChange={(e) => {
                this.handleSignupPasswordConfirmationChange(e);
              }}
              className="login-form-input"
            />
          </div>
          {(this.state.signupPasswordFormatError || this.state.signupPasswordConfirmationFormatError) && (
            <SmallAlert message="Contraseñas invalida" variant="danger" />
          )}
          <div className="login-form-input-space">
            <select 
              className="login-form-input" 
              variant="secundary"
              value={this.state.signupQuestionValue}
              onChange={(e) => {
                this.handleSignupQuestionChange(e);
              }}
            >
              <option className="options">¿Cuál es el nombre de su primera mascota?</option>
              <option className="options">¿Cuál es el segundo nombre de su madre?</option>
              <option className="options">¿En qué ciudad nació usted?</option>
              <option className="options">¿En qué año termino su carrera?</option>
              <option className="options">¿Quién es su profesor de seminario favorito?</option>
            </select>
          </div>
          <div className="login-form-input-space">
            <input
              placeholder="Respuesta de seguridad"
              variant="secondary"
              size="sm"
              type="text"
              value={this.state.signupAnswerValue}
              onChange={(e) => {
                this.handleSignupAnswerChange(e);
              }}
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
          <LargeAlert message="Usuario registrado correctamente" variant="success" />
        )}
        {this.state.isError && (
          <LargeAlert message="Este usuario ha sido registrado" variant="danger" />
        )}
        {this.state.isEmailExists && (
          <LargeAlert message="Email already registered" variant="danger" />
        )}
      </div>
    );
  }
}

export default SignupForm;
