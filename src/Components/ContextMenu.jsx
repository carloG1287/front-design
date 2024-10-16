import "../App.css";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { FaTrashAlt } from "react-icons/fa";

export default class ContextMenu extends Component {
  render() {
    return (
      <div>
        <Button
          variant="info"
          size="sm"
          style={{ marginTop: '10px' }}
          block
          id="context-menu-delete"
          className="outline-button"
        >
          <span className="icon-centre">
            <FaTrashAlt />
          </span>
          <span className="text-centre">Borrar elemento</span>
        </Button>
        <div className="panel">
          <div className="panel-heading">Ajustar tamaño</div>
          <hr className="small-underline" />
          <div className="panel-body">
            <div className="form-horizontal">
              <div className="form-group">
                <label className="control-label">Anchura</label>

                <input
                  type="number"
                  className="form-control"
                  id="item-width"
                ></input>
              </div>
              <div className="form-group">
                <label className="control-label">Profundidad</label>

                <input
                  type="number"
                  className="form-control"
                  id="item-depth"
                ></input>
              </div>
              <div className="form-group">
                <label className="control-label">Altura</label>

                <input
                  type="number"
                  className="form-control"
                  id="item-height"
                ></input>
              </div>
              <div className="form-group" id="item-elevation-div">
                <label className="control-label">Elevación</label>

                <input
                  type="number"
                  className="form-control"
                  id="item-elevation"
                ></input>
              </div>
            </div>
            <small>
              <span>Medidas en pulgadas</span>
            </small>
          </div>
        </div>
        <input type="checkbox" id="fixed" />{" "}
        <label htmlFor="fixed">Bloquear en lugar</label>
      </div>
    );
  }
}
