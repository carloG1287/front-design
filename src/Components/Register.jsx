import React, { Component } from "react";
import SignupForm from "./LoginLogoutModal/LoginModal/SignupForm";

class Register extends Component {
  render() {
    return (
      <section className="loginPage">
        <div className="loginCard">
          <h1 className="loginText">Registro</h1>
          <SignupForm />
          <a href="/login" style={{ marginLeft: '50px' }}>
            Ya estás registrado? Accede tocando aqui.
          </a>
        </div>
      </section>
    );
  }
}

export default Register;
