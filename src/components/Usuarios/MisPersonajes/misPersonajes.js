import React, { Component } from 'react';

import perspropioService from '../../../services/perspropio.service.';
import authService from '../../../services/auth.service';
import AvatarInfoPerspropio from './AvatarInfoPerspropio';
import { SPACE_URL } from '../../../constantes';

export default class MisPersonajes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personajes: [],
      carga: null,
      usuario: authService.getCurrentUser(),
      showCrearPersonaje: false,


    };
  }


  async componentDidMount() {



    this.setState({
      personajes: await perspropioService.lista(authService.getCurrentUser().id),
      carga: 1,
    })

  }


  onClick = () => this.setState({ showCrearPersonaje: !this.state.showCrearPersonaje });
  nuevaPartida = (a) => {
    let b = this.state.partidas;
    b[0][this.state.partidas[0].length] = a;
    this.setState({ partidas: b, showCrearPartida: false });
  }



  handleSubmit = async e => {
    e.preventDefault();

    let a = this.state.personajes;
    let b = await perspropioService.crear(
      this.state.nombre,
      authService.getCurrentUser().id
    )
    a.push(b)
    this.setState({ personajes: a })
  }




  render() {
    return (
      <div>

        {this.state.carga &&
          <div className="container">
            <div className="jumbotron">
              <h2>Mis personajes</h2>
              <ul>
                {this.state.personajes.map(i =>
                  <li key={i.id}>

                    <AvatarInfoPerspropio
                      src={SPACE_URL + "/avatarPj/" + i.avatar}
                      width="100px"
                      alt=""
                      personaje={i}


                    />
                    {i.nombre}
                  </li>)}
              </ul>

              <input type="submit" value="Nuevo Personaje" onClick={this.onClick} />

              {this.state.showCrearPersonaje &&
                <form onSubmit={this.handleSubmit}>
                  <p></p>
                  <span>Nombre del personaje</span>
                  <input
                    type="text"
                    value={this.state.nombre}
                    onChange={e => this.setState({ nombre: e.target.value })}
                    style={{ width: "250px" }}
                  />

                  <p></p>
                  <button type="submit">Crear personaje</button>
                  <button onClick={this.onClick}> Cancelar</button>
                </form>
              }
            </div>
          </div>
        }


      </div>
    )

  }
}