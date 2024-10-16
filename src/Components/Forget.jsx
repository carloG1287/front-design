import React, { Component } from "react";
import ForgetForm from "./LoginLogoutModal/LoginModal/ForgetForm";

class Forget extends Component {
  render() {
    return (
      <section className="loginPage">
        <div className="loginCard">
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            {/* <img src="/logo.png" height={300} width={300} /> */}
            <h1>Cambiar contraseña</h1>
          </div>
          <ForgetForm />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <a href="/inicio-sesion" style={{ textAlign: 'center' }}>
              Regresar
            </a>
          </div>
        </div>
      </section>
    );
  }
}

export default Forget;
