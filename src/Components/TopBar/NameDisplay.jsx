import "../../App.css";
import React, { Component } from "react";

class NameDisplay extends Component {
  render() {
    return <div className="name-display">{this.props.nombreDeUsuario}</div>;
  }
}

export default NameDisplay;
