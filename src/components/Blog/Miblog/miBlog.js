import React, { Component } from 'react';
import authService from '../../../services/auth.service';
import blogService from '../../../services/blog.service';
import Crop from '../../Upload/crop.component';
import PortadaBlog from '../PortadaBlog';
import { SPACE_URL } from '../../../constantes';
import { Link } from "react-router-dom";

export default class MiBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      existe: false,
      blog: {}
    };
  }


  async componentDidMount() {
    this.setState({
      existe: await blogService.tieneBlog(authService.getCurrentUser().id),
    })
    if (this.state.existe) this.setState({ blog: await blogService.infoBlog(authService.getCurrentUser().id) })
    else this.setState({ blog: blogService.infoBlog(authService.getCurrentUser().id) })
  }



  handleSubmit = async e => {

    this.setState({
      blog: await blogService.crearBlog(authService.getCurrentUser().id),
      existe: true
    })

  }


  subida(e) {
      let b = this.state.blog;
    b.portada = e;
    this.setState({ blog: b })

  }
  render() {
    return (
      <div>

        {this.state.existe ?
          <div>
            <Link to={"/blog/" + this.state.blog.enlace} className="link"><h1>{this.state.blog.titulo}</h1></Link>
            
            <PortadaBlog src={SPACE_URL + "/portadaBlog/" + this.state.blog.portada} key={this.state.blog.portada} />
            <Crop ancho={500} alto={500} destino="portadaBlog" texto="Cambiar portada" subida={(e) => this.subida(e)} />
          </div>
          : <div>
            <p>Aún no has creado un blog</p>
            <button onClick={() => this.handleSubmit()} style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
              Crearlo ahora
            </button>

          </div>}

      </div>
    )

  }
}