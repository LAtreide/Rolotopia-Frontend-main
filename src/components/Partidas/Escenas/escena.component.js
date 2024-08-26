import React from 'react';
import NuevoPost from '../Posts/NuevoPost.component';
import PublicarPost from "../Posts/publicarpost.component"
import EscenaService from "../../../services/escena.service"
import PostService from "../../../services/posts.service"
import authService from '../../../services/auth.service';

import { useRef } from "react";
import { useEffect } from "react";
import partidaService from '../../../services/partida.service';


export default class Escenap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      escena: [],
      carga: null,
      destinatarios: this.props.destinatarios,
      avdestinatarios: this.props.avdestinatarios,
      posts: null,
      editar: [],
      insertar: [],
      showNuevoPost: false,
      scroll: 0,
      personajesEscena: this.props.personajesEscena,
      editor: [

        "undo",
        "redo",
        "style",
        "|",
        "bold",
        "italic",
        "strikethrough",
        "underline",
        "subscript",
        "superscript",
        "removeFormat",
        "|",
        "heading",
        "alignment",
        "outdent",
        "indent",
        "|",
        "-",
        "fontFamily",
        "fontBackgroundColor",
        "fontColor",
        "fontSize",
        "highlight",
        "bulletedList",
        "numberedList",
        "|",
        "imageInsert",
        "mediaEmbed",
        "blockQuote",
        "insertTable",
        "|",
        "horizontalLine",
        "specialCharacters",
        "|",
        "codeBlock",
        "link",
        "|"

      ],
      capMuestra: 0,
      escenasCapitulo: [],
    };

    this.onEditPost = this.onEditPost.bind(this);
    this.onInsertPost = this.onInsertPost.bind(this);

    this.cancelEditPost = this.cancelEditPost.bind(this);
    this.cancelInsertPost = this.cancelInsertPost.bind(this);

    this.onPublicar = this.onPublicar.bind(this);
    this.onEditarSend = this.onEditarSend.bind(this);
    this.onInsertarSend = this.onInsertarSend.bind(this);


  }

  componentDidMount = async e => {
    this.setState({
      escena: await EscenaService.infolink(this.props.escena),

    });

    if (this.props.director === false) {
      this.setState({ editor: await partidaService.editorInfo(this.props.partida.id) })
      let b = this.state.editor;

      while (b.indexOf(false) > -1) {
        b.splice(b.indexOf(false), 1);


      }
      if (b[0] === "|") b.splice(0, 1);
      if (b[b.length - 1] === "|") b.splice(b.length - 1, 1);

      for (let i = 0; i < b.length - 1; i++) {
        if (b[i] === "|" && b[i + 1] === "|") {
          b.splice(i, 1);

          i--;
        }
      }
      this.setState({ editor: b })

    }

    this.setState({

      maxpaginas: await PostService.npaginas(this.state.escena.id, authService.getCurrentUser().id),
    })

    this.setState({
      pagina: this.props.pagina ? await this.props.pagina : this.state.maxpaginas,

    })
    this.setState({
      posts: await PostService.lista(this.state.escena.id, this.state.pagina, authService.getCurrentUser().id),
    })

    if (this.state.posts) await this.setState({ carga: 1 })

  };


  onSubirPost = async (idPost) => {
    await PostService.subirPost(idPost);
    this.setState({

      posts: await PostService.lista(this.state.escena.id, this.state.pagina, authService.getCurrentUser().id),
    })
  }

  onBajarPost = async (idPost) => {
    await PostService.bajarPost(idPost);
    this.setState({

      posts: await PostService.lista(this.state.escena.id, this.state.pagina, authService.getCurrentUser().id),
    })
  }


  onBorrarPost = async (idPost) => {
    await PostService.borrarPost(idPost);
    this.setState({
      maxpaginas: await PostService.npaginas(this.state.escena.id, authService.getCurrentUser().id)
    });
    if (this.state.pagina > this.state.maxpaginas) {
      await this.setState({
        pagina: this.state.maxpaginas,
        posts: await PostService.lista(this.state.escena.id, this.state.maxpaginas, authService.getCurrentUser().id),
      });
    }
    else {

      var c = this.state.posts;
      var i = 0;
      for (i = 0; this.state.posts[i].id !== idPost; i++) { }
      c.splice(i, 1);
      var post = await PostService.siguientePost(this.state.escena.id, this.state.pagina, authService.getCurrentUser().id);
      if (post.id !== 0) {
        await this.setState({
          posts: [...c, post]
        })
      }
    }
  }


  onEditPost = async (idPost) => {
    let a = this.state.editar;
    a.push(idPost);
    this.setState({ editar: a });

  }


  onInsertPost = async (idPost) => {
    let a = this.state.insertar;
    a.push(idPost);
    this.setState({ insertar: a });

  }


  cancelEditPost = async (idPost) => {
    let a = this.state.editar;
    a.splice(a.indexOf(idPost), 1);
    this.setState({ editar: a });

  }

  cancelInsertPost = async (idPost) => {
    let a = this.state.insertar;
    a.splice(a.indexOf(idPost), 1);
    this.setState({ insertar: a });

  }



  onClickUno = async e => this.setState({
    pagina: 1,
    posts: await PostService.lista(this.state.escena.id, 1, authService.getCurrentUser().id)
  });


  onClickMas = async e => this.setState({
    pagina: this.state.pagina + 1,
    posts: await PostService.lista(this.state.escena.id, this.state.pagina + 1, authService.getCurrentUser().id)
  });

  onClickMenos = async e => this.setState({
    pagina: this.state.pagina - 1,
    posts: await PostService.lista(this.state.escena.id, this.state.pagina - 1, authService.getCurrentUser().id)
  });

  onClickMax = async e => this.setState({
    pagina: this.state.maxpaginas,
    posts: await PostService.lista(this.state.escena.id, this.state.maxpaginas, authService.getCurrentUser().id)
  });

  onEditarSend = async (post, index) => {
    let a = this.state.posts;
    a[index] = post;
    let b = this.state.editar;
    b.splice(b.indexOf(post.id), 1);
    this.setState({
      posts: a,
      editar: b
    });

  }


  onInsertarSend = async (post, index) => {
    let b = this.state.insertar;
    b.splice(b.indexOf(post.id), 1);
    this.setState({
      insertar: b
    });

    this.setState({
      maxpaginas: await PostService.npaginas(this.state.escena.id, authService.getCurrentUser().id)
    });
    await this.setState({
      posts: await PostService.lista(this.state.escena.id, this.state.pagina, authService.getCurrentUser().id),
    });



  }

  onPublicar = async (post) => {

    if (this.state.pagina === this.state.maxpaginas) {
      let a = this.state.posts;
      a.push(post);
      this.setState({ posts: a });
    }
    else {
      this.setState({
        maxpaginas: await PostService.npaginas(this.state.escena.id, authService.getCurrentUser().id)
      })

      this.setState({
        pagina: this.state.maxpaginas,
        posts: await PostService.lista(this.state.escena.id, this.state.maxpaginas, authService.getCurrentUser().id)
      })
    }
    this.setState({
      showNuevoPost: false
    })
  }


  render() {
    return (
      <div>
        {this.state.carga &&
          <div>

            <p>{this.props.pagina}</p>
            <div className="container-xl">

              <h2>{this.state.escena.nombre}</h2>



              {this.state.posts.length > 0 && <div className="pagination">
                <div className="arrow-left">
                  {this.state.pagina > 2 ? <span onClick={() => { this.onClickUno() }}>1</span> : null}
                  {this.state.pagina > 1 ? <span onClick={() => { this.onClickMenos() }}>Pag-</span> : null}
                </div>
                <div className="center">
                  <span className="active"><b>{this.state.pagina}</b></span>
                </div>

                <div className="arrow-right">
                  {this.state.pagina < this.state.maxpaginas ? <span onClick={() => { this.onClickMas() }}>Pag+</span> : null}
                  {this.state.pagina < this.state.maxpaginas - 1 ? <span onClick={() => { this.onClickMax() }}>{this.state.maxpaginas}</span> : null}
                </div>
              </div>}



              {this.state.carga && this.state.posts.length > 0 &&
                <div style={{ display: 'block', textAlign: 'left  ' }} >
                  <ul className="listaPosts">
                    {this.state.posts.map((i, index) =>
                      <li key={i.id}
                        style={{ listStyle: 'none' }}>
                        <div>
                          {this.state.insertar.includes(i.id) ?
                            <div>
                              <p>{i.id}</p>
                              <NuevoPost
                                editor={this.state.editor}
                                sistema={this.props.partida.idSistema}
                                escena={this.state.escena}
                                partida={this.props.partida}
                                pjsescribir={this.props.pjsescribir}
                                destinatarios={this.state.destinatarios}
                                avdestinatarios={this.state.avdestinatarios}
                                texto=""
                                notas=""
                                insertar={true}
                                idInsertar={i.id}
                                onEnviar={post => this.onInsertarSend(post, index)}
                                nombresPj={this.props.nombresPj}
                                cambiosAvatar={this.props.cambiosAvatar}
                              />
                              <button onClick={idPost => this.cancelInsertPost(idPost)}>Cancelar</button>

                            </div>

                            : null
                          }

                          {!this.state.editar.includes(i.id) ?
                            <div onLoad={() => i.id === parseInt(this.props.post) ? this.setState({ scroll: 1 }) : null}>
                              {i.id === parseInt(this.props.post) && this.state.scroll === 1 ? <ScrollDemo /> : null}

                              <PublicarPost
                                post={i}
                                escena={this.state.escena}
                                avdestinatarios={this.state.avdestinatarios}
                                idPartida={this.props.partida.id}
                                destinatariosTotales={this.state.destinatarios}
                                onSubirPost={idPost => this.onSubirPost(idPost)}
                                onBajarPost={idPost => this.onBajarPost(idPost)}
                                onBorrarPost={idPost => this.onBorrarPost(idPost)}
                                onEditPost={idPost => this.onEditPost(idPost)}
                                onInsertPost={idPost => this.onInsertPost(idPost)}
                                director={this.props.director}
                                editarDestinatarios={(post) => this.onEditarSend(post, index)}
                                nombresPj={this.props.nombresPj}
                                cambiosAvatar={this.props.cambiosAvatar}
                                cambioNombre={(idPj, nombre) => this.props.cambioNombre(idPj, nombre)}
                                subida={(avatar, idPj) => this.props.subida(avatar, idPj)}


                              />

                            </div>

                            :
                            <div>

                              <NuevoPost

                                editor={this.state.editor}
                                sistema={this.props.partida.idSistema}
                                escena={this.state.escena}
                                partida={this.props.partida}
                                pjsescribir={this.props.pjsescribir}
                                destinatarios={this.state.destinatarios}
                                avdestinatarios={this.state.avdestinatarios}
                                texto={i.texto}
                                editar={true}
                                idEditar={i.id}
                                tirada={i.tiradas}
                                nombre={i.nPersonaje}
                                muestra={i.avPersonaje}
                                autor={i.idPersonaje}
                                destinatariospost={i.destinatarios}
                                notas={i.notas}
                                onEnviar={post => this.onEditarSend(post, index)}
                                nombresPj={this.props.nombresPj}
                                cambiosAvatar={this.props.cambiosAvatar}
                              />
                              <button onClick={idPost => this.cancelEditPost(idPost)}>Cancelar</button>

                            </div>


                          }


                        </div>
                      </li>
                    )}

                  </ul>
                </div>}



              {this.state.posts.length > 0 && <div className="pagination">
                <div className="arrow-left">
                  {this.state.pagina > 2 ? <span onClick={() => { this.onClickUno() }}>1</span> : null}
                  {this.state.pagina > 1 ? <span onClick={() => { this.onClickMenos() }}>Pag-</span> : null}
                </div>
                <div className="center">
                  <span className="active"><b>{this.state.pagina}</b></span>
                </div>

                <div className="arrow-right">
                  {this.state.pagina < this.state.maxpaginas ? <span onClick={() => { this.onClickMas() }}>Pag+</span> : null}
                  {this.state.pagina < this.state.maxpaginas - 1 ? <span onClick={() => { this.onClickMax() }}>{this.state.maxpaginas}</span> : null}
                </div>
              </div>}


              <div >





              </div>

              {this.state.showNuevoPost ?
                <div>
                  <NuevoPost
                    editor={this.state.editor}
                    sistema={this.props.partida.idSistema}
                    escena={this.state.escena}
                    partida={this.props.partida}
                    pjsescribir={this.props.pjsescribir}
                    destinatarios={this.state.destinatarios}
                    avdestinatarios={this.state.avdestinatarios}
                    texto=""
                    notas=""
                    onEnviar={post => this.onPublicar(post)}
                    nombresPj={this.props.nombresPj}
                    cambiosAvatar={this.props.cambiosAvatar}


                  />
                  <button onClick={e => this.setState({ showNuevoPost: false })}>Cancelar</button>
                </div>
                :
                <p>
                  {this.props.pjsescribir.length > 0 &&
                    <button onClick={e => this.setState({ showNuevoPost: true })}>Añadir mensaje</button>
                  }
                </p>
              }

            </div>

          </div>}
      </div>
    );
  }
}





const useMountEffect = (fun) => useEffect(() => {
  fun();

}, [fun]);

const ScrollDemo = () => {
  const myRef = useRef(null);

  const executeScroll = () => myRef.current.scrollIntoView();

  useMountEffect(executeScroll);

  return (
    <>
      <div ref={myRef} />
    </>
  );
};
