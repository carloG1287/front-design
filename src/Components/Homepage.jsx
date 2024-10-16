import React, { Component } from "react";
import AppContenido from "./AppContenido.jsx";
import TopBar from "./TopBar/TopBar.jsx";
import ComingSoonPage from "./ComingSoonPage.jsx";
import { inject, observer } from "mobx-react";

@inject("store")
@observer
class Homepage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { store } = this.props;
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <TopBar />
        {this.props.match && (
          <AppContenido
            viewKey={this.props.match.params.viewKey}
            añadirManejadorDeClick={store.obtenerManejadorDeClick}
          />
        )}
        {!this.props.match && (
          <AppContenido
            viewKey=""
            añadirManejadorDeClick={store.obtenerManejadorDeClick}
          />
        )}
        <ComingSoonPage />
      </div>
    );
  }
}

export default Homepage;
