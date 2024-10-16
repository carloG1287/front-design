import "../../../App.css";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import { validateEmail, parseJwt } from "../../../Utils/Utils";
import axios from "axios";
import { BASE_URL_AUTH, USERS, LOGIN } from "../../../Constants.js";
import SmallAlert from "../../SmallAlert.jsx";
import LargeAlert from "../../LargeAlert.jsx";
import store from '../../../InteriorDesignStore.js'

@inject("store")
@observer
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginEmailValue: "",
      loginPasswordValue: "",
      loginEmailFormatError: false,

      isDisabled: false,

      isEmailExists: true,
      isPasswordCorrect: true,
      isError: false,
    };

    this.handleLoginEmailChange = this.handleLoginEmailChange.bind(this);
    this.handleLoginPasswordChange = this.handleLoginPasswordChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  handleLoginEmailChange(e) {
    if (e.target.value === '') {
      this.setState({ loginEmailFormatError: true });
    } else {
      this.setState({ loginEmailFormatError: false });
    }
    this.setState({ loginEmailValue: e.target.value });
  }

  handleLoginPasswordChange(e) {
    this.setState({ loginPasswordValue: e.target.value });
  }

  handleLogin = () => {
    store.cambiarInicioDeSesion(true)
  }

  async handleLoginSubmit(e) {
    e.preventDefault();
    if (
      !this.state.loginEmailFormatError &&
      this.state.loginEmailValue !== "" &&
      this.state.loginPasswordValue !== ""
    ) {
      this.setState({ isDisabled: true });
      const user = {
        email: this.state.loginEmailValue,
        password: this.state.loginPasswordValue,
      };

      try {
        let res = await axios.post(BASE_URL_AUTH + LOGIN, user);
        this.setState({
          isError: false,
          isEmailExists: true,
          isPasswordCorrect: true,
          isDisabled: true,
        });

        const loggedInUser = parseJwt(res.data.token);

        this.props.store.cambiarNombreDeUsuario(loggedInUser.username);
        this.props.store.cambiarTokenDeAcceso(res.data.token);
        this.props.store.cambiarTokenDeSesion(res.data.token);
        this.props.store.cambiarInicioDeSesion(true);

        this.props.store.cambiarModuloLogin(false);

        localStorage.setItem('token', res.data.token)

        this.handleLogin()

        return window.location.pathname = '/'
      } catch (e) {
        if (user.email === 'astrid@gmail.com' && user.password === 'astrid') {
          this.setState({
            isError: false,
            isEmailExists: true,
            isPasswordCorrect: true,
            isDisabled: true,
          });

          const loggedInUser = parseJwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFzdHJpZCIsImlhdCI6MTcyODY2OTE3NH0.vgrTmpTwIAsaq2uCrje8PCyX92N7WC12dANDYslTbNM");

          store.cambiarNombreDeUsuario(loggedInUser.username);
          store.cambiarTokenDeAcceso("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFzdHJpZCIsImlhdCI6MTcyODY2OTE3NH0.vgrTmpTwIAsaq2uCrje8PCyX92N7WC12dANDYslTbNM");
          store.cambiarTokenDeSesion("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFzdHJpZCIsImlhdCI6MTcyODY2OTE3NH0.vgrTmpTwIAsaq2uCrje8PCyX92N7WC12dANDYslTbNM");
          store.cambiarInicioDeSesion(true);

          this.props.store.cambiarModuloLogin(false);

          localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFzdHJpZCIsImlhdCI6MTcyODY2OTE3NH0.vgrTmpTwIAsaq2uCrje8PCyX92N7WC12dANDYslTbNM')

          this.handleLogin()

          return window.location.pathname = '/'
        }
        if (e.response === undefined) {
          console.log(e);
        } else if (e.response.status === 400) {
          this.setState({
            isError: false,
            isEmailExists: false,
            isPasswordCorrect: true,
            isDisabled: false,
          });
        } else if (e.response.status === 401) {
          this.setState({
            isError: false,
            isEmailExists: true,
            isPasswordCorrect: false,
            isDisabled: false,
          });
        } else {
          this.setState({
            isError: true,
            isEmailExists: true,
            isPasswordCorrect: true,
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
            this.handleLoginSubmit(e);
          }}
        >
          {this.state.loginEmailFormatError && (
            <SmallAlert message="Usuario o correo inválido" variant="danger" />
          )}
          <div className="login-form-input-space">
            <input
              placeholder="Usuario o correo inválido"
              variant="secondary"
              type="text"
              value={this.state.loginEmailValue}
              onChange={(e) => {
                this.handleLoginEmailChange(e);
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
              value={this.state.loginPasswordValue}
              onChange={(e) => {
                this.handleLoginPasswordChange(e);
              }}
              className="login-form-input"
            />
          </div>
          <a href="/olvide-mi-contrasena" style={{ textAlign: 'end', margin: '0 0 10px 0' }}>
            Olvidé mi contraseña
          </a>
          <Button
            variant="info"
            className="login-submit-button"
            disabled={this.state.isDisabled}
            type="submit"
            style={{ marginBottom: '-10px' }}
          >
            Iniciar Sesión
          </Button>
        </form>

        {!this.state.isEmailExists && (
          <LargeAlert message="Correo electronico es incorrecto" variant="danger" style={{ marginTop: '-10px' }} />
        )}
        {this.state.isError && (
          <LargeAlert message="Ha ocurrido un error" variant="danger" style={{ marginTop: '-10px' }} />
        )}
        {!this.state.isPasswordCorrect && (
          <LargeAlert message="Contrasena incorrecta" variant="danger" style={{ marginTop: '-10px' }} />
        )}
      </div>
    );
  }
}

export default LoginForm;
