import React, { Component } from "react";
import SignupForm from "./LoginLogoutModal/LoginModal/SignupForm";

class Register extends Component {
  render() {
    return (
      <section className="loginPage">
        <div className="loginCard">
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
            <img src="/blue-logo.png" height={300} width={300} />
            <h1>Registro</h1>
          </div>
          <SignupForm />
          <a href="/inicio-sesion" style={{ marginLeft: '50px' }}>
            ¿Ya estás registrado? Accede tocando aquí.
          </a>
        </div>
      </section>
    );
  }
}

export default Register;
