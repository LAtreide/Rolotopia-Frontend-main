
import React from 'react'
import { SPACE_URL } from '../../../constantes';

export default class AvatarPersonaje extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      usuario: null,
      carga: null,
      imagen: this.props.src
    };
  }

  render() {
    return (
      <img src={this.state.imagen} onError={() => this.setState({ imagen: SPACE_URL+ "/avatarPj/defecto.png" })} width={this.props.width} height={this.props.height} alt={this.props.alt} style={this.props.style}/>
    )
  }
}

