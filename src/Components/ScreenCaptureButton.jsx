import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCamera } from 'react-icons/fa';

class ScreenCaptureButton extends Component {
  constructor(props) {
    super(props);
    this.handleCaptureClick = this.handleCaptureClick.bind(this);
  }

  handleCaptureClick() {
    // Seleccionamos el elemento que queremos capturar, en este caso todo el body
    html2canvas(document.body.querySelector('#root').querySelector('div')).then((canvas) => {
      // Convertimos el canvas a una imagen y la descargamos
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'captura.png';
      link.click();
    });
  }

  render() {
    return (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip>Capturar</Tooltip>}
      >
        <Button
          className='repeatButton'
          onClick={this.handleCaptureClick}
        >
          <div className="icons">
            <div className="iconWrapper">
              <FaCamera size='25px' />
            </div>
          </div>
        </Button>
      </OverlayTrigger>
    );
  }
}

export default ScreenCaptureButton;