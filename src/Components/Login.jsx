import React, { Component } from "react";
import LoginForm from "./LoginLogoutModal/LoginModal/LoginForm";

class Login extends Component {
  render() {
    return (
      <section className="loginPage">
        <div className="loginCard">
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            <img src="/logo.png" height={300} width={300} />
          </div>
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
