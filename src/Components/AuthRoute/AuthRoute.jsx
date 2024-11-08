import PropTypes from "prop-types";
import React, { Component } from "react";
import TopBar from "../TopBar/TopBar.jsx";
import Loading from "../Loading/Loading.jsx";
import { Route, Redirect } from "react-router-dom";
import { observer, inject } from "mobx-react";
import store from "../../InteriorDesignStore.js";

@inject("store")
@observer
class AuthRoute extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.elementType.isRequired, // Cambiado a elementType para componentes
  };

  state = {
    nodeShouldBeRender: <Loading />,
    isTopBarRender: false,
  };

  handleAuth = () => {
    setTimeout(() => {
      console.log(store.usuarioHaIniciadoSesion);
      if (store.usuarioHaIniciadoSesion) {
        this.setState({
          isTopBarRender: true,
          nodeShouldBeRender: React.createElement(this.props.component), // Crear elemento del componente
        });
      } else {
        this.setState({
          isTopBarRender: false,
          nodeShouldBeRender: (
            <Redirect
              to={{
                pathname: "/inicio-sesion",
                state: { from: window.navigator.pathname },
              }}
            />
          ),
        });
      }
    }, 1000);
  };

  componentDidMount() {
    this.handleAuth();
  }

  render() {
    const { isTopBarRender, nodeShouldBeRender } = this.state;
    const { path } = this.props;

    return (
      <div style={{ width: "100%", height: "100%" }}>
        {isTopBarRender ? <TopBar /> : undefined}
        <Route path={path}>{nodeShouldBeRender}</Route>
      </div>
    );
  }
}

export default AuthRoute;
