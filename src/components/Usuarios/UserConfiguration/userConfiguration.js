import React from 'react';
import authService from '../../../services/auth.service';
import usuariosService from '../../../services/usuarios.service';


export default class UserConfiguration extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      usuario: null,
      carga: null,
      postppag: 20,
      email: null,
      pedirPassEmail: false,
      passwordEmail: "",
      permisosEmail: [],
      mostrarDados: false,

    };
  }

  componentDidMount = async e => {
    this.setState({
      postppag: await usuariosService.getPostpPag(authService.getCurrentUser().id),
      email: authService.getCurrentUser().email,
      permisosEmail: await usuariosService.getPermisosEmail(authService.getCurrentUser().id),
      mostrarDados: await usuariosService.getMostrarDados(authService.getCurrentUser().id),
    })


    this.setState({ carga: true })
  };

  handleSubmitPostpPag = async e => {
    e.preventDefault();

    usuariosService.guardarPostpPag(authService.getCurrentUser().id, this.state.postppag);
  }

  handleSubmitEmail = async e => {
    e.preventDefault();

    usuariosService.guardarPostpPag(authService.getCurrentUser().id, this.state.email, this.state.passwordEmail);
  }

  changePermisoEmail(index, value) {
    let a = this.state.permisosEmail;
    a[index] = value;
    this.setState({ permisosEmail: a })
  }

  handleSubmitPermisosEmail = async e => {
    e.preventDefault();

    usuariosService.guardarPermisosEmail(authService.getCurrentUser().id, this.state.permisosEmail);
  }

  handleSubmitMostrarDados = async e => {
    e.preventDefault();

    usuariosService.guardarMostrarDados(authService.getCurrentUser().id, this.state.mostrarDados);
  }


  render() {
    return (
      <div>
        {this.state.carga &&
          <div>

            <form onSubmit={this.handleSubmitPostpPag}>
              <span> Post por página: </span>
              <input
                type="number"
                value={this.state.postppag}
                onChange={e => e.target.value > 0 ? this.setState({ postppag: e.target.value }) : null}
              />
              <button type="submit">Guardar</button>
            </form>


            <form onSubmit={this.handleSubmitEmail}>
              <span> Correo electrónico: </span>
              <input
                type="text"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
              <button onClick={() => this.setState({ pedirPassEmail: true })}>Cambiar</button>
              {this.state.pedirPassEmail &&
                <div>
                  <span>Confirma tu contraseña: </span>
                  <input
                    type="password"
                    value={this.state.passwordEmail}
                    onChange={e => this.setState({ passwordEmail: e.target.value })}
                  />
                  <button type="submit">Guardar</button>

                </div>
              }
            </form>
            <p></p>
            <form onSubmit={this.handleSubmitPermisosEmail}>
              <p>Deseo recibir correos electrónicos cuando:</p>
              <p>
                <input
                  type="checkbox"
                  value={this.state.permisosEmail[0]}
                  checked={this.state.permisosEmail[0]}
                  onChange={e => this.changePermisoEmail(0, e.target.checked ? 1 : 0)}
                />
                <span> Me envíen un mensaje privado. </span>
              </p>


              <p>
                <input
                  type="checkbox"
                  value={this.state.permisosEmail[1]}
                  checked={this.state.permisosEmail[1]}
                  onChange={e => this.changePermisoEmail(1, e.target.checked ? 1 : 0)}
                />
                <span> Respondan en una partida que dirijo. </span>
              </p>


              <p>
                <input
                  type="checkbox"
                  value={this.state.permisosEmail[2]}
                  checked={this.state.permisosEmail[2]}
                  onChange={e => this.changePermisoEmail(2, e.target.checked ? 1 : 0)}
                />
                <span> Respondan en una partida que juego. </span>
              </p>


              <p>
                <input
                  type="checkbox"
                  value={this.state.permisosEmail[3]}
                  checked={this.state.permisosEmail[3]}
                  onChange={e => this.changePermisoEmail(3, e.target.checked ? 1 : 0)}
                />
                <span> Respondan en un hilo que sigo. </span>
              </p>


              <p>
                <input
                  type="checkbox"
                  value={this.state.permisosEmail[4]}
                  checked={this.state.permisosEmail[4]}
                  onChange={e => this.changePermisoEmail(4, e.target.checked ? 1 : 0)}
                />
                <span> Un usuario que sigo publique una partida. </span>
              </p>



              <button type="submit">Guardar</button>

            </form>


            <form onSubmit={this.handleSubmitMostrarDados}>
              <span> Mostrar animaciones de dados: </span>
              <input
                type="checkbox"
                value={this.state.mostrarDados}
                checked={this.state.mostrarDados}
                onChange={e => this.setState({ mostrarDados: e.target.checked ? 1 : 0 })}
              />
              <button type="submit">Guardar</button>
            </form>
          </div>
        }
      </div>
    )
  }
}



