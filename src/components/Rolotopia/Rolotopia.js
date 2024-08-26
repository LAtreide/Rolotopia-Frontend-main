import React, { Component } from 'react';
import { Link } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import usuariosService from '../../services/usuarios.service';
import foroService from '../../services/foro.service';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TimeLine from '../TimeLine';

import "../../css/Rolotopia.css";
import blogService from '../../services/blog.service';

export default class Rolotopia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      jugador: null,
      dias: 365,
      foros: [],
      blogs: [],

    };


  }

  setValue = (value) => this.setState({ jugador: value });


  componentDidMount = async e => {
    this.setState({

      usuarios: await usuariosService.listaUsuarios(),
      foros: await foroService.ultimosMensajes(this.state.dias),
      blogs: await blogService.blogPopulares(this.state.dias)

    })
    this.setState({ carga: 1 })

  };

  cambioPeriodo = async dias => {
    this.setState({
      dias: dias,
      foros: await foroService.ultimosMensajes(dias),
      blogs: await blogService.blogPopulares(dias)
    })
  }

  render() {
    return (
      <div className="container-fluid rolotopia-container">
        <div className="row">
          <div className="col">
            <div className="noticias-section bg-light p-4 mb-4">

              <h2>Noticias</h2>

            </div>
          </div>
        </div>

        <select value={this.state.dias} onChange={(e) => this.cambioPeriodo(e.target.value)}>

          <option value="365">Últimos 365 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="7">Últimos 7 días</option>
          <option value="2">Últimos 2 días</option>
        </select>

        <div className="row">
          <div className="col-lg-4">
            <div className="side-sections">
              <div className="foros-section bg-light p-4 mb-4">

                <h2>Foros</h2>
                <Link to={"/foros"} >
                  Acceso al Foro
                </Link>
                <h3>Últimos mensajes</h3>
                {this.state.foros.length > 0 &&
                  <ul>
                    {this.state.foros.map((hilo, index) => (
                      <li key={index}>
                        <a href={"/foro/" + hilo[2] + "/hilo/" + hilo[3]}>{hilo[1]} {hilo[5]}</a>
                      </li>
                    ))}
                  </ul>}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="side-sections">
              <div className="blogs-section bg-light p-4 mb-4">

                <h2>Blogs</h2>
                <h3>Los más populares</h3>
                {this.state.blogs.length > 0 &&
                  <ul>
                    {this.state.blogs.map((blog, index) => (
                      <li key={index}>
                        <a href={"/blog/" + blog[2] + "/entrada/" + blog[4]}>{blog[3]}</a>
                      </li>
                    ))}
                  </ul>}
                <h3>Últimas entradas</h3>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="side-sections">
              <div className="rolotopitas-section bg-light p-4 mb-4">

                <h2>Rolotopitas</h2>
                <div style={{ display: 'inline' }}>
                  <Autocomplete
                    value={this.state.jugador}
                    onChange={(event, newValue) => { this.setValue(newValue); }}

                    options={this.state.usuarios}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Buscar perfil" variant="outlined" />}
                  />
                  {this.state.jugador && <Link to={"/usuario/" + this.state.jugador} >
                    Visitar perfil
                  </Link>
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="timeline-section bg-light p-4">

              <h2>Timeline</h2>
              <TimeLine />

            </div>
          </div>
        </div>
      </div>
    );
  }
}



