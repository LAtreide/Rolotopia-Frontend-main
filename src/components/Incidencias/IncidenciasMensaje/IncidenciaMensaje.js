import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import NombreUsuario from '../../Usuarios/NombreUsuario';
import AvatarUsuario from '../../Utilidad/AvatarUsuario/avatarUsuario';
import authService from '../../../services/auth.service';
import { Rnd } from 'react-rnd';
import EditorTextoCompleto from '../../EditorTexto/editorTextoCompleto';
import foroService from '../../../services/foro.service';
import { SPACE_URL } from '../../../constantes';

export default class IncidenciaMensaje extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      menuEditar: false,
      textoAux: "",
      texto: this.props.mensaje.mensaje,
      borrado: false
    };


  }


  handleSubmitEditar = async e => {
    e.preventDefault();
    foroService.editarMensaje(this.props.mensaje.id, this.state.textoAux);
    this.setState({texto:this.state.textoAux})
    this.setState({
      menuEditar: false,
      textoAux: "",
    });


  }

  borrarMensaje(){
    this.setState({borrado: true})
    foroService.borrarMensaje(this.props.mensaje.id);
    
  }

  render() {
    return (

      <div>
        {this.state.menuEditar ?

          <form onSubmit={this.handleSubmitEditar}>

            <div style={{ width: '700px', textAlign: 'left', color: 'black' }}>

              <EditorTextoCompleto texto={this.state.textoAux} onCambio={(texto) => this.setState({ textoAux: texto })} />

              <div style={{ display: "inline-flex", width: '700px', justifyContent: "space-between", marginBottom: '5px' }}>
              </div>
            </div>
            {this.state.textoAux !== "" ?
              <button type="submit">Enviar Mensaje</button> :
              <button onClick={(e) => e.preventDefault()} style={{ opacity: '50%', cursor: 'not-allowed' }}>Enviar Mensaje</button>
            }
            <button onClick={() => this.setState({ menuEditar: false, textoAux: "" })}> Cancelar</button>

          </form>

          :
          <div style={{ border: '1px solid black' }}>
            <div>
              <h3><NombreUsuario usuario={this.props.mensaje.nombreAutor} /></h3>

            </div>

            <div style={{ float: 'right' }}>

              {(this.props.mensaje.idAutor === authService.getCurrentUser().id || authService.getCurrentUser().roles.includes("ROLE_MODERATOR") || authService.getCurrentUser().roles.includes("ROLE_ADMIN")) ?
                <input type="submit" value={this.state.menu ? "⇭" : "⤋"} onClick={() => this.setState({ menu: !this.state.menu })} /> : null}

              {this.state.menu &&
                <div style={{ display: 'block' }}>
                  <Rnd
                    disableDragging
                    enableResizing={{
                      bottom: false
                    }}
                    style={{ boxSizing: 'border-box', border: '1px solid blue', backgroundColor: 'white', paddingRight: '10px' }}
                  >
                    <ul>
                      <li><button onClick={() => { if (window.confirm('¿Estás seguro de que quieres borrar este mensaje?')) this.borrarMensaje() }}> Borrar Mensaje</button></li>
                      <li><button onClick={() => this.setState({ menu: false, menuEditar: true, textoAux: this.state.texto })}> Editar Mensaje</button></li>

                    </ul>
                  </Rnd>
                </div>
              }


            </div>

            <div style={{ display: "inline-block", }}>
              <AvatarUsuario src={SPACE_URL+"/avatarUser/" + this.props.mensaje.avatarAutor} width="200px" alt="" />


            </div>

            {ReactHtmlParser(this.state.texto)}

          </div>

        }
      </div>
    )
  }
}

