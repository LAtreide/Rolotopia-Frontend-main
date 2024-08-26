import React from 'react';
import { SPACE_URL } from '../../constantes';
import UsuariosService from '../../services/usuarios.service';
import NombreUsuario from './NombreUsuario';
import TimeLine from "../TimeLine";
import ListaPerspropiosPublicos from './MisPersonajes/LstaPerspropiosPublicos';
import blogService from '../../services/blog.service';
import { Link } from "react-router-dom";

export default class Usuario extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      usuario: null,
      carga: null,
      imagen: "",
      tieneBlog: false,
      blog: {}
    };
  }

  componentDidMount = async e => {
    this.setState({ usuario: await UsuariosService.infoUsuario(this.props.usuario), carga: 1 });
    this.setState({imagen: SPACE_URL+"/avatarUser/" + this.state.usuario.avatar})
    this.setState({
      tieneBlog: await blogService.tieneBlog(this.state.usuario.id),
    })
    if (this.state.tieneBlog) this.setState({ blog: await blogService.infoBlog(this.state.usuario.id) })

  };


  render() {
    return (
      <div>
        {this.state.carga ?
          <div>
            {this.state.usuario.id >0 ?
              <div>
            <h1><NombreUsuario usuario={this.state.usuario.nombre} /></h1>
            <img src={this.state.imagen} onError={()=>this.setState({imagen: SPACE_URL+"/avatarUser/defecto.png" })} width="200px" alt="" />
              {this.state.tieneBlog &&
              <Link to={"/blog/" + this.state.blog.enlace} className="link"><h1>{this.state.blog.titulo}</h1></Link>
              }
            <ListaPerspropiosPublicos idUsuario={this.state.usuario.id}/>
            <TimeLine usuario={this.state.usuario.id}/>
          </div>
          :
          <h1>Usuario no encontrado</h1>
          }
          </div>
          :
          <h1>Buscando...</h1>}


      </div>
    );
  }
}


