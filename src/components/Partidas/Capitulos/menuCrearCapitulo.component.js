import React from 'react';
import '../../../css/App.css';
import '../../../css/Partida.css';
import EditorTextoCompleto from '../../EditorTexto/editorTextoCompleto';
import escenaService from '../../../services/escena.service';


export default class MenuCrearCapitulo extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        imagen: '',
        id: 0,
        nombre: '',
        descripcion: '',
        error:'',
        nCapitulo: null
  
      };
    }
  
    handleSubmit = async (e) => {
      e.preventDefault();
      if(this.state.nombre!==''){
      this.setState({
        nCapitulo:await escenaService.crearCapitulo(this.state.nombre, this.state.descripcion, this.props.partida.id )
      })
      this.props.capituloCreado(this.state.nCapitulo)
    }
    };
  
    render() {
      return (
        <div>
  
      
            <form onSubmit={this.handleSubmit}>
  
              <p>Nombre: </p>
              <input
                type="text"
                value={this.state.nombre}
                onChange={e => this.setState({ nombre: e.target.value })}
              />
             
              <p>Descripción: </p>
              <EditorTextoCompleto texto={this.state.descripcion} onCambio={(texto)=>this.setState({descripcion: texto})} />

              <p></p>
  
              <button type="submit">Crear capitulo</button>
            </form>
  
  
        </div>
      );
    }
  }