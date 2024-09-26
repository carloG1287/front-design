import { observable, action, computed } from "mobx";
import { parseJwt } from "./Utils/Utils";

class LuminescenceStore {
  @observable usuarioHaIniciadoSesion = parseJwt(localStorage.getItem("token"))
    ?.username
    ? true
    : false;
  @observable nombreDeUsuario =
    parseJwt(localStorage.getItem("token"))?.username || "";
  @observable tokenDeAcceso = "";
  @observable tokenDeSesion = "";
  @observable moduloLogin = false;
  @observable moduloLogout = false;
  @observable moduloInformacion = false;
  @observable añadirManejadorDeClick = false;
  @observable moduloGuardarArchivo = false;
  @observable moduloCargarArchivo = false;

  //usuarioHaIniciadoSesion---------------------------------------------
  @action cambiarInicioDeSesion = (login) => {
    this.usuarioHaIniciadoSesion = login;
  };

  @computed get obtenerInicioDeSesion() {
    return this.usuarioHaIniciadoSesion;
  }

  //nombreDeUsuario--------------------------------------------
  @action cambiarNombreDeUsuario = (name) => {
    this.nombreDeUsuario = name;
  };

  @computed get obtenerNombreDeUsuario() {
    return this.nombreDeUsuario;
  }

  //tokenDeAcceso--------------------------------------------
  @action cambiarTokenDeAcceso = (tokenDeAcceso) => {
    this.tokenDeAcceso = tokenDeAcceso;
  };

  @computed get obtenerTokenDeAcceso() {
    return this.tokenDeAcceso;
  }

  //tokenDeSesion--------------------------------------------
  @action cambiarTokenDeSesion = (token) => {
    this.tokenDeSesion = token;
  };

  @computed get obtenerTokenDeSesion() {
    return this.tokenDeSesion;
  }

  //moduloLogin---------------------------------------------
  @action cambiarModuloLogin = (show) => {
    this.moduloLogin = show;
  };

  @computed get mostrarModuloLogin() {
    return this.moduloLogin;
  }

  //moduloLogout---------------------------------------------
  @action cambiarModuloLogout = (show) => {
    this.moduloLogout = show;
  };

  @computed get mostrarModuloLogout() {
    return this.moduloLogout;
  }

  //moduloInformacion---------------------------------------------
  @action cambiarModuloInformacion = (show) => {
    this.moduloInformacion = show;
  };

  @computed get verModuloInformacion() {
    return this.moduloInformacion;
  }

  //añadirManejadorDeClick---------------------------------------------
  @action cambiarManejadorDeClick = (bool) => {
    this.añadirManejadorDeClick = bool;
  };

  @computed get obtenerManejadorDeClick() {
    return this.añadirManejadorDeClick;
  }

  //Save File Modal---------------------------------------------
  @action cambiarModuloGuardarArchivo = (bool) => {
    this.moduloGuardarArchivo = bool;
  };

  @computed get mostrarModuloGuardarArchivo() {
    return this.moduloGuardarArchivo;
  }

  //Load File Modal---------------------------------------------
  @action cambiarModuloCargarArchivo = (bool) => {
    this.moduloCargarArchivo = bool;
  };

  @computed get mostrarModuloCargarArchivo() {
    return this.moduloCargarArchivo;
  }
}

var store = new LuminescenceStore();
export default store;
