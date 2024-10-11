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

@inject("store")
@observer
class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupUsernameValue: "",
      signupEmailValue: "",
      signupPasswordValue: "",
      signupQuestionValue: "¿Cuál es el nombre de su primera mascota?",
      signupAnswerValue: "",

      signupUsernameFormatError: false,
      signupEmailFormatError: false,
      signupPasswordFormatError: false,
      signupQuestionFormatError: false,
      signupAnswerFormatError: false,

      isDisabled: false,

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

  handleSignupQuestionChange(e) {
    if (!validatePassword(e.target.value)) {
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
      this.state.signupUsernameValue !== "" &&
      this.state.signupEmailValue !== "" &&
      this.state.signupPasswordValue !== "" && 
      this.state.signupQuestionValue !== "" && 
      this.state.signupAnswerValue !== "" 
    ) {
      this.setState({ isDisabled: true });
      const user = {
        name: this.state.signupUsernameValue,
        email: this.state.signupEmailValue,
        password: this.state.signupPasswordValue,
        password_confirm: this.state.signupPasswordValue,
        question: this.state.signupQuestionValue,
        answer: this.state.signupAnswerValue
      };
      try {
        await axios.post(BASE_URL_AUTH + USERS + REGISTER, user);
        this.setState({
          isError: false,
          isEmailExists: false,
          isDisabled: true,
          isRegistered: true,
        });
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
          <div className="login-form-input-space">
            <input
              placeholder="Nombre"
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
          <div className="login-form-input-space">
            <input
              placeholder="Email"
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
              placeholder="Password"
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
          <LargeAlert message="Successfully Registered" variant="success" />
        )}
        {this.state.isError && (
          <LargeAlert message="Some ErrorOcurred" variant="info" />
        )}
        {this.state.isEmailExists && (
          <LargeAlert message="Email already registered" variant="info" />
        )}
      </div>
    );
  }
}

export default SignupForm;
