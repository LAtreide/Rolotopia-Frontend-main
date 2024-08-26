
import React from 'react'
import { SPACE_URL } from '../../../constantes';

export default class AvatarUsuario extends React.Component {

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
      <img src={this.state.imagen} onError={() => this.setState({ imagen: SPACE_URL+ "/avatarUser/defecto.png" })} width={this.props.width} height={this.props.height} alt="" style={this.props.style}/>
    )
  }
}

