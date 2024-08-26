import React, { Component } from 'react';
import EditorTextoCompleto from '../../../EditorTexto/editorTextoCompleto';
import authService from '../../../../services/auth.service';
import entradaService from '../../../../services/entrada.service';

export default class NuevaEntrada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      texto: this.props.texto ? this.props.texto : "",
      titulo: this.props.titulo ? this.props.titulo : "",
      borrador: this.props.borrador ? this.props.borrador : false,
      etiquetas: this.props.etiquetas ? this.props.etiquetas : [],
      nuevaEtiqueta: "",
      idEntrada: this.props.idEntrada ? this.props.idEntrada : 0,
    };
    this.inputRef = React.createRef();
  }


  handleChangeTexto(texto) {
    this.setState({ texto: texto })
  }

  cancelar() {
    this.props.cancelar();
  }

  handlePublicar = async e => {
    e.preventDefault();
   
    if (!this.props.idEntrada) {
      await this.setState({ entrada: await entradaService.crearEntrada(authService.getCurrentUser().id, this.state.titulo, this.state.etiquetas, this.state.texto, this.state.borrador ? 1 : 0) });
      this.props.onPublicado(this.state.entrada);
    }
    else {
      this.props.onPublicado({
        id: this.state.idEntrada,
        idBlog: authService.getCurrentUser().id,
        titulo: this.state.titulo,
        etiquetas: this.state.etiquetas,
        texto: this.state.texto,
        borrador: this.state.borrador ? 1 : 0
      });
    }

    

  }

  nuevaEtiqueta(e) {
    e.preventDefault();
    if (this.state.etiquetas.indexOf(this.state.nuevaEtiqueta) === -1 && this.state.nuevaEtiqueta !== "") {
      let a = this.state.etiquetas;

      a.push(this.state.nuevaEtiqueta);
      
      this.setState({ etiquetas: a, nuevaEtiqueta: "" })
    }
    this.inputRef.current.focus();
  }

  eliminarEtiqueta(index) {
    let a = this.state.etiquetas;
    a.splice(index, 1);
    this.setState({ etiquetas: a })

  }


  render() {
    return (
      <form onSubmit={this.handlePublicar}>


        <p>Título</p>
        <input
          type="text"
          value={this.state.titulo}
          onChange={e => this.setState({ titulo: e.target.value })}
        />

        <p>Etiquetas</p>
        {this.state.etiquetas.map((i, index) => {
          return (
            <div key={index} style={{ marginRight: "3px", backgroundColor: "#AAAAAA", display: "inline-flex" }}>
              <span style={{ padding: "3px" }}>{i}</span>
              <label onClick={(e) => { e.preventDefault(); this.eliminarEtiqueta(index) }}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#f2f2f2',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease'

                }}
              >X</label>
            </div>
          );
        })}



        <input type="text" value={this.state.nuevaEtiqueta} ref={this.inputRef} onChange={e => this.setState({ nuevaEtiqueta: e.target.value })} />
        <button type="submit" onClick={(e) => { e.preventDefault(); this.nuevaEtiqueta(e) }}>O</button>
        <button type="submit" onClick={(e) => { e.preventDefault(); this.setState({ nuevaEtiqueta: "" }) }}>X</button>
        <p></p>


        <div>

          <EditorTextoCompleto texto={this.state.texto} onCambio={(texto) => this.handleChangeTexto(texto)} />

          <div style={{ display: "inline-flex", width: '700px', justifyContent: "space-between", marginBottom: '5px' }}>
            <p>Guardar como borrador</p>
            <input
              type="checkbox"
              label="Borrador"
              checked={this.state.borrador}
              onChange={e => this.setState({ borrador: e.target.checked })}
            />


            <button type="submit">Publicar</button>
            <button onClick={() => this.cancelar()}>Cancelar</button>



          </div>
        </div>

      </form>
    )

  }
}