import React, { Component } from 'react';

import perspropioService from '../../../../services/perspropio.service.';
import authService from '../../../../services/auth.service';
import AvatarInfoPerspropio from '../AvatarInfoPerspropio';
import { SPACE_URL } from '../../../../constantes';

export default class ListaPerspropiosPublicos extends Component {
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
      personajes: await perspropioService.listaPerspropiosPublicos(this.props.idUsuario),
      carga: 1,
    })

  }





  render() {
    return (
      <div>

        {this.state.carga &&
       
            <div className="jumbotron container">
              <h2>Sus personajes</h2>
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

     
          </div>
        }


      </div>
    )

  }
}