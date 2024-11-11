import { observable, action, computed } from "mobx";
import { parseJwt } from "./Utils/Utils";

class InteriorDesignStore {
  @observable usuarioHaIniciadoSesion = parseJwt(localStorage.getItem("token"))?.username ? true : false;
  @observable nombreDeUsuario = parseJwt(localStorage.getItem("token"))?.username || "";
  @observable correoUsuario = parseJwt(localStorage.getItem("token"))?.email || ""; 
  @observable tokenDeAcceso = "";
  @observable tokenDeSesion = "";
  @observable moduloLogin = false;
  @observable moduloLogout = false;
  @observable moduloRepetir = false;
  @observable moduloInformacion = false;
  @observable moduloGuardarArchivo = false;
  @observable moduloCargarArchivo = false;
  @observable añadirManejadorDeClick = false;
  @observable floorTextures = []; // Array para almacenar las texturas de piso aplicadas
  @observable wallTextures = [];  // Array para almacenar las texturas de pared aplicadas

  // Manejo de estado para el inicio de sesión del usuario
  @action cambiarInicioDeSesion = (login) => {
    this.usuarioHaIniciadoSesion = login;
  };

  @computed get obtenerInicioDeSesion() {
    return this.usuarioHaIniciadoSesion;
  }

  // Nombre de usuario
  @action cambiarNombreDeUsuario = (name) => {
    this.nombreDeUsuario = name;
  };

  @computed get obtenerNombreDeUsuario() {
    return this.nombreDeUsuario;
  }

  // Correo del usuario
  @action cambiarCorreoUsuario = (correo) => {
    this.correoUsuario = correo;
  };

  @computed get obtenerCorreoUsuario() {
    return this.correoUsuario;
  }

  // Token de acceso
  @action cambiarTokenDeAcceso = (tokenDeAcceso) => {
    this.tokenDeAcceso = tokenDeAcceso;
  };

  @computed get obtenerTokenDeAcceso() {
    return this.tokenDeAcceso;
  }

  // Token de sesión
  @action cambiarTokenDeSesion = (token) => {
    this.tokenDeSesion = token;
  };

  @computed get obtenerTokenDeSesion() {
    return this.tokenDeSesion;
  }

  // Modulo Login
  @action cambiarModuloLogin = (show) => {
    this.moduloLogin = show;
  };

  @computed get mostrarModuloLogin() {
    return this.moduloLogin;
  }

  // Modulo Logout
  @action cambiarModuloLogout = (show) => {
    this.moduloLogout = show;
  };

  @computed get mostrarModuloLogout() {
    return this.moduloLogout;
  }

  // Modulo Información
  @action cambiarModuloInformacion = (show) => {
    this.moduloInformacion = show;
  };

  @computed get verModuloInformacion() {
    return this.moduloInformacion;
  }

  // Modulo Repetir
  @action cambiarModuloRepetir = (show) => {
    this.moduloRepetir = show;
  };

  @computed get verModuloRepetir() {
    return this.moduloRepetir;
  }

  // Añadir manejador de click
  @action cambiarManejadorDeClick = (bool) => {
    this.añadirManejadorDeClick = bool;
  };

  @computed get obtenerManejadorDeClick() {
    return this.añadirManejadorDeClick;
  }

  // Modulo Guardar Archivo
  @action cambiarModuloGuardarArchivo = (bool) => {
    this.moduloGuardarArchivo = bool;
  };

  @computed get mostrarModuloGuardarArchivo() {
    return this.moduloGuardarArchivo;
  }

  // Modulo Cargar Archivo
  @action cambiarModuloCargarArchivo = (bool) => {
    this.moduloCargarArchivo = bool;
  };

  @computed get mostrarModuloCargarArchivo() {
    return this.moduloCargarArchivo;
  }

  // Manejo de texturas de piso
  @action addFloorTexture = (texture) => {
    this.floorTextures.push(texture);
  };

  @computed get obtenerFloorTextures() {
    return this.floorTextures;
  }

  // Manejo de texturas de pared
  @action addWallTexture = (texture) => {
    // Aquí podrías agregar la lógica para actualizar solo las texturas nuevas
    if (!this.wallTextures.includes(texture)) {
      this.wallTextures.push(texture);
    }
  };
  

  @computed get obtenerWallTextures() {
    return this.wallTextures;
  }
}

var store = new InteriorDesignStore();
export default store;
