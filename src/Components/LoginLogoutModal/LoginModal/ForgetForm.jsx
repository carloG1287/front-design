import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import SmallAlert from "../../SmallAlert.jsx";
import store from '../../../InteriorDesignStore.js';

@inject("store")
@observer
class ForgetForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forgetUsername: "",
      forgetNewPassword: "",
      forgetSecurityAnswer: "",
      forgetUsernameFormatError: false,

      isDisabled: false,
      securityQuestion: "",
      isEmailExists: true,
      isPasswordCorrect: true,
      isError: false,
      showSmallAlert: false, // New state for showing SmallAlert
    };

    this.handleForgetUsername = this.handleForgetUsername.bind(this);
    this.handleForgetNewPassword = this.handleForgetNewPassword.bind(this);
    this.handleForgetSecurityAnswer = this.handleForgetSecurityAnswer.bind(this);
  }

  async handleForgetUsername(e) {
    const username = e.target.value;
    this.setState({ forgetUsername: username });

    try {
      const response = await axios.get(`http://localhost:3001/users/question?_username=${username}`);
      
      if (response.status === 200 && response.data.question) {
        this.setState({
          securityQuestion: response.data.question,
          isDisabled: false,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.setState({ isDisabled: false });
      }
    }
  }

  handleForgetNewPassword(e) {
    this.setState({ forgetNewPassword: e.target.value });
  }

  handleForgetSecurityAnswer(e) {
    this.setState({ forgetSecurityAnswer: e.target.value });
  }

  handleLogin = () => {
    store.cambiarInicioDeSesion(true);
  }

  async handleChangePassword(e) {
    e.preventDefault();

    if (!this.state.isDisabled && this.state.forgetUsername && this.state.forgetNewPassword && this.state.forgetSecurityAnswer) {
      const { forgetUsername, forgetNewPassword, forgetSecurityAnswer } = this.state;

      const body = {
        security_answer: forgetSecurityAnswer,
        password: forgetNewPassword,
      };

      try {
        await axios.put(`http://localhost:3001/users/change_password?_username=${forgetUsername}`, body);
        this.setState({ showSmallAlert: false });
        return window.location.pathname = '/inicio-sesion'
      } catch (error) {
        this.setState({ showSmallAlert: true });
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
            <SmallAlert message="Invalid Usuario" variant="info" />
          )}
          <div className="login-form-input-space">
            <input
              placeholder="Usuario"
              variant="secondary"
              type="text"
              value={this.state.forgetUsername}
              onChange={(e) => {
                this.handleForgetUsername(e);
              }}
              className="login-form-input"
              disabled={this.state.isDisabled} 
            />
          </div>
          <div className="login-form-input-space">
            <input
              placeholder="Contraseña"
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
          {this.state.securityQuestion && (
            <div className="security-question">
              <p style={{ textAlign: 'center', marginTop: '10px' }}>{this.state.securityQuestion}</p>
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
            style={{ marginBottom: '-10px' }}
          >
            Cambiar contraseña
          </Button>
        </form>

        {this.state.showSmallAlert && (
          <SmallAlert message="Credenciales incorrectas" variant="danger" />
        )}
      </div>
    );
  }
}

export default ForgetForm;
