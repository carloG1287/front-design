import React, { Component } from "react";
import TextureList from "./TextureList.jsx";
import {
  BASE_URL,
  TEXTURES,
  FLOOR_WOOD_CATEGORY,
  FLOOR_MARBLE_CATEGORY,
  FLOOR_TILE_CATEGORY,
  RESOURCES,
  GET_FREE_RESOURCES,
  GET_RESOURCES,
  FIND,
} from "../../Constants.js";
import axios from "axios";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class FloorTextureList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      textureListWood: [],
      textureListMarble: [],
      textureListTile: [],
      selectedFloorTexture: null,
    };

    this.getUserList = this.getUserList.bind(this);
    this.getFreeList = this.getFreeList.bind(this);
    this.clearList = this.clearList.bind(this);
  }

  // Manejador para actualizar el tipo de suelo seleccionado
  handleTextureSelection = (textureName) => {
    this.setState({ selectedFloorTexture: textureName });
    this.props.store.setFloorTexture(textureName); // Guardamos la textura seleccionada en el store
  };

  clearList() {
    if (this.state.isLoggedIn === false) {
      this.setState({
        textureListWood: [],
        textureListMarble: [],
        textureListTile: [],
      });
    }
  }

  getUserList() {
    if (this.state.isLoggedIn) {
      let textureCategoryFloorWood = { category: FLOOR_WOOD_CATEGORY };
      let textureCategoryFloorMarble = { category: FLOOR_MARBLE_CATEGORY };
      let textureCategoryFloorTile = { category: FLOOR_TILE_CATEGORY };

      let token = this.props.store.obtenerTokenDeAcceso;
      let config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      axios
        .post(
          BASE_URL + RESOURCES + GET_RESOURCES,
          textureCategoryFloorWood,
          config
        )
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureListWood];
              temp.push(res.data);
              this.setState({ textureListWood: temp });
              return res.data;
            })
          );
        });

      axios
        .post(
          BASE_URL + RESOURCES + GET_RESOURCES,
          textureCategoryFloorMarble,
          config
        )
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureListMarble];
              temp.push(res.data);
              this.setState({ textureListMarble: temp });
              return res.data;
            })
          );
        });

      axios
        .post(
          BASE_URL + RESOURCES + GET_RESOURCES,
          textureCategoryFloorTile,
          config
        )
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureListTile];
              temp.push(res.data);
              this.setState({ textureListTile: temp });
              return res.data;
            })
          );
        });
    }
  }

  getFreeList() {
    if (!this.state.isLoggedIn) {
      let textureCategoryFloorWood = { category: FLOOR_WOOD_CATEGORY };
      let textureCategoryFloorMarble = { category: FLOOR_MARBLE_CATEGORY };
      let textureCategoryFloorTile = { category: FLOOR_TILE_CATEGORY };

      axios
        .post(
          BASE_URL + RESOURCES + GET_FREE_RESOURCES,
          textureCategoryFloorWood
        )
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureListWood];
              temp.push(res.data);
              this.setState({ textureListWood: temp });
              return res.data;
            })
          );
        });

      axios
        .post(
          BASE_URL + RESOURCES + GET_FREE_RESOURCES,
          textureCategoryFloorMarble
        )
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureListMarble];
              temp.push(res.data);
              this.setState({ textureListMarble: temp });
              return res.data;
            })
          );
        });

      axios
        .post(
          BASE_URL + RESOURCES + GET_FREE_RESOURCES,
          textureCategoryFloorTile
        )
        .then((res) => {
          let textureListTemp = res.data;
          Promise.all(
            textureListTemp.map(async (textureId) => {
              let res = await axios.get(BASE_URL + TEXTURES + FIND + textureId);
              let temp = [...this.state.textureListTile];
              temp.push(res.data);
              this.setState({ textureListTile: temp });
              return res.data;
            })
          );
        });
    }
  }

  componentDidMount() {
    this.getFreeList();
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (
      this.props.store.obtenerInicioDeSesion &&
      prevState.isLoggedIn === false
    ) {
      this.setState({ isLoggedIn: true });
      this.clearList();
      this.getUserList();
    }
    if (
      this.props.store.obtenerInicioDeSesion === false &&
      prevState.isLoggedIn
    ) {
      this.setState({ isLoggedIn: false });
      this.clearList();
      this.getFreeList();
    }
  }

  render() {
    return (
      <div className="texture-panel">
        <div className="panel-heading">
          Ajustar piso
          <button
            onClick={() => {
              console.log("Cerrando FloorTextureList");
              this.props.onClose();
            }}
            style={{ float: "right", marginBottom: "10px" }}
          >
            X
          </button>
        </div>
        <hr className="small-underline" />
        <div className="texture-panel-heading">Madera</div>
        <TextureList
          textureList={this.state.textureListWood.reverse()}
          onSelectTexture={this.handleTextureSelection}
        />
        <div className="texture-panel-heading">Mármol</div>
        <TextureList
          textureList={this.state.textureListMarble.reverse()}
          onSelectTexture={this.handleTextureSelection}
        />
        <div className="texture-panel-heading">Baldosas</div>
        <TextureList
          textureList={this.state.textureListTile.reverse()}
          onSelectTexture={this.handleTextureSelection}
        />
      </div>
    );
  }
}

export default FloorTextureList;
