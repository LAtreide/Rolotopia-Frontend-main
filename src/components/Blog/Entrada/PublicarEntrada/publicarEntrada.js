import React, { Component } from 'react';
import { FaComment, FaCommentSlash } from "react-icons/fa";
import "../../../../css/Blog.css"
import ReactHtmlParser from 'react-html-parser';
import comentarioService from '../../../../services/comentario.service';
import entradaService from '../../../../services/entrada.service';
import authService from '../../../../services/auth.service';
import EditorTextoCompleto from '../../../EditorTexto/editorTextoCompleto';

export default class PublicarEntrada extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cargan: null,
      asunto: "",
      texto: "",
      titulo: "",
      borrador: false,
      etiquetas: [],
      emojis: [],
      nComentarios: 0,
      reaccion: null,
      reacciones: [["👍", "Me gusta"], ["❤️", "Me encanta"], ["😂", "Me divierte"], ["🔥", ""], ["😱", ""], ["👏", ""]],
      comentar: false,
      comentario: ""
    };
  }

  async componentDidMount() {
    this.setState({
      nComentarios: await comentarioService.nComentarios(this.props.entrada.id),
      emojis: await entradaService.getEmojis(this.props.entrada.id),
      etiquetas: await entradaService.getEtiquetas(this.props.entrada.id),
      reaccion: await entradaService.emojiUsuarioEntrada(this.props.entrada.id, authService.getCurrentUser().id),
      listaComentarios: await comentarioService.listaComentarios(this.props.entrada.id),

    })
    this.setState({ carga: 1 })
    
  }

  handleReactionClick = async (emoji) => {
    if (this.state.reaccion === emoji) {
      await entradaService.guardarEmoji(this.props.entrada.id, authService.getCurrentUser().id, 0)
      this.setState({
        reaccion: null,
        emojis: await entradaService.getEmojis(this.props.entrada.id)
      });

    }
    else {
      await entradaService.guardarEmoji(this.props.entrada.id, authService.getCurrentUser().id, emoji);
      this.setState({
        reaccion: emoji,
        emojis: await entradaService.getEmojis(this.props.entrada.id)
      });

    }
  };

  async enviarComentario() {
    this.setState({ comentario: "", comentar: false })
    let a = await comentarioService.crearComentario(this.props.entrada.id, this.state.comentario, authService.getCurrentUser().id)
    let b=this.state.listaComentarios;
    b.push(a);
    this.setState({listaComentarios: b})
  }

  render() {
    return (
      <div>
        {this.state.carga === 1 &&
          <div className="blog-entry">
            <div className="blog-entry-header">
              <h2 className="blog-entry-title" onClick={() => this.props.handleEntrada(this.props.entrada.enlace)}>{this.props.entrada.titulo}</h2>
              <div className="blog-entry-meta">
                <span className="blog-entry-date">Fecha de publicación: {this.props.entrada.fecha}</span>

                {this.state.etiquetas.length > 0 ?
                  <div>
                    <span className="blog-entry-tags" >Etiquetas:
                      {this.state.etiquetas.map((i, index) => {
                        return (
                          <span href="#" key={i}>{i}</span>
                        );
                      })}
                    </span>
                  </div>
                  : null}


                <span className="blog-entry-comments"> <FaComment />
                  {this.state.nComentarios === 1 ? "1 comentario" : this.state.nComentarios + " comentarios"}
                </span>
              </div>
            </div>
            <div className="blog-entry-text">
              {ReactHtmlParser(this.props.entrada.texto)}
            </div>
            <div className="blog-entry-reactions">


              {this.state.reacciones.map((i, index) => {
                return (
                  <div className="blog-entry-reaction" key={index}>
                    <button className={"blog-entry-reaction-button " + (this.state.reaccion === index + 1 ? "active" : "")} onClick={() => this.handleReactionClick(index + 1)}>
                      <span role="img" aria-label={i[1]}>{i[0]}</span>
                    </button><span>{this.state.emojis[index + 1]}</span>
                  </div>
                );
              })}
            </div>

            <div className="blog-entry-buttons">
              {this.state.comentar ?
                <button className="blog-entry-comment-button" onClick={() => { this.setState({ comentar: false }) }}><FaCommentSlash /> No comentar</button>
                :
                <button className="blog-entry-comment-button" onClick={() => { this.setState({ comentar: true }) }}><FaComment /> Comentar</button>
              }
            </div>
            {this.state.listaComentarios.map((i, index) => {
              return (
                <div className="blog-comment" key={index}>
                  <p>{i.idUsuario} escribió:</p>
                  {ReactHtmlParser(i.texto)}
                  <p>el día {i.fecha}</p>



                </div>
              );
            })}
          </div>
        }
        {this.state.comentar &&
          <div>

            <EditorTextoCompleto texto={this.state.comentario} onCambio={(comentario) => this.setState({ comentario: comentario })} />

            <div style={{ display: "inline-flex", width: '700px', justifyContent: "space-between", marginBottom: '5px' }}>

              {this.state.comentario && this.state.comentario !== "<p></p>" ?

                <button className='botonActivo' onClick={() => this.enviarComentario()}>Comentar</button> :
                <button onClick={(e) => e.preventDefault()} className="botonActivo botonProhibido">Comentar</button>
              }

            </div>
          </div>
        }
      </div>
    )

  }
}

