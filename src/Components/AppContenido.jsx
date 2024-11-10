import "../App.css";
import React, { Component } from "react";
import $ from "jquery";
import axios from "axios";
import { BP3D } from "../engine/blueprint3d.js";
import { INIT_STRUCTURE, NEW_STRUCTURE } from "../Structures.js";
import { BASE_URL, ASSETS } from "../Constants.js";
import TopBarButton from "./TopBar/TopBarButton.jsx";
import Button from "react-bootstrap/Button";
import {
  FaSearchMinus,
  FaSearchPlus,
  FaHome,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaChevronRight,
  FaArrowsAlt,
  FaPencilAlt,
  FaTrashAlt,
  FaPencilRuler,
  FaDraftingCompass,
  FaPlus,
  FaRedo,
  FaCamera,
  FaPenFancy,
  FaCube,
  FaInfoCircle,
} from "react-icons/fa";
import { Tabs, Tab, OverlayTrigger, Tooltip } from "react-bootstrap";
import CardListSofa from "./AddItems/CardListSofa.jsx";
import CardListChair from "./AddItems/CardListChair.jsx";
import CardListRug from "./AddItems/CardListRug.jsx";
import CardListMisc from "./AddItems/CardListMisc.jsx";
import CardListArch from "./AddItems/CardListArch.jsx";
import CardListLight from "./AddItems/CardListLight.jsx";
import FloorTextureList from "./TextureList/FloorTextureList.jsx";
import WallTextureList from "./TextureList/WallTextureList.jsx";
import ContextMenu from "./ContextMenu.jsx";
import SaveButton from "./SaveLoadModal/SaveFile/SaveButton.jsx";
import LoadButton from "./SaveLoadModal/LoadFile/LoadButton.jsx";
import SaveModal from "./SaveLoadModal/SaveFile/SaveModal.jsx";
import LoadModal from "./SaveLoadModal/LoadFile/LoadModal.jsx";
import jsPDF from "jspdf";

import { inject, observer } from "mobx-react";
import ScreenCaptureButton from "./ScreenCaptureButton";

@inject("store")
@observer
class AppContenido extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWallTextureList: false,
      showFloorTextureList: false,
      key: "chair",
      blueprint3d: {},
      añadirManejadorDeClick: false,
      currentStateName: "Design",
      blob: "",
      userName: "",
      userEmail: "",
    };
    this.engine = this.engine.bind(this);
    this.setDesignState = this.setDesignState.bind(this);
    this.cameraButtons = this.cameraButtons.bind(this);
    this.contextMenu = this.contextMenu.bind(this);
    this.modalEffects = this.modalEffects.bind(this);
    this.sideMenu = this.sideMenu.bind(this);
    this.textureSelector = this.textureSelector.bind(this);
    this.initItems = this.initItems.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.handleLogoutShow = this.handleLogoutShow.bind(this);
    this.handleModalRepeat = this.handleModalRepeat.bind(this);
    this.handleModalInfo = this.handleModalInfo.bind(this);
    this.generateReport = this.generateReport.bind(this);
    this.closeWallTextureList = this.closeWallTextureList.bind(this);
    this.showFloorTextureList = this.showFloorTextureList.bind(this);
    this.closeFloorTextureList = this.closeFloorTextureList.bind(this);
  }
  async componentDidMount() {
    await this.fetchAuthenticatedUser();
  }

  // Métodos para mostrar y cerrar listas de texturas
  showFloorTextureList() {
    console.log("Mostrando FloorTextureList");
    this.setState({ showFloorTextureList: true });
  }

  closeFloorTextureList() {
    console.log("No Mostrando FloorTextureList");
    this.setState({ showFloorTextureList: false });
  }

  showWallTextureList() {
    this.setState({ showWallTextureList: true });
  }

  closeWallTextureList() {
    this.setState({ showWallTextureList: false });
  }

  fetchAuthenticatedUser = async () => {
    try {
      // Obtener el token de localStorage
      const token = localStorage.getItem("authToken");

      // Verificar que el token esté presente
      if (!token) {
        throw new Error("No se encontró token de autenticación");
      }

      // Hacer la solicitud al backend para obtener los datos del usuario
      const response = await axios.get("/api/usuario/autenticado", {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en el encabezado de autorización
        },
      });

      // Actualizar el estado con los datos del usuario
      const { name, email } = response.data;
      this.setState({
        userName: name,
        userEmail: email,
      });
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };
  saveFile() {
    if (this.state.blueprint3d.model !== undefined) {
      var data = this.state.blueprint3d.model.exportSerialized();
      // var a = window.document.createElement("a");
      var blob = new Blob([data], {
        type: "text",
      });
      this.setState({ blob: blob });
      // a.href = window.URL.createObjectURL(blob);
      // a.download = "design.blueprint3d";
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    }
  }

  async loadFile(uri) {
    try {
      // console.log("uri: " + uri);
      if (uri !== null && uri !== "") {
        let res = await axios.get(BASE_URL + ASSETS + uri);
        this.state.blueprint3d.model.loadSerialized(JSON.stringify(res.data));
      } else {
        console.log("uri is null");
      }
    } catch (e) {
      console.log(e);
    }
  }

  /*
   * Camera Buttons
   */

  generateReport = () => {
    // Información General del Reporte
    const softwareName = "Office Interior Design";
    const userName =
      this.props.store.obtenerNombreDeUsuario || "[Nombre no disponible]";
    const userEmail =
      this.props.store.obtenerCorreoUsuario || "[Correo no disponible]";
    const reportDate = new Date().toLocaleDateString();

    // Cantidad de Objetos en el Canvas
    const objectCounts = {
      sillas: 0,
      mesas: 0,
      escritorios: 0,
      sofás: 0,
      lámparas: 0,
      estantes: 0,
      plantas: 0,
      alfombras: 0,
      elementosArquitectónicos: 0,
      mobiliarioDeOficina: 0,
      otros: 0,
    };

    // Acceso al tipo de piso y pared
    const floorType =
      this.props.store.obtenerFloorTexture || "[Tipo de piso no disponible]";
    const wallType =
      this.props.store.obtenerWallTexture || "[Tipo de pared no disponible]";

    // Mapear tipos numéricos a categorías
    const typeMapping = {
      1: "sillas",
      2: "mesas",
      3: "escritorios",
      4: "sofás",
      5: "lámparas",
      6: "estantes",
      7: "plantas",
      8: "alfombras",
      10: "elementosArquitectónicos",
      11: "mobiliarioDeOficina",
    };

    // Mapear nombres específicos de objetos a categorías
    const nameMapping = {
      "Arm Chair": "sillas",
      Ottoman: "sillas",
      "White Chair": "sillas",
      "Red Chair": "sillas",
      Bench: "sillas",
      "Cube Armchair": "sillas",
      Stool: "sillas",
      "Wooden Stool": "sillas",
      "Brown Rug": "alfombras",
      "Blue Rug": "alfombras",
      Laptop: "mobiliarioDeOficina",
      "TV Unit": "mobiliarioDeOficina",
      "Beige Leather Panel": "mobiliarioDeOficina",
      "TV Unit B": "mobiliarioDeOficina",
      "Molding Wall Panel": "mobiliarioDeOficina",
      "Round Mirror": "mobiliarioDeOficina",
      "Mirror - Escapade": "mobiliarioDeOficina",
      Easel: "mobiliarioDeOficina",
      "Cosmetic Set": "mobiliarioDeOficina",
      "Airplane Toy": "mobiliarioDeOficina",
      "Rocket Toy": "mobiliarioDeOficina",
      "Duck Toy": "mobiliarioDeOficina",
      "Elephant Figurine": "mobiliarioDeOficina",
      Vase: "mobiliarioDeOficina",
      "Ornamental Horn": "mobiliarioDeOficina",
      "Vinta Clock": "mobiliarioDeOficina",
      Shelves: "mobiliarioDeOficina",
      "Wall Shelf": "mobiliarioDeOficina",
      Rack: "mobiliarioDeOficina",
      "Round Table": "mobiliarioDeOficina",
      Worktable: "mobiliarioDeOficina",
      "Drawing Table": "mobiliarioDeOficina",
      "Study Table": "mobiliarioDeOficina",
      Cabinet: "mobiliarioDeOficina",
      "Sliding Wardrobe": "mobiliarioDeOficina",
      "Cupboard and Rack": "mobiliarioDeOficina",
      "Cupboard and Shelf": "mobiliarioDeOficina",
      Wardrobe: "mobiliarioDeOficina",
      Curtain: "mobiliarioDeOficina",
      "Hanging Light": "lámparas",
      "Table Lamp": "lámparas",
      "Luminaires Black Light": "lámparas",
      "Luminaires White Light": "lámparas",
      "Sconce Light Black": "lámparas",
      Window: "elementosArquitectónicos",
      Doorway: "elementosArquitectónicos",
      "Sliding Window": "elementosArquitectónicos",
      "Black Window": "elementosArquitectónicos",
      "Closed Door (Inverted)": "elementosArquitectónicos",
      Stairs: "elementosArquitectónicos",
      "Stairs (Inverted)": "elementosArquitectónicos",
      "Stair Case": "elementosArquitectónicos",
      "Window - Rectangular": "elementosArquitectónicos",
      "Window - Rectangular (Black)": "elementosArquitectónicos",
      "Balcony Railing": "elementosArquitectónicos",
      "Balcony Railing 2": "elementosArquitectónicos",
    };

    const unmappedTypes = new Set();

    // Recorre cada objeto y cuenta según el tipo o el nombre
    this.state.blueprint3d.model.scene.items.forEach((item) => {
      const itemType = item.metadata.itemType;
      const itemName = item.metadata.itemName;

      if (nameMapping[itemName]) {
        const category = nameMapping[itemName];
        objectCounts[category]++;
      } else if (typeMapping[itemType]) {
        const category = typeMapping[itemType];
        objectCounts[category]++;
      } else {
        objectCounts.others++;
        unmappedTypes.add(itemType);
      }
    });

    const totalObjects = Object.values(objectCounts).reduce((a, b) => a + b, 0);
    const materialsUsed = totalObjects + 2; // La suma de todos los objetos + 2 para incluir piso y pared

    const wallCount = this.state.blueprint3d.model.floorplan.walls.length;
    const dimensions = this.state.blueprint3d.model.floorplan.getDimensions
      ? JSON.stringify(this.state.blueprint3d.model.floorplan.getDimensions())
      : "[Dimensiones no disponibles]";

    // Crear el PDF
    const doc = new jsPDF();

    // Añadir contenido al PDF
    doc.setFontSize(12);
    doc.text(`Office Interior Design - Reporte`, 10, 10);
    doc.text(`Generado el: ${reportDate}`, 10, 20);
    doc.text(`Nombre de Usuario: ${userName}`, 10, 30);
    doc.text(`Correo Electrónico: ${userEmail}`, 10, 40);

    doc.text("Resumen de Objetos en el Canvas:", 10, 50);
    let yPosition = 60;
    Object.keys(objectCounts).forEach((key) => {
      doc.text(`- ${key}: ${objectCounts[key]}`, 10, yPosition);
      yPosition += 10;
    });

    doc.text(`Dimensiones del Área: ${dimensions}`, 10, yPosition + 10);
    doc.text(`Tipo de Piso: ${floorType}`, 10, yPosition + 20);
    doc.text(`Tipo de Pared: ${wallType}`, 10, yPosition + 30);
    doc.text(
      `Total de Materiales Utilizados: ${materialsUsed}`,
      10,
      yPosition + 40
    );

    // Descargar el PDF
    doc.save("reporte_diseño.pdf");
  };

  cameraButtons(blueprint3d) {
    var orbitControls = blueprint3d.three.controls;
    var three = blueprint3d.three;

    var panSpeed = 30;
    var directions = {
      UP: 1,
      DOWN: 2,
      LEFT: 3,
      RIGHT: 4,
    };

    function init() {
      // Camera controls
      $("#zoom-in").click(zoomIn);
      $("#zoom-in").on("touchend", zoomIn);
      $("#zoom-out").click(zoomOut);
      $("#zoom-out").on("touchend", zoomOut);

      $("#zoom-in").dblclick(preventDefault);
      $("#zoom-out").dblclick(preventDefault);

      $("#reset-view").click(three.centerCamera);
      $("#reset-view").on("touchend", three.centerCamera);

      $("#move-left").click(function () {
        pan(directions.LEFT);
      });
      $("#move-left").on("touchend", function () {
        pan(directions.LEFT);
      });

      $("#move-right").click(function () {
        pan(directions.RIGHT);
      });
      $("#move-right").on("touchend", function () {
        pan(directions.RIGHT);
      });

      $("#move-up").click(function () {
        pan(directions.UP);
      });
      $("#move-up").on("touchend", function () {
        pan(directions.UP);
      });

      $("#move-down").click(function () {
        pan(directions.DOWN);
      });
      $("#move-down").on("touchend", function () {
        pan(directions.DOWN);
      });

      $("#move-left").dblclick(preventDefault);
      $("#move-right").dblclick(preventDefault);
      $("#move-up").dblclick(preventDefault);
      $("#move-down").dblclick(preventDefault);
    }

    function preventDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function pan(direction) {
      switch (direction) {
        case directions.UP:
          orbitControls.panXY(0, panSpeed);
          break;
        case directions.DOWN:
          orbitControls.panXY(0, -panSpeed);
          break;
        case directions.LEFT:
          orbitControls.panXY(panSpeed, 0);
          break;
        case directions.RIGHT:
          orbitControls.panXY(-panSpeed, 0);
          break;
        default:
          break;
      }
    }

    function zoomIn(e) {
      e.preventDefault();
      orbitControls.dollyIn(1.1);
      orbitControls.update();
    }

    function zoomOut(e) {
      // eslint-disable-next-line no-unused-expressions
      e.preventDefault;
      orbitControls.dollyOut(1.1);
      orbitControls.update();
    }

    init();
    this.setState({ blueprint3d: blueprint3d });
  }

  /*
   * Context menu for selected item
   */
  contextMenu(blueprint3d) {
    // var scope = this;
    var selectedItem;
    var three = blueprint3d.three;

    function init() {
      $("#context-menu-delete").click(function (event) {
        selectedItem.remove();
      });
      $("#context-menu-delete").on("touchend", function (event) {
        selectedItem.remove();
      });

      three.itemSelectedCallbacks.add(itemSelected);
      three.itemUnselectedCallbacks.add(itemUnselected);

      initResize();

      $("#fixed").click(function () {
        var checked = $(this).prop("checked");
        selectedItem.setFixed(checked);
      });
    }

    function cmToIn(cm) {
      return cm / 2.54;
    }

    function inToCm(inches) {
      return inches * 2.54;
    }

    function itemSelected(item) {
      selectedItem = item;

      $("#context-menu-name").text(item.metadata.itemName);

      $("#item-width").val(cmToIn(selectedItem.getWidth()).toFixed(0));
      $("#item-height").val(cmToIn(selectedItem.getHeight()).toFixed(0));
      $("#item-depth").val(cmToIn(selectedItem.getDepth()).toFixed(0));
      $("#item-elevation").val(cmToIn(selectedItem.getElevation()).toFixed(0));

      $("texture-context-container").show();
      $("#context-menu").show();

      if (selectedItem.isElevationAdjustable()) {
        $("#item-elevation-div").show();
      } else {
        $("#item-elevation-div").hide();
      }

      $("#fixed").prop("checked", item.fixed);
    }

    function resize() {
      selectedItem.resize(
        inToCm($("#item-height").val()),
        inToCm($("#item-width").val()),
        inToCm($("#item-depth").val())
      );
    }

    function elevate() {
      selectedItem.elevate(inToCm($("#item-elevation").val()));
    }

    function initResize() {
      $("#item-height").change(resize);
      $("#item-width").change(resize);
      $("#item-depth").change(resize);
      $("#item-elevation").change(elevate);
    }

    function itemUnselected() {
      selectedItem = null;
      $("texture-context-container").hide();
      $("#context-menu").hide();
    }

    init();
    this.setState({ blueprint3d: blueprint3d });
  }

  /*
   * Loading modal for items
   */
  modalEffects(blueprint3d) {
    // var scope = this;
    var itemsLoading = 0;

    this.setActiveItem = function (active) {
      // eslint-disable-next-line no-undef
      itemSelected = active;
      update();
    };

    function update() {
      if (itemsLoading > 0) {
        $("#loading-modal").show();
      } else {
        $("#loading-modal").hide();
      }
    }

    function init() {
      blueprint3d.model.scene.itemLoadingCallbacks.add(function () {
        itemsLoading += 1;
        update();
      });

      blueprint3d.model.scene.itemLoadedCallbacks.add(function () {
        itemsLoading -= 1;
        update();
      });

      update();
    }

    init();
    this.setState({ blueprint3d: blueprint3d });
  }

  /*
   * Side menu
   */
  sideMenu = function (blueprint3d, floorplanControls, modalEffects) {
    // var modalEffects = modalEffectsArg;

    var ACTIVE_CLASS = "active";

    var tabs = {
      FLOORPLAN: $("#floorplan_tab"),
      SHOP: $("#items_tab"),
      DESIGN: $("#design_tab"),
    };

    // var scope = this;
    var stateChangeCallbacks = $.Callbacks();

    var states = {
      DEFAULT: {
        div: $("#viewer"),
        tab: tabs.DESIGN,
        name: "Design",
      },
      FLOORPLAN: {
        div: $("#floorplanner"),
        tab: tabs.FLOORPLAN,
        name: "Floorplan",
      },
      SHOP: {
        div: $("#add-items"),
        tab: tabs.SHOP,
        name: "Shop",
      },
    };

    // sidebar state
    var currentState = states.FLOORPLAN;

    function init() {
      for (var tab in tabs) {
        var elem = tabs[tab];
        elem.click(tabClicked(elem));
      }

      $("#update-floorplan").click(floorplanUpdate);
      function reset() {
        $("texture-context-container").hide();
        $("#wallTextures").hide();
        $("#floorTexturesDiv").hide();
      }
      stateChangeCallbacks.add(reset);

      initLeftMenu();

      blueprint3d.three.updateWindowSize();
      handleWindowResize();

      initItems();

      setCurrentState(states.DEFAULT, true);
    }

    function floorplanUpdate() {
      setCurrentState(states.DEFAULT);
    }

    function tabClicked(tab) {
      return function () {
        // Stop three from spinning
        initItems();
        blueprint3d.three.stopSpin();

        // Selected a new tab
        for (var key in states) {
          var state = states[key];
          if (state.tab === tab) {
            setCurrentState(state);
            break;
          }
        }
      };
    }

    var getCurrentState = () => {
      if (this.state.currentStateName === "Design") {
        return states.DEFAULT;
      }
      if (this.state.currentStateName === "Floorplan") {
        return states.FLOORPLAN;
      }
      if (this.state.currentStateName === "Shop") {
        return states.SHOP;
      }
      return null;
    };

    var updateState = (newState) => {
      this.setState({ currentStateName: newState.name });
    };

    function setCurrentState(newState, firstTime) {
      currentState = getCurrentState();
      firstTime = firstTime || false;
      if (!firstTime && currentState.name === newState.name) {
        return;
      }

      // show the right tab as active
      if (currentState.name !== newState.name) {
        if (currentState.tab != null) {
          currentState.tab.removeClass(ACTIVE_CLASS);
        }
        if (newState.tab != null) {
          newState.tab.addClass(ACTIVE_CLASS);
        }
      }

      if (currentState.name === newState.name) {
        newState.tab.addClass(ACTIVE_CLASS);
      }

      // set item unselected
      if (firstTime || newState.name !== "Design") {
        blueprint3d.three.getController().setSelectedObject(null);
      }

      // show and hide the right divs
      currentState.div.hide();
      newState.div.show();

      // custom actions
      if (newState === states.FLOORPLAN) {
        floorplanControls.handleWindowResize();
        floorplanControls.updateFloorplanView();
      }

      if (currentState === states.FLOORPLAN) {
        blueprint3d.model.floorplan.update();
      }

      if (newState === states.DEFAULT) {
        blueprint3d.three.updateWindowSize();
      }

      // set new state
      handleWindowResize();
      currentState = newState;
      updateState(newState);

      stateChangeCallbacks.fire(newState);

      //change mobx state-active-tab
    }

    function initLeftMenu() {
      $(window).resize(handleWindowResize);
      handleWindowResize();
    }

    function handleWindowResize() {
      // $(".sidebar").height(window.innerHeight);
      // $("#add-items").height(window.innerHeight);
    }

    var initItems = () => {
      this.initItems(blueprint3d, setCurrentState);
    };

    init();
    this.setState({ blueprint3d: blueprint3d });
  };

  initItems(blueprint3d, setCurrentState) {
    $("#add-items").find(".add-item").off("click");
    $("#add-items")
      .find(".add-item")
      .click(function (e) {
        var modelUrl = $(this).attr("model-url");
        var itemType = parseInt($(this).attr("model-type"));
        var metadata = {
          itemName: $(this).attr("model-name"),
          resizable: true,
          modelUrl: modelUrl,
          itemType: itemType,
        };

        blueprint3d.model.scene.addItem(itemType, modelUrl, metadata);
        setCurrentState(
          {
            div: $("#viewer"),
            tab: $("#design_tab"),
            name: "Design",
          },
          false
        );
      });
  }

  /*
   * Change floor and wall textures
   */
  textureSelector(blueprint3d, sideMenu) {
    // var scope = this;
    var three = blueprint3d.three;
    // var isAdmin = isAdmin;

    var currentTarget = null;

    function initTextureSelectors() {
      $(".texture-select-thumbnail").off("click");
      $(".texture-select-thumbnail").click(function (e) {
        var textureUrl = $(this).attr("texture-url");
        var textureStretch = $(this).attr("texture-stretch") === "true";
        var textureScale = parseInt($(this).attr("texture-scale"));
        currentTarget.setTexture(textureUrl, textureStretch, textureScale);

        e.preventDefault();
      });
    }

    function init() {
      three.wallClicked.add(wallClicked);
      three.wallClicked.add(initTextureSelectors);
      three.floorClicked.add(floorClicked);
      three.wallClicked.add(initTextureSelectors);
      three.itemSelectedCallbacks.add(reset);
      three.wallClicked.add(initTextureSelectors);
      three.nothingClicked.add(reset);
      three.wallClicked.add(initTextureSelectors);
      // sideMenu.stateChangeCallbacks.add(reset);
      three.wallClicked.add(initTextureSelectors);
      initTextureSelectors();
      three.wallClicked.add(wallClicked);
    }

    function wallClicked(halfEdge) {
      if (currentTarget !== undefined && currentTarget !== null) {
        currentTarget.removeOutline();
      }
      currentTarget = halfEdge;
      currentTarget.drawOutline();
      $("#floorTexturesDiv").hide();
      $("texture-context-container").show();
      $("#wallTextures").show();
      initTextureSelectors();
      this.setState({ showWallTextureList: true });
    }

    // eslint-disable-next-line no-func-assign
    wallClicked = wallClicked.bind(this);

    function floorClicked(room) {
      if (currentTarget !== undefined && currentTarget !== null) {
        currentTarget.removeOutline();
      }
      currentTarget = room;
      currentTarget.drawOutline();
      this.showFloorTextureList();
      $("#wallTextures").hide();
      $("texture-context-container").show();
      $("#floorTexturesDiv").show();
      initTextureSelectors();
    }
    // eslint-disable-next-line no-func-assign
    floorClicked = floorClicked.bind(this);
    function reset() {
      // if (currentTarget !== undefined && currentTarget !== null) {
      //   currentTarget.removeOutline();
      // }
      // $("texture-context-container").hide();
      // $("#wallTextures").hide();
      // $("#floorTexturesDiv").hide();
      // initTextureSelectors();
    }

    init();
  }

  handleLogoutShow(e) {
    e.preventDefault();
    this.props.store.cambiarModuloLogout(true);
  }

  handleModalRepeat(e) {
    e.preventDefault();
    this.props.store.cambiarModuloRepetir(true);
  }

  handleModalInfo(e) {
    e.preventDefault();
    this.props.store.cambiarModuloInformacion(true);
  }

  async engine(viewKey) {
    /*
     * Floorplanner controls
     */

    var ViewerFloorplanner = function (blueprint3d) {
      var canvasWrapper = "#floorplanner";

      // buttons
      var move = "#move";
      var remove = "#delete";
      var draw = "#draw";

      var activeStlye = "btn-primary disabled";

      this.floorplanner = blueprint3d.floorplanner;

      var scope = this;

      function init() {
        $(window).resize(scope.handleWindowResize);
        scope.handleWindowResize();

        // mode buttons
        // scope.floorplanner.modeResetCallbacks.add(function (mode) {
        //   // $(draw).removeClass(activeStlye);
        //   // $(remove).removeClass(activeStlye);
        //   // $(move).removeClass(activeStlye);
        //   // if (mode === BP3D.Floorplanner.floorplannerModes.MOVE) {
        //   //   $(move).addClass(activeStlye);
        //   // } else if (mode === BP3D.Floorplanner.floorplannerModes.DRAW) {
        //   //   $(draw).addClass(activeStlye);
        //   // } else if (mode === BP3D.Floorplanner.floorplannerModes.DELETE) {
        //   //   $(remove).addClass(activeStlye);
        //   // }

        //   // if (mode === BP3D.Floorplanner.floorplannerModes.DRAW) {
        //   //   $("#draw-walls-hint").show();
        //   //   scope.handleWindowResize();
        //   // } else {
        //   //   $("#draw-walls-hint").hide();
        //   // }
        // });

        $(move).click(function () {
          scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
        });
        // $(move).on("touchend", function () {
        //   scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
        // });

        $(draw).click(function () {
          scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
        });
        $(draw).on("touchend", function () {
          scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
        });

        $(remove).click(function () {
          scope.floorplanner.setMode(
            BP3D.Floorplanner.floorplannerModes.DELETE
          );
        });
        $(remove).on("touchend", function () {
          scope.floorplanner.setMode(
            BP3D.Floorplanner.floorplannerModes.DELETE
          );
        });
      }

      this.updateFloorplanView = function () {
        scope.floorplanner.reset();
      };

      this.handleWindowResize = function () {
        $(canvasWrapper).height(
          window.innerHeight - $(canvasWrapper).offset().top
        );
        scope.floorplanner.resizeView();
      };

      init();
    };

    var mainControls = function (blueprint3d) {
      function newDesign() {
        blueprint3d.model.loadSerialized(NEW_STRUCTURE);
      }

      // var loadDesign = async (event) => {
      //   let name = $("#loadFile").attr('name');
      //   let file1 = await axios.get(
      //     "http://localhost:8001/assets/" + name
      //   );
      //   // var file1 = event.target.files[0];
      //   var reader = new FileReader();
      //   reader.onload = function () {
      //     var data = reader.result;
      //     blueprint3d.model.loadSerialized(data);
      //   };
      //   reader.readAsText(file1);
      //   $("#loadFile").replaceWith($("#loadFile").val("").clone(true));

      //   try {
      //     let uri = $("#loadFile").attr("uri");
      //     console.log("uri: " + uri);
      //     if (uri !== "") {
      //       let res = await axios.get("http://localhost:8001/assets/" + uri);
      //       blueprint3d.model.loadSerialized(JSON.stringify(res.data));
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }
      // };

      // function saveDesign() {
      //   var data = blueprint3d.model.exportSerialized();
      //   var a = window.document.createElement("a");
      //   var blob = new Blob([data], {
      //     type: "text",
      //   });
      //   // setBlob(blob);
      //   a.href = window.URL.createObjectURL(blob);
      //   a.download = "design";
      //   document.body.appendChild(a);
      //   a.click();
      //   document.body.removeChild(a);
      // }

      // function setBlob(blob) {
      //   setNewBlob(blob);
      // }

      function init() {
        $("#new").click(newDesign);
        // $("#new").on("touchend", newDesign);

        // $("#loadFile").click(loadDesign);
        // $("#loadFileLabel").on("touchend", function () {
        //   $("#loadFile").trigger("click");
        // });

        // $("#saveFile").click(saveDesign);
        // $("#saveFile").on("touchend", saveDesign);
      }

      init();
    };

    /*
     * Initialize!
     */

    var modalEffects = this.modalEffects(this.state.blueprint3d);
    var viewerFloorplanner = new ViewerFloorplanner(this.state.blueprint3d);
    // eslint-disable-next-line no-unused-vars
    var contextMenu = this.contextMenu(this.state.blueprint3d);
    var sideMenu = this.sideMenu(
      this.state.blueprint3d,
      viewerFloorplanner,
      modalEffects
    );

    // eslint-disable-next-line no-unused-vars
    var textureSelector = this.textureSelector(
      this.state.blueprint3d,
      sideMenu
    );
    // eslint-disable-next-line no-unused-vars
    var cameraButtons = this.cameraButtons(this.state.blueprint3d);
    mainControls(this.state.blueprint3d);

    // This serialization format needs work
    // Load a simple rectangle room
    if (viewKey === "") {
      this.state.blueprint3d.model.loadSerialized(INIT_STRUCTURE);
    } else {
      try {
        let res = await axios.get(BASE_URL + ASSETS + viewKey);
        // let file1 = new Blob(res)
        // var blueprint3d = this.state.blueprint3d;
        // var reader = new FileReader();
        //   reader.onload = function () {
        //     var data = reader.result;
        //     blueprint3d.model.loadSerialized(data);
        //   };
        //   reader.readAsText(file1);
        this.state.blueprint3d.model.loadSerialized(JSON.stringify(res.data));
      } catch (e) {
        console.log(e);
        this.state.blueprint3d.model.loadSerialized(INIT_STRUCTURE);
      }
    }
  }

  // eslint-disable-next-line no-dupe-class-members
  componentDidMount() {
    const opts = {
      floorplannerElement: "floorplanner-canvas",
      threeElement: "#viewer",
      threeCanvasElement: "three-canvas",
      textureDir: "rooms/textures/",
      widget: false,
    };
    this.setState({ blueprint3d: new BP3D.Blueprint3d(opts) }, () => {
      if (this.props.viewKey) {
        this.engine(this.props.viewKey);
      } else {
        this.engine("");
      }
    });
  }

  setDesignState(newState, firstTime) {
    firstTime = firstTime || false;
    var ACTIVE_CLASS = "active";

    $("#items_tab").removeClass(ACTIVE_CLASS);
    $("#design_tab").addClass(ACTIVE_CLASS);

    // show and hide the right divs
    $("#add-items").hide();
    $("#viewer").show();

    this.state.blueprint3d.three.updateWindowSize();

    // set new state
    function handleWindowResize() {
      $(".sidebar").height(window.innerHeight);
      $("#add-items").height(window.innerHeight);
    }
    handleWindowResize();

    function reset() {
      $("texture-context-container").hide();
      $("#wallTextures").hide();
      $("#floorTexturesDiv").hide();
    }

    reset();
    this.setState({ currentStateName: "Design" });

    //change mobx state-active-tab
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (this.props.añadirManejadorDeClick) {
      // this.setState({ añadirManejadorDeClick: true });
      this.props.store.cambiarManejadorDeClick(false);
      this.initItems(this.state.blueprint3d, this.setDesignState);
    }
    if (
      this.props.añadirManejadorDeClick === false &&
      prevProps.añadirManejadorDeClick
    ) {
      this.setState({ añadirManejadorDeClick: false });
    }
  }

  render() {
    console.log(
      "Renderizando AppContenido. showFloorTextureList:",
      this.state.showFloorTextureList
    );
    const { store } = this.props;
    return (
      <div className="horizontal-container">
        {/* Left Column */}

        <div id="texture-context-container">
          {/* Context Menu */}
          <div id="context-menu">
            <ContextMenu />
          </div>
          {/* Floor Textures */}
          {this.state.showFloorTextureList && (
            <div id="floorTexturesDiv">
              <FloorTextureList
                onClose={this.closeFloorTextureList}
                usuarioHaIniciadoSesion={this.props.store.obtenerInicioDeSesion}
              />
            </div>
          )}

          {/* Wall Textures */}
          {this.state.showWallTextureList && (
            <div id="wallTextures">
              <WallTextureList
                onClose={this.closeWallTextureList}
                usuarioHaIniciadoSesion={store.obtenerInicioDeSesion}
              />
            </div>
          )}
        </div>
        {/* End Left Column */}

        {/* Right Column */}
        <div className="right-container">
          {/* 3D Viewer */}
          <div id="viewer">
            {/* <div id="camera-controls">
              <Button
                variant="info"
                size="sm"
                id="zoom-out"
                className={"basic-button"}
              >
                <FaSearchMinus />
              </Button>
              <Button
                variant="info"
                size="sm"
                id="reset-view"
                className={"basic-button"}
              >
                <FaHome />
              </Button>
              <Button
                variant="info"
                size="sm"
                id="zoom-in"
                className={"basic-button"}
              >
                <FaSearchPlus />
              </Button>

              <Button
                variant="info"
                size="sm"
                id="move-left"
                className={"basic-button"}
              >
                <FaArrowLeft />
              </Button>
              <div className={"vertical-controls-container"}>
                <Button
                  variant="info"
                  size="sm"
                  id="move-up"
                  className={"basic-button"}
                >
                  <FaArrowUp />
                </Button>
                <Button
                  variant="info"
                  size="sm"
                  id="move-down"
                  className={"basic-button"}
                >
                  <FaArrowDown />
                </Button>
              </div>
              <Button
                variant="info"
                size="sm"
                id="move-right"
                className={"basic-button"}
              >
                <FaArrowRight />
              </Button>
            </div> */}

            <div id="loading-modal">
              <h1>Loading...</h1>
            </div>
          </div>

          {/*2D Floorplanner */}
          <div id="floorplanner">
            <canvas id="floorplanner-canvas"></canvas>
            <div id="floorplanner-controls">
              <Button
                variant="info"
                size="sm"
                className="icon-text-button"
                id="move"
              >
                <span className="icon-centre">
                  <FaArrowsAlt />
                </span>
                <span className="text-centre">Mover Muros</span>
              </Button>
              <Button
                variant="info"
                size="sm"
                className="icon-text-button"
                id="draw"
              >
                <span className="icon-centre">
                  <FaPencilAlt />
                </span>
                <span className="text-centre">Dibujar Muros</span>
              </Button>
              <Button
                variant="info"
                size="sm"
                className="icon-text-button"
                id="delete"
              >
                <span className="icon-centre">
                  <FaTrashAlt />
                </span>
                <span className="text-centre">Borrar Muros</span>
              </Button>

              <Button
                variant="info"
                size="sm"
                className="icon-text-button"
                id="update-floorplan"
              >
                <span className="text-centre">Listo</span>
                <span className="icon-centre">
                  <FaChevronRight />
                </span>
              </Button>
            </div>
            <div id="draw-walls-hint">
              Press the "Esc" key to stop drawing walls
            </div>
          </div>
          {/* Add Items */}
          <div id="add-items">
            <Tabs
              variant="pills"
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100px",
                position: "absolute",
                right: "100px",
                top: "100px",
              }}
              id="controlled-tab-example"
              activeKey={this.state.key}
              onSelect={(k) => {
                this.setState({ key: k });
              }}
            >
              {/* <Tab eventKey="sofa" title="Sofas">
                <CardListSofa usuarioHaIniciadoSesion={store.obtenerInicioDeSesion} />
              </Tab> */}
              <Tab eventKey="chair" title="Sillas">
                <CardListChair
                  usuarioHaIniciadoSesion={store.obtenerInicioDeSesion}
                />
              </Tab>
              <Tab eventKey="rug" title="Alfombras">
                <CardListRug
                  usuarioHaIniciadoSesion={store.obtenerInicioDeSesion}
                />
              </Tab>
              <Tab eventKey="misc" title="Oficina personal y corporativa">
                <CardListMisc
                  usuarioHaIniciadoSesion={store.obtenerInicioDeSesion}
                />
              </Tab>
              <Tab eventKey="light" title="Luces">
                <CardListLight
                  usuarioHaIniciadoSesion={store.obtenerInicioDeSesion}
                />
              </Tab>
              <Tab eventKey="arch" title="Architectural">
                <CardListArch
                  usuarioHaIniciadoSesion={store.obtenerInicioDeSesion}
                />
              </Tab>
            </Tabs>
          </div>
          <div className="menu">
            <div display="flex">
              <ul className="nav nav-sidebar">
                <li id="design_tab">
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Diseñar</Tooltip>}
                  >
                    <div className="icons">
                      <div className="iconWrapper">
                        <FaCube size="25px" />
                      </div>
                    </div>
                  </OverlayTrigger>
                </li>
                <li id="floorplan_tab">
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Editar piso</Tooltip>}
                  >
                    <div className="icons">
                      <div className="iconWrapper">
                        <FaPenFancy size="25px" />
                      </div>
                    </div>
                  </OverlayTrigger>
                </li>
                <li id="items_tab">
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Añadir objeto</Tooltip>}
                  >
                    <div className="icons">
                      <div className="iconWrapper">
                        <FaPlus size="25px" />
                      </div>
                    </div>
                  </OverlayTrigger>
                </li>
                <li id="items_tab">
                  <img
                    src="./logo.png"
                    className="top-bar-logo"
                    alt=""
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "-5px 10px 0 10px",
                    }}
                  />
                </li>
                <li style={{ display: "none" }}>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Repetir plano</Tooltip>}
                  >
                    <Button
                      className="repeatButton"
                      onClick={this.handleModalRepeat}
                    >
                      <div className="icons" id="new">
                        <div
                          className="iconWrapper"
                          style={{ margin: 0, padding: 0 }}
                        >
                          <FaRedo size="25px" />
                        </div>
                      </div>
                    </Button>
                  </OverlayTrigger>
                </li>
                <li>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Repetir plano</Tooltip>}
                  >
                    <Button
                      className="repeatButton"
                      onClick={this.handleModalRepeat}
                    >
                      <div className="icons" id="new">
                        <div
                          className="iconWrapper"
                          style={{ margin: 0, padding: 0 }}
                        >
                          <FaRedo size="25px" />
                        </div>
                      </div>
                    </Button>
                  </OverlayTrigger>
                </li>
                <li id="design_tab">
                  <ScreenCaptureButton />
                </li>
                <li>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Información</Tooltip>}
                  >
                    <Button
                      className="repeatButton"
                      onClick={this.handleModalInfo}
                    >
                      <div className="icons" id="new">
                        <div
                          className="iconWrapper"
                          style={{ margin: 0, padding: 0 }}
                        >
                          <FaInfoCircle size="25px" />
                        </div>
                      </div>
                    </Button>
                  </OverlayTrigger>
                </li>
                <li>
                  <Button
                    variant="outline-dark"
                    className="top-bar-login-button"
                    style={{ position: "absolute", top: "10px", right: 150 }}
                    onClick={this.generateReport}
                  >
                    Generar Reporte
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline-dark"
                    className="top-bar-login-button"
                    style={{ position: "absolute", top: "10px", right: 0 }}
                    onClick={this.handleLogoutShow}
                  >
                    Salir
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* End Right Column */}
      </div>
    );
  }
}

export default AppContenido;
