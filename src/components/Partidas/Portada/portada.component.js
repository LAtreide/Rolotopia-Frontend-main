
import React from 'react'
import { SPACE_URL } from '../../../constantes';

export default class Portada extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      portada: null,
      carga: null,
      imagen: this.props.src
    };
  }

  render() {
    return (
      <img src={this.state.imagen} onError={() => this.setState({ imagen: SPACE_URL + "/portadaBlog/defecto.png" })} width={this.props.width} height={this.props.height} alt="Portada" style={this.props.style}/>
    )
  }
}

