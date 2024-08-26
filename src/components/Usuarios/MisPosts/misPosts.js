import React, { Component } from 'react';

import ReactHtmlParser from 'react-html-parser';
import authService from '../../../services/auth.service';
import { SPACE_URL } from '../../../constantes';
import misPostsService from '../../../services/misposts.service';
import mispostsService from '../../../services/misposts.service';
import AvatarPersonaje from '../../Utilidad/AvatarPersonaje/avatarPersonaje';

export default class MisPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fechas: [],
      partidas: [],
      posts: [],
      desglosadoPartida: null,
      desglosadoPost: null

    };
  }


  async componentDidMount() {

    this.setState({
      fechas: await misPostsService.fechas(authService.getCurrentUser().id),
      carga: 1,
    })

  }


  async cargaPartidas(ano, mes, i) {
    if (this.state.desglosadoPartida === i) this.setState({ desglosadoPartida: null })
    else this.setState({
      desglosadoPartida: i,
      desglosadoEscena: null,
      partidas: await mispostsService.partidasMes(authService.getCurrentUser().id, ano, mes),
    })

  }

  async cargaEscenas(idPartida, ano, mes, j) {
    if(this.state.desglosadoEscena === j) this.setState({desglosadoEscena: null})
    else this.setState({
      desglosadoEscena: j,
      desglosadoPost: null,
      escenas: await mispostsService.escenasMes(authService.getCurrentUser().id, idPartida, ano, mes),
    })

  }


  async cargaPosts(idEscena, ano, mes, k) {
    if(this.state.desglosadoPost === k) this.setState({desglosadoPost: null})
   else this.setState({
      desglosadoPost: k,
      posts: await mispostsService.postsMes(authService.getCurrentUser().id, idEscena, ano, mes),
    })

  }


  render() {
    return (
      <div>

        {this.state.carga &&
          <div className="container">
            <div className="jumbotron">
              <h2>Mis Posts</h2>
              <ul>
                {this.state.fechas.map((i, index) =>
                  <li key={index}>
                    <p onClick={() => { this.cargaPartidas(i[1], i[2], index) }}>{i[0]}</p>

                    {this.state.desglosadoPartida === index &&
                      <div>
                        {this.state.desglosadoPartida !== null && <h3>Lista de partidas de {i[0]}</h3>}
                        {this.state.partidas.map((j, index2) =>

                          <div key={index2}>
                            <p onClick={() => { this.cargaEscenas(j[1], i[1], i[2], index2) }} style={{marginLeft: "5px"}}> {j[0]}</p>

                            {this.state.desglosadoEscena === index2 &&
                              <div>
                                {this.state.desglosadoPartida !== null && <h3>Lista de escenas de {j[0]} en {i[0]}</h3>}
                                {this.state.escenas.length === 0 && <p>No hay escenas</p>}
                                {this.state.escenas.map((k, index3) =>

                                  <div key={index3}> 
                                    <p onClick={() => { this.cargaPosts(k[1], i[1], i[2], index3) }} style={{marginLeft: "15px"}}>{k[0]}</p>
                                    {this.state.desglosadoPost === index3 &&
                                      <div>
                                        {this.state.desglosadoPost !== null && <h3>Lista de posts</h3>}
                                        {this.state.posts.length === 0 && <p>No hay escenas</p>}
                                        {this.state.posts.map((l, index4) =>

                                          <div key={index4}>
                                            <AvatarPersonaje
                                              src={SPACE_URL + "/avatarPj/" + l[2]}
                                              width="50px"
                                              className="PASPTAD"
                                              alt=""

                                            />
                                       
                                            <div>

                                              <p><strong>{l[1]} escribió:</strong></p>
                                              {ReactHtmlParser(l[0])}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                    }

                                  </div>
                                )}
                              </div>

                            }

                          </div>
                        )}
                      </div>

                    }
                  </li>)}
              </ul>

            </div>
          </div>
        }


      </div>
    )

  }
}