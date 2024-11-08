import { observable, action, computed } from "mobx";
import { parseJwt } from "./Utils/Utils";

class InteriorDesignStore {
  @observable usuarioHaIniciadoSesion = parseJwt(localStorage.getItem("token"))?.username ? true : false;
  @observable nombreDeUsuario = parseJwt(localStorage.getItem("token"))?.username || "";
  @observable correoUsuario = parseJwt(localStorage.getItem("token"))?.email || ""; // Añade el correo aquí
  @observable tokenDeAcceso = "";
  @observable tokenDeSesion = "";
  @observable moduloLogin = false;
  @observable moduloLogout = false;
  @observable moduloRepetir = false;
  @observable moduloInformacion = false;
  @observable moduloGuardarArchivo = false;
  @observable moduloCargarArchivo = false;
  @observable añadirManejadorDeClick = false;
  @observable floorTexture = "";
  @observable wallTexture = "";

  // usuarioHaIniciadoSesion---------------------------------------------
  @action cambiarInicioDeSesion = (login) => {
    this.usuarioHaIniciadoSesion = login;
  };

  @computed get obtenerInicioDeSesion() {
    return this.usuarioHaIniciadoSesion;
  }

  // nombreDeUsuario--------------------------------------------
  @action cambiarNombreDeUsuario = (name) => {
    this.nombreDeUsuario = name;
  };

  @computed get obtenerNombreDeUsuario() {
    return this.nombreDeUsuario;
  }

  // correoUsuario--------------------------------------------
  @action cambiarCorreoUsuario = (correo) => { // Método para cambiar el correo
    this.correoUsuario = correo;
  };

  @computed get obtenerCorreoUsuario() { // Método para obtener el correo
    return this.correoUsuario;
  }

  // tokenDeAcceso--------------------------------------------
  @action cambiarTokenDeAcceso = (tokenDeAcceso) => {
    this.tokenDeAcceso = tokenDeAcceso;
  };

  @computed get obtenerTokenDeAcceso() {
    return this.tokenDeAcceso;
  }

  // tokenDeSesion--------------------------------------------
  @action cambiarTokenDeSesion = (token) => {
    this.tokenDeSesion = token;
  };

  @computed get obtenerTokenDeSesion() {
    return this.tokenDeSesion;
  }

  // moduloLogin---------------------------------------------
  @action cambiarModuloLogin = (show) => {
    this.moduloLogin = show;
  };

  @computed get mostrarModuloLogin() {
    return this.moduloLogin;
  }

  // moduloLogout---------------------------------------------
  @action cambiarModuloLogout = (show) => {
    this.moduloLogout = show;
  };

  @computed get mostrarModuloLogout() {
    return this.moduloLogout;
  }

  // moduloInformacion---------------------------------------------
  @action cambiarModuloInformacion = (show) => {
    this.moduloInformacion = show;
  };

  @computed get verModuloInformacion() {
    return this.moduloInformacion;
  }

  // moduloRepetir---------------------------------------------
  @action cambiarModuloRepetir = (show) => {
    this.moduloRepetir = show;
  };

  @computed get verModuloRepetir() {
    return this.moduloRepetir;
  }

  // añadirManejadorDeClick---------------------------------------------
  @action cambiarManejadorDeClick = (bool) => {
    this.añadirManejadorDeClick = bool;
  };

  @computed get obtenerManejadorDeClick() {
    return this.añadirManejadorDeClick;
  }

  // Save File Modal---------------------------------------------
  @action cambiarModuloGuardarArchivo = (bool) => {
    this.moduloGuardarArchivo = bool;
  };

  @computed get mostrarModuloGuardarArchivo() {
    return this.moduloGuardarArchivo;
  }

  // Load File Modal---------------------------------------------
  @action cambiarModuloCargarArchivo = (bool) => {
    this.moduloCargarArchivo = bool;
  };

  @computed get mostrarModuloCargarArchivo() {
    return this.moduloCargarArchivo;
  }

  @action setFloorTexture = (texture) => {
    this.floorTexture = texture;
  };

  @computed get obtenerFloorTexture() {
    return this.floorTexture;
  }
  
  @action setWallTexture = (texture) => {
    this.wallTexture = texture;
  };
  
  @computed get obtenerWallTexture() {
    return this.wallTexture;
  }
}

var store = new InteriorDesignStore();
export default store;
