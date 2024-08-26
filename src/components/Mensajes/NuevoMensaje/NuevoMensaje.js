import React from 'react';
import EditorTextoCompleto from '../../EditorTexto/editorTextoCompleto';
import UsuariosService from '../../../services/usuarios.service';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import mensajeService from '../../../services/mensaje.service';
import AuthService from '../../../services/auth.service';

export default class NuevoMensaje extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      carga: false,
      texto: this.props.texto ? this.props.texto : "",
      contenido: [],
      usuarios: [],
      destinatarios: this.props.destinatarios ? this.props.destinatarios : [],
      asunto: this.props.asunto ? this.props.asunto : "",
      importante: false,
      enviado: null,
      respuesta: this.props.respuesta ? this.props.respuesta : 0,
      hilo: this.props.respuesta ? this.props.hilo : 0,
      texRespuesta: this.props.texRespuesta ? this.props.texRespuesta : "",

    };


    this.handleChangeTexto = this.handleChangeTexto.bind(this);
  }

  componentDidMount = async e => {
      this.setState({
      usuarios:  await UsuariosService.listaUsuarios(),
      
    })
    this.setState({carga: 1})

  };
  setValue(newValue) {
    this.setState({ destinatarios: newValue });
  }

  async handleChangeTexto(texto) {
    this.setState({ texto: texto })
  }

  handlePublicar = async e => {
    e.preventDefault();
    this.setState({ enviado: await mensajeService.nuevoMensaje(AuthService.getCurrentUser().id, this.state.hilo, this.state.destinatarios, this.state.asunto, this.state.importante ? 1 : 0, this.state.texto, this.state.respuesta, this.state.texRespuesta) })
    this.props.onEnviado(this.state.enviado);
  }

  render() {
    return (

      <div>
        <form onSubmit={this.handlePublicar}>

          <Autocomplete
            multiple
            id="size-small-standard-multi"
            options={this.state.usuarios}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => { this.setValue(newValue); }}
            style={{ width: 300 }}
            value={this.state.destinatarios}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Destinatarios"
                placeholder="Usuarios"
              />
            )}
          />

          <p>Asunto</p>
          <input
            type="text"
            value={this.state.asunto}
            onChange={e => this.setState({ asunto: e.target.value })}
          />
          <p>Importante</p>
          <input
            type="checkbox"
            label="Importante"
            checked={this.state.importante}
            onChange={e => this.setState({ importante: e.target.checked })}
          />

          <div>

            <EditorTextoCompleto texto={this.state.texto} onCambio={(texto)=>this.handleChangeTexto(texto)} />

            <div style={{ display: "inline-flex", width: '700px', justifyContent: "space-between", marginBottom: '5px' }}>
              
              {this.state.destinatarios.length>0  && this.state.asunto !== "" && this.state.texto && this.state.texto !== "<p></p>" ?
                 
                    <button type="submit" className='botonActivo'>Enviar mensaje</button> :
                    <button onClick={(e) => e.preventDefault()} className="botonActivo botonProhibido">Enviar mensaje</button>
                  }
              
            </div>
          </div>

        </form>
      </div>
    )
  }
}

