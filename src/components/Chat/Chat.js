import React, { createRef } from 'react';
import '../../css/Chat.css';
import 'react-chat-widget/lib/styles.css';
import usuariosService from '../../services/usuarios.service';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { SPACE_URL } from '../../constantes';
import chatService from '../../services/chat.service';
import authService from "../../services/auth.service"
import { faDiceD20, faPlusCircle, faMinusCircle, faUsers, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import partidaService from '../../services/partida.service';
import grupoService from '../../services/grupo.service';
import rgbToHex from "../Utilidad/ColorPicker/rgb";
import { Link } from "react-router-dom";
import AvatarUsuario from '../Utilidad/AvatarUsuario/avatarUsuario';
import NombreUsuario from '../Usuarios/NombreUsuario';
import { Rnd } from 'react-rnd';
import confirm from "../Utilidad/Confirmacion"
import ColorPicker from "../Utilidad/ColorPicker";
import { InView } from 'react-intersection-observer';
import launcher from "./assets/launcher_button.svg"
import cerrar from "./assets/clear-button.svg"
import send from "./assets/send_button.svg"
import smiley from "./assets/icon-smiley.svg"
import EmojiPicker from 'emoji-picker-react';


export default class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      activeChat: 0,
      chats: [],
      color: [6, 46, 51, 1],
      enlace: "",
      configurarGrupo: 0,
      colorGrupo: "",
      carga: 0,
      lanzado: false,
      message: "",
      elegirEmoji: false,
      numNovedades: 0
    };
    this.customComponentRef = React.createRef();
    this.autoScrollRef = React.createRef();
    this.textAreaRef = React.createRef();
  }


  async componentDidMount() {

    this.setState({ chats: await chatService.listaChats(authService.getCurrentUser().id) })
    this.setState({ numNovedades: this.calcularNovedades() })
    this.establecerColor(0)
    this.establecerEnlace();

    if (this.state.chats.length > 0) this.setState({ messages: await chatService.getMensajes(authService.getCurrentUser().id, this.state.chats[this.state.activeChat].idChat, this.state.chats[this.state.activeChat].tipo) });


    this.setState({ carga: 1 })

  }


  async establecerColor(chat) {

    if (document.querySelector('.rcw-header')) document.querySelector('.rcw-header').classList.add('transition-enabled');
    if (this.state.chats.length > 0 && this.state.chats[chat].tipo === "usuario") {
      let n = await grupoService.nombreGrupo(authService.getCurrentUser().id, this.state.chats[chat].nombreChat)
      if (n !== "") {
        let c = await grupoService.colores(authService.getCurrentUser().id, this.state.chats[chat].nombreChat);
        document.querySelector(':root').style.setProperty('--color-chat-transition', rgbToHex(c))
      }

      else { document.querySelector(':root').style.setProperty('--color-chat-transition', rgbToHex(this.state.color)) }
    }
    else if (this.state.chats.length > 0 && this.state.chats[chat].tipo === "partida") {

      let n = await partidaService.infoPartidaId(this.state.chats[chat].idChat);
      if (n.estilo.fondoPost !== "rgba(255,255,255,1)") document.querySelector(':root').style.setProperty('--color-chat-transition', n.estilo.fondoPost)
      else document.querySelector(':root').style.setProperty('--color-chat-transition', rgbToHex(this.state.color))
    }
    else if (this.state.chats.length > 0 && this.state.chats[chat].tipo === "grupo") {

      this.setState({ colorGrupo: await chatService.getColorGrupo(this.state.chats[chat].idChat) })
      document.querySelector(':root').style.setProperty('--color-chat-transition', this.state.colorGrupo)
    }
    else {
      document.querySelector(':root').style.setProperty('--color-chat-transition', rgbToHex(this.state.color))

    }
  }

  async handleChangeChat(chat) {
    if (this.state.chats.length > 0) {
      let a = this.state.chats;
      a[chat].numNovedades = 0;

      await this.setState({ activeChat: chat, chats: a, configurarGrupo: 0, messages: [] });
      this.establecerColor(this.state.activeChat);
      this.establecerEnlace();
      this.setState({ messages: await chatService.getMensajes(authService.getCurrentUser().id, this.state.chats[this.state.activeChat].idChat, this.state.chats[this.state.activeChat].tipo) });
      this.setState({ numNovedades: this.calcularNovedades() })
      this.handleScroll();

    }
  }



  handleNewUserMessage = async () => {


    await chatService.guardarMensaje(
      authService.getCurrentUser().id,
      this.state.chats[this.state.activeChat].idChat,
      this.state.chats[this.state.activeChat].tipo,
      this.state.message
    );

    this.setState({ message: '' }); // Borra el campo de texto 
    if (this.state.activeChat !== 0) {
      let a = this.state.chats;
      a.unshift(a[this.state.activeChat]);
      a.splice(this.state.activeChat + 1, 1);
      await this.setState({ chats: a, activeChat: 0 })
      this.customComponentRef.current.actualizar(this.state.activeChat, this.state.chats);
    }
  };









  loadPreviousMessages = async () => {

    const messagesContainer = document.querySelector('.rcw-messages-container');
    if (messagesContainer && this.state.chats.length > 0 && this.state.messages.length > 9 && this.state.chats[this.state.activeChat].inicial !== this.state.messages[0].id) {

      let a = await chatService.getMensajesAnteriores(authService.getCurrentUser().id, this.state.chats[this.state.activeChat].idChat, this.state.chats[this.state.activeChat].tipo, this.state.messages[0].id);

      this.setState(({ messages: [...a, ...this.state.messages] }));

    }
  }

  async nuevoChatUsuario(usuario) {


    let info = await usuariosService.infoUsuario(usuario)
    await this.setState({
      chats: [{ nombreChat: usuario, avatar: info.avatar, tipo: "usuario", idChat: info.id }, ...this.state.chats],
      activeChat: 0
    })
    this.setState({ messages: [] });
    this.establecerColor(this.state.activeChat);
    this.establecerEnlace();
    this.customComponentRef.current.actualizar(this.state.activeChat, this.state.chats);

  }

  async nuevoChatPartida(partida) {


    await this.setState({
      chats: [{ nombreChat: partida.nombre, avatar: partida.imagen, tipo: "partida", idChat: partida.id }, ...this.state.chats],
      activeChat: 0
    })

    this.setState({ messages: [] });
    this.establecerEnlace();

    this.customComponentRef.current.actualizar(this.state.activeChat, this.state.chats);

  }

  async nuevoChatGrupo(grupo) {

    let c = await chatService.nuevoGrupo(authService.getCurrentUser().id, grupo)
    await this.setState({
      chats: [c, ...this.state.chats],
      activeChat: 0
    })
    this.setState({ messages: [] });
    this.establecerColor(0);


    this.customComponentRef.current.actualizar(this.state.activeChat, this.state.chats);

  }



  async mensajeRecibido(mensaje) {

    if ((mensaje.tipoChat === this.state.chats[this.state.activeChat].tipo && mensaje.idChat === this.state.chats[this.state.activeChat].idChat) || (mensaje.tipoChat === "usuario"  && mensaje.remitente===this.state.chats[this.state.activeChat].idChat)) {
      mensaje.hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      mensaje.fecha = new Date().toLocaleDateString('es-ES');
      this.setState({ messages: [...this.state.messages, mensaje] });

      if (this.autoScrollRef.current) {
        this.autoScrollRef.current.mensajeRecibido();
      }
    }


    else {
      let index = -1;
      for (let i = 0; i < this.state.chats.length; i++) {

        if (mensaje.tipoChat === this.state.chats[i].tipo && mensaje.remitente === this.state.chats[i].idChat) {
          let a = this.state.chats;
          a[i].numNovedades++;
          if (i !== 0) {
            a.unshift(a[i]);
            a.splice(i + 1, 1);
            if (i < this.state.activeChat) await this.setState({ chats: a })
            else await this.setState({ chats: a, activeChat: this.state.activeChat + 1 })
          }

          index = i;
          if (this.customComponentRef.current)
            this.customComponentRef.current.actualizar(this.state.activeChat, this.state.chats);
          this.setState({ numNovedades: this.calcularNovedades() })
        }
      }
      if (index === -1) {


        let a = this.state.chats;
        let info = await usuariosService.infoUsuarioId(mensaje.remitente);
        a.unshift({ nombreChat: info.nombre, avatar: info.avatar, tipo: "usuario", idChat: mensaje.remitente, numNovedades: 1 });
        await this.setState({ chats: a, activeChat: this.state.activeChat + 1 })
        this.customComponentRef.current.actualizar(this.state.activeChat, this.state.chats);
        this.setState({ numNovedades: this.calcularNovedades() })



      }

    }


  }

  calcularNovedades() {
    let n = 0;
    for (let i = 0; i < this.state.chats.length; i++) {
      n += this.state.chats[i].numNovedades;
    }
    return n;
  }


  cerrarChat = (abierto) => {
    if (!abierto) {
      this.setState({ numNovedades: this.calcularNovedades() })
      this.setState({ configurarGrupo: 0 })
    }
    this.handleChangeChat(0)

  };

  async establecerEnlace() {
    if (this.state.chats.length > 0)
      if (this.state.chats[this.state.activeChat].tipo === "usuario") this.setState({ enlace: "/usuario/" + this.state.chats[this.state.activeChat].nombreChat })
      else if (this.state.chats[this.state.activeChat].tipo === "partida") {
        let n = await partidaService.infoPartidaId(this.state.chats[this.state.activeChat].idChat);
        this.setState({ enlace: "/partida/" + n.enlace })
      }
      else this.setState({ enlace: "" });
  }


  cambiarColor(color) {

    this.setState({ colorGrupo: color })
    document.querySelector(':root').style.setProperty('--color-chat-transition', color)
    chatService.cambiarColorGrupo(this.state.chats[this.state.activeChat].idChat, color)

  }


  cambiarAdmin(usuario, administrador) {

    chatService.cambiarAdmin(this.state.chats[this.state.activeChat].idChat, usuario, administrador)

  }

  handleScroll = () => {
    this.autoScrollRef.current.scrollToBottom();
  };

  handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Evita el salto de línea

      this.handleNewUserMessage();
    }
  }
  onEmojiClick = (event, emojiObject) => {
    const textarea = this.textAreaRef.current;
    const { selectionStart, selectionEnd } = textarea;
    const emoji = event.emoji;

    // Obtener el texto actual y dividirlo en partes antes y después del cursor
    const currentText = this.state.message;
    const beforeText = currentText.slice(0, selectionStart);
    const afterText = currentText.slice(selectionEnd);

    // Insertar el emoji en la posición del cursor
    const newText = beforeText + emoji + afterText;

    // Actualizar el estado con el nuevo texto
    this.setState({ message: newText, elegirEmoji: false }, () => {
      // Restaurar la posición del cursor después de insertar el emoji
      const newCursorPos = selectionStart + emoji.length;

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
        textarea.focus();
      }, 0);
    });


  };


  render() {


    return (
      <div>

        <div className="chat-container">
          <div className="chat-widget">
            <div className="chat-widget-container">
              <div className="chat-messages-container">
                <div className="chat-content-container">
                  <div className="rcw-conversation-container">
                    <div className={this.state.lanzado ? "rcw-widget-container" : "rcw-widget-container rcw-close-widget-container "}>



                      {this.state.lanzado &&
                        <div id="rcw-conversation-container" className="rcw-conversation-container active" aria-live="polite">
                          <div className="rcw-header transition-enabled">
                            <button className="rcw-close-button">
                              <img src={cerrar} className="rcw-close" alt="close" />
                            </button>
                            <h4 className="rcw-title">
                              {this.state.chats.activeChat !== null && this.state.chats.length > 0 && this.state.enlace !== "" ?
                                <Link to={this.state.enlace} >
                                  {this.state.chats[this.state.activeChat].nombreChat}
                                </Link>
                                :
                                this.state.chats.activeChat !== null && this.state.chats.length > 0 && this.state.chats[this.state.activeChat].tipo === "grupo" ?
                                  <div onClick={() => this.setState({ configurarGrupo: this.state.chats[this.state.activeChat].idChat })}>
                                    {this.state.chats[this.state.activeChat].nombreChat}
                                  </div>
                                  :
                                  "Chat inactivo"}
                            </h4>

                          </div>
                          <ListaChats
                            activeChat={this.state.activeChat}
                            nuevoChatUsuario={(usuario) => { this.nuevoChatUsuario(usuario) }}
                            nuevoChatPartida={(partida) => { this.nuevoChatPartida(partida) }}
                            nuevoChatGrupo={(grupo) => { this.nuevoChatGrupo(grupo) }}
                            chats={this.state.chats}
                            handleChangeChat={(chat) => { this.handleChangeChat(chat) }}
                            ref={this.customComponentRef}
                          />


                          <ListaMensajes tipo={this.state.chats[this.state.activeChat].tipo} mensajes={this.state.messages} ref={this.autoScrollRef} juegoScroll={() => this.loadPreviousMessages()} />


                          {this.state.elegirEmoji && <EmojiPicker style={{ position: "absolute", zIndex: "inherit", bottom: "0", left: "50px" }} onEmojiClick={this.onEmojiClick} previewConfig={{ defaultCaption: "Elige un emoji" }} />}

                          <div className="rcw-sender">
                            <button className="rcw-picker-btn" type="submit" onClick={() => { this.setState({ elegirEmoji: !this.state.elegirEmoji }) }}>
                              <img src={smiley} className="rcw-picker-icon" alt="" />
                            </button>
                            <div className="rcw-new-message">
                              <textarea
                                ref={this.textAreaRef}
                                value={this.state.message}
                                className="rcw-input"
                                onChange={(e) => { this.setState({ message: e.target.value }) }}
                                onKeyDown={(e) => this.handleKeyDown(e)}
                                placeholder="Escribe un mensaje..."
                              />
                            </div><button type="submit" className="rcw-send" onClick={() => this.handleNewUserMessage()}>
                              <img src={send} className="rcw-send-icon" alt="Send" />
                            </button>
                          </div>
                        </div>
                      }
                      <button type="button" className="rcw-launcher" aria-controls="rcw-chat-container" onClick={() => this.setState({ lanzado: !this.state.lanzado })}>
                        {this.state.lanzado ?
                          <img src={cerrar} className="rcw-close-launcher" alt="Close chat" />
                          :
                          <>
                            {this.state.numNovedades > 0 && <span className="rcw-badge">{this.state.numNovedades}</span>}
                            <img src={launcher} className="rcw-open-launcher" alt="Open chat" />
                          </>
                        }




                      </button>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.configurarGrupo > 0 &&
          <ConfiguracionGrupoChat
            idChat={this.state.chats[this.state.activeChat].idChat}
            cerrar={() => this.setState({ configurarGrupo: 0 })}
            color={this.state.colorGrupo}
            avatar={this.state.chats[this.state.activeChat].avatar}
            nombre={this.state.chats[this.state.activeChat].nombreChat}
            cambiarColor={(color) => this.cambiarColor(color)}
            cambiarAdmin={(usuario, administrador) => { this.cambiarAdmin(usuario, administrador) }}
          />
        }
      </div>
    );
  }
}



class ListaChats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      usuarios: [],
      partidas: [],
      chats: [],
      jugador: null,
      partida: null,
      grupo: "",
      nuevoUsuario: false,
      nuevaPartida: false,
      nuevoGrupo: false,
      activeChat: this.props.activeChat
    };
  }



  async componentDidMount() {
    this.setState({
      chats: this.props.chats,
    })
    this.setState({ carga: 1 })
  }

  actualizar(activeChat, chats) {
    this.setState({ activeChat: activeChat, chats: chats })
  }

  changeChat(index) {
    let a = this.state.chats;
    a[index].numNovedades = 0;
    this.setState({ activeChat: index, chats: a });
    this.props.handleChangeChat(index)

  }

  async cargaUsuarios() {
    this.setState({ usuarios: await usuariosService.listaUsuarios() })
    this.setState({ nuevoUsuario: !this.state.nuevoUsuario })
  }

  async cargaPartidas() {
    let a = await partidaService.lista(authService.getCurrentUser().id);
    this.setState({ partidas: a[0].concat(a[1]) })
    this.setState({ nuevaPartida: !this.state.nuevaPartida })

  }

  nuevoGrupo() {
    this.setState({ nuevoGrupo: !this.state.nuevoGrupo })
  }

  render() {
    return (
      <div className={`custom-component-container ${this.state.nuevoUsuario || this.state.nuevaPartida || this.state.nuevoGrupo ? 'expanded' : ''}`}>
        <div className="chat-user-buttons">
          <div style={{ display: "inline-flex" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                {!this.state.nuevaPartida && !this.state.nuevoGrupo &&
                  <button>
                    <FontAwesomeIcon icon={faTelegram} onClick={() => this.cargaUsuarios()} />
                  </button>
                }
                {!this.state.nuevoUsuario && !this.state.nuevoGrupo &&
                  <button>
                    <FontAwesomeIcon icon={faDiceD20} onClick={() => this.cargaPartidas()} />
                  </button>
                }
              </div>
              {!this.state.nuevoUsuario && !this.state.nuevaPartida &&
                <button>
                  <FontAwesomeIcon icon={faUsers} onClick={() => this.nuevoGrupo()} />
                </button>
              }
            </div>
            {this.state.carga === 1 &&
              <div>
                {this.state.nuevoUsuario &&
                  <div style={{ display: "inline-flex" }}>
                    <Autocomplete
                      value={this.state.jugador}
                      onChange={(event, newValue) => { this.setState({ jugador: newValue }); }}
                      options={this.state.usuarios}
                      getOptionLabel={(option) => option}
                      style={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Buscar usuario" variant="outlined" />}
                    />
                    {this.state.jugador &&
                      <button>
                        <FontAwesomeIcon icon={faTelegram} onClick={() => {


                          let index = -1;
                          for (let i = 0; i < this.state.chats.length; i++) {
                            if (this.state.chats[i].nombreChat === this.state.jugador) {
                              this.setState({ activeChat: i })
                              this.props.handleChangeChat(i)
                              this.setState({ nuevoUsuario: false, jugador: null })
                              index = i;
                            }
                          }
                          if (index === -1) {
                            this.props.nuevoChatUsuario(this.state.jugador);
                            this.setState({ activeChat: 0 })
                            this.setState({ nuevoUsuario: false, jugador: null })

                          }



                        }} />
                      </button>
                    }
                  </div>
                }

                {this.state.nuevaPartida &&
                  <div style={{ display: "inline-flex" }}>
                    <Autocomplete
                      value={this.state.partida}
                      onChange={(event, newValue) => { this.setState({ partida: newValue }) }}

                      options={this.state.partidas}
                      getOptionLabel={(option) => option.nombre}
                      style={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} label="Buscar partida" variant="outlined" />}
                    />
                    {this.state.partida &&
                      <button>
                        <FontAwesomeIcon icon={faDiceD20} onClick={() => {


                          let index = -1;
                          for (let i = 0; i < this.state.chats.length; i++) {
                            if (this.state.chats[i].nombreChat === this.state.jugador) {
                              this.setState({ activeChat: i })
                              this.props.handleChangeChat(i)
                              this.setState({ nuevaPartida: false, partida: null })
                              index = i;
                            }
                          }
                          if (index === -1) {
                            this.props.nuevoChatPartida(this.state.partida);
                            this.setState({ activeChat: 0 })
                            this.setState({ nuevaPartida: false, partida: null })

                          }

                        }} />
                      </button>
                    }
                  </div>
                }
                {this.state.nuevoGrupo &&
                  <div style={{ display: "inline-flex" }}>
                    <TextField
                      
                      label="Nombre del grupo"
                      value={this.state.grupo}
                      onChange={(event) => { this.setState({ grupo: event.target.value }) }}
                      variant="outlined"
                      margin="none"
                    />
                    {this.state.grupo !== "" &&
                      <button>
                        <FontAwesomeIcon icon={faUsers} onClick={() => {

                          this.props.nuevoChatGrupo(this.state.grupo);
                          this.setState({ activeChat: 0 })
                          this.setState({ nuevoGrupo: false, grupo: "" })



                        }} />
                      </button>
                    }
                  </div>
                }
              </div>
            }

          </div>

          {!this.state.nuevoGrupo && !this.state.nuevaPartida && !this.state.nuevoUsuario &&
          this.state.chats.map((i, index) =>
            <button
              onClick={() => { index !== this.state.activeChat && this.changeChat(index); }}
              className={this.state.activeChat === index ? 'active' : ''}
              key={i.nombreChat}
            >


              <div>
                {i.tipo === "usuario" && <img src={SPACE_URL + "/avatarUser/" + i.avatar} width="30px" alt="" style={{ borderRadius: "100%" }} />}
                {i.tipo === "partida" && <img src={SPACE_URL + "/portada/" + i.avatar} width="30px" alt="" style={{ borderRadius: "100%" }} />}
                {i.tipo === "grupo" && <img src={SPACE_URL + "/portada/" + i.avatar} width="30px" alt="" style={{ borderRadius: "100%" }} />}
                {this.state.nuevoUsuario || this.state.nuevaPartida ? <span style={{ marginLeft: "5px" }}>{i.nombreChat}</span> : null}
                {i.numNovedades > 0 ? <span className="custom-novedades"> {i.numNovedades} </span> : null}
              </div>
            </button>

          )}



        </div>

      </div>
    );
  }
}




class ConfiguracionGrupoChat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listaMiembros: [],
      usuarios: [],
      administrador: false,
      agregarUsuario: false,
      jugador: "",
      rgbacolor: this.props.color,
    };
  }



  async componentDidMount() {
    this.setState({
      listaMiembros: await chatService.listaMiembros(this.props.idChat),
      administrador: await chatService.isAdministrador(authService.getCurrentUser().id, this.props.idChat)
    }
    )
  }

  async quitarUsuario(usuario) {
    if (await confirm('¿Estás seguro de que quieres expulsar a este usuario?')) {

      let a = this.state.listaMiembros;

      delete a[usuario];
      this.setState({ listaMiembros: a })
    }
  }

  async cargaUsuarios() {
    if (!this.state.agregarUsuario) this.setState({ usuarios: await usuariosService.listaUsuarios() })
    this.setState({ agregarUsuario: !this.state.agregarUsuario })

  }

  async agregarUsuario() {

    if (!(this.state.jugador in this.state.listaMiembros)) {
      let a = this.state.listaMiembros;
      a[this.state.jugador] = false
      this.setState({ listaMiembros: a })
      chatService.agregarUsuarioGrupoChat(this.state.jugador, this.props.idChat)
    }
  }

  cambiarColor(color) {
    this.setState({ rgbacolor: color })
    this.props.cambiarColor(color)

  }


  async cambiarAdmin(usuario) {
    let a = this.state.listaMiembros;
    a[usuario] = !a[usuario];
    await this.setState({ listaMiembros: a })
    this.props.cambiarAdmin(usuario, this.state.listaMiembros[usuario] ? 1 : 0)



  }


  render() {
    return (
      <Rnd
        default={{
          x: 150 + window.scrollX || window.pageXOffset,
          y: 150 + window.scrollY || window.pageYOffset,
          width: 500,
          height: 500,
        }}

        style={{
          boxSizing: 'border-box',
          backgroundColor: "white",
          position: 'fixed',
          borderRadius: "10px",
          zIndex: "10",
          border: "1px solid black",
          cursor: "arrow",


        }}

      >
        <div style={{ display: "flex", flexDirection: "column", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}>
          <div style={{ backgroundColor: this.state.rgbacolor, borderTopLeftRadius: "10px", borderTopRightRadius: "10px", textAlign: "center", padding: "5px", position: "relative", color: "white" }}>
            <h2>Información</h2>
            <img src={SPACE_URL + "/portada/" + this.props.avatar} width="100px" alt="" style={{ borderRadius: "100%" }} />
            <h3>{this.props.nombre}</h3>
            {this.state.administrador &&
              <div style={{ position: "absolute", bottom: "0", left: "0", textAlign: "left" }}>
                <ColorPicker rgba={this.state.rgbacolor} color={(c) => this.cambiarColor(rgbToHex([c.r, c.g, c.b]))} />
              </div>
            }
          </div>


          <div style={{ padding: "10px" }}>
            <button
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                padding: '5px',
                backgroundColor: "transparent",
                color: 'white',
                border: 'none',
                cursor: 'pointer',

              }}
              onClick={() => { this.props.cerrar() }}
            >
              <FontAwesomeIcon icon={faWindowClose} />
            </button>
            <button onClick={() => this.cargaUsuarios()}><FontAwesomeIcon icon={this.state.agregarUsuario ? faMinusCircle : faPlusCircle} /></button>
            {this.state.agregarUsuario &&
              <div style={{ display: "flex" }}>
                <Autocomplete
                  value={this.state.jugador}
                  onChange={(event, newValue) => { this.setState({ jugador: newValue }); }}
                  options={this.state.usuarios}
                  getOptionLabel={(option) => option}
                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Buscar usuario" variant="outlined" />}
                />
                <button onClick={() => this.agregarUsuario()}><FontAwesomeIcon icon={faPlusCircle} /></button>
              </div>}
            {Object.keys(this.state.listaMiembros).map((usuario) => (
              <div key={usuario} style={{ display: "flex" }}>
                {usuario} {this.state.listaMiembros[usuario] ? "- Administrador" : ""}
                {usuario === authService.getCurrentUser().username ? <span onClick={() => { this.quitarUsuario(usuario) }}> Abandonar el grupo </span>
                  :
                  this.state.administrador && usuario !== authService.getCurrentUser().username && !this.state.listaMiembros[usuario] ? <div><span onClick={() => { this.quitarUsuario(usuario) }}> Eliminar del grupo </span><span onClick={() => { this.cambiarAdmin(usuario) }}> Hacer administrador </span></div>
                    :
                    this.state.administrador && usuario !== authService.getCurrentUser().username && this.state.listaMiembros[usuario] ? <div><span onClick={() => { this.cambiarAdmin(usuario) }}> Retirar administración </span></div>
                      :
                      ""}


              </div>
            ))}
          </div>
        </div>
      </Rnd>
    );
  }
}




class ListaMensajes extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      abajo: true,
    };
    this.endOfMessagesRef = createRef();
    this.itemsRef = [];
  }



  async componentDidMount() {
    this.endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto' });

  }


  scrollToBottom = () => {
    this.endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  setItemRef = (el, index) => {
    this.itemsRef[index] = el;
  };

  mensajeRecibido() {
    if (this.state.abajo) {
      this.endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }

  loadPreviousMessages = async () => {
    const cantidad = this.props.mensajes.length;
    await this.props.juegoScroll();
    const index = this.props.mensajes.length - cantidad;
    if (this.itemsRef[index]) {
      this.itemsRef[index].scrollIntoView({ behavior: 'auto' });
    }

  };

  render() {
    return (
      <div id="messages" className="rcw-messages-container" style={{ overflow: "auto" }}>
        <div>



          <InView
            as="div"
            onChange={(inView, entry) => {
              if (inView) {
                this.loadPreviousMessages();
              }
            }}
          >

          </InView>



        </div>
        {this.props.mensajes.map((i, index) =>

          <div className="rcw-message" key={i.id} ref={(el) => this.setItemRef(el, index)}>

            {i.remitente === 0 ?
              <div className="rcw-info" style={{ alignContent: "center" }}>
                <span>{i.mensaje} </span>
              </div>
              :
              i.remitente === authService.getCurrentUser().id ?
                <div className="rcw-client">
                  <div className="rcw-message-text">
                    <p>
                      <span>{i.mensaje}</span>
                      <span className="rcw-timestamp">{i.hora.substring(0, 5)}</span>
                    </p>
                  </div>

                </div>
                :

                (this.props.tipo === "usuario" || (index > 0 && i.remitente === this.props.mensajes[index - 1].remitente)) ?


                  <div className="rcw-response">
                    <div className={i.leido === 1 ? "rcw-message-text leido" : "rcw-message-text noLeido"}>
                      <p>
                        <span>{i.mensaje}</span>
                        <span className="rcw-timestamp">{i.hora.substring(0, 5)}</span>
                      </p>
                    </div>

                  </div>

                  :

                  <div className="rcw-response">

                    <p>
                      <Link to={"/usuario/" + i.nRemitente} >
                        <AvatarUsuario src={SPACE_URL + "/avatarUser/" + i.avRemitente} width="25px" style={{ borderRadius: "50%" }} />
                      </Link>
                      <NombreUsuario usuario={i.nRemitente} />

                    </p>



                    <div className={i.leido === 1 ? "rcw-message-text leido" : "rcw-message-text noLeido"}>
                      <p>
                        <span>{i.mensaje}</span>
                        <span className="rcw-timestamp">{i.hora.substring(0, 5)}</span>
                      </p>
                    </div>

                  </div>

            }

          </div>


        )}

        <InView
          as="div"
          onChange={(inView, entry) => {

            this.setState({ abajo: inView });


          }}
        >

        </InView>


        <div ref={this.endOfMessagesRef} />
        <div className="loader">
          <div className="loader-container"
          ><span className="loader-dots">
            </span><span className="loader-dots">
            </span><span className="loader-dots">
            </span>
          </div>
        </div>
      </div>
    );
  }
}

