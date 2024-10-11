import React, { Component } from "react";
import LoginForm from "./LoginLogoutModal/LoginModal/LoginForm";

class Login extends Component {
  render() {
    return (
      <section className="loginPage">
        <div className="loginCard">
          <h1 className="loginText">Login</h1>
          <LoginForm />
          <a href="/register" style={{ marginLeft: '45px' }}>
            No tienes cuenta? Registrate tocando aqui.
          </a>
        </div>
      </section>
    );
  }
}

export default Login;
