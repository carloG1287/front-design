import React, { Component } from "react";
import LoginForm from "./LoginLogoutModal/LoginModal/LoginForm";

class Login extends Component {
  render() {
    return (
      <section className="loginPage">
        <div className="loginCard">
          <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
            <img src="/blue-logo.png" height={300} width={300} />
            <h1>Iniciar sesión</h1>
          </div>
          <LoginForm />
          <a href="/registro" style={{ marginLeft: '45px', marginTop: '20px' }}>
            ¿No tienes cuenta? Registrate tocando aquí.
          </a>
        </div>
      </section>
    );
  }
}

export default Login;
