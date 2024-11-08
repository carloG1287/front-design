import "../../App.css";
import React, { Component } from "react";
import { BASE_URL, ASSETS } from "../../Constants.js";

export default class TextureList extends Component {
  // Manejador para seleccionar la textura
  handleTextureClick = (texture) => {
    // Llama a la función onSelectTexture pasando el nombre de la textura
    if (this.props.onSelectTexture) {
      this.props.onSelectTexture(texture.name); // Asegúrate de que `texture.name` es el nombre que deseas guardar
    }
  };

  render() {
    return (
      <div className="texture-tiles" style={{ color: "#333333" }}>
        {this.props.textureList.map((texture, iterator) => (
          <div
            key={iterator}
            className="texture-select-thumbnail"
            texture-url={BASE_URL + ASSETS + texture.url}
            texture-stretch={texture.stretch.toString()}
            texture-scale={texture.scale}
            onClick={() => this.handleTextureClick(texture)} // Llama al manejador en el evento onClick
          >
            <img
              className="thumbnail"
              alt={`Thumbnail ${texture.name}`}
              src={BASE_URL + ASSETS + texture.thumbnailUrl}
            />
          </div>
        ))}
      </div>
    );
  }
}
