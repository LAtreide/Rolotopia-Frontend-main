import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../services/auth.service";
import Crop from "../Upload/crop.component"
import Grupos from "../Grupos";
import UserConfiguration from "../Usuarios/UserConfiguration";
import { SPACE_URL } from "../../constantes";
import AvatarUsuario from "../Utilidad/AvatarUsuario/avatarUsuario";
import TimeLine from "../TimeLine/timeLine";
import "../../css/Perfil.css"
import MisPosts from "../Usuarios/MisPosts/misPosts";
import MisPersonajes from "../Usuarios/MisPersonajes/misPersonajes";
import ListaPartida from "../Partidas/listaPartida.component";
import Novedades from "../Paneles/escritorio.component";
import MiBlog from "../Blog/Miblog";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      avatar: AuthService.getCurrentUser().avatar,
      editarGrupos: false,
      editConfiguracion: false,
      showAvatar: true,

    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    else this.setState({ currentUser: currentUser, userReady: true })

    document.getElementById("novedades").className += " active";



  }

  subida(e) {
    this.setState({ avatar: e })
    this.setState({ showAvatar: false })
    this.setState({ showAvatar: true })
  }


  openTab(evt, tabName) {
  
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].className = tabcontent[i].className.replace(" active", "");
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).className += " active";
    evt.currentTarget.className += " active";

  }


  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
          <div>
        
         
            <header className="jumbotron">
              <h3>
                <strong>Perfil de usuario: {currentUser.username}</strong>
              </h3>
              {this.state.showAvatar &&
                <AvatarUsuario src={SPACE_URL + "/avatarUser/" + this.state.avatar} width="200px" alt="" />
              }
              <Crop ancho={300} alto={300} destino="avatar" texto="Cambiar avatar" subida={(e) => this.subida(e)} key={1} />
              
            </header>

          </div> : null}

        <div className="tab">
          <button className="tablinks active" onClick={(event) => this.openTab(event, 'novedades')}>Novedades</button>
          <button className="tablinks" onClick={(event) => this.openTab(event, 'partidas')}>Mis partidas</button>
          <button className="tablinks" onClick={(event) => this.openTab(event, 'personajes')}>Mis personajes</button>
          <button className="tablinks" onClick={(event) => this.openTab(event, 'posts')}>Mis posts</button>
          <button className="tablinks" onClick={(event) => this.openTab(event, 'timeline')}>Mi timeline</button>
          <button className="tablinks" onClick={(event) => this.openTab(event, 'blog')}>Mi blog</button>
          <button className="tablinks" onClick={(event) => this.openTab(event, 'configuracion')}>Configuración</button>
          <button className="tablinks" onClick={(event) => this.openTab(event, 'grupos')}>Grupos de usuarios</button>

        
        </div>

        <div id="novedades" className="tabcontent">
          <h3>Novedades</h3>
          <p>Contenido de la sección de novedades.</p>
              <Novedades/>
        </div>

        <div id="partidas" className="tabcontent">
          <h3>Mis partidas</h3>
          <p>Contenido de la sección de mis partidas.</p>
          <ListaPartida/>
        </div>

        <div id="personajes" className="tabcontent">
          <h3>Mis personajes</h3>
          <p>Contenido de la sección de mis personajes.</p>
          <MisPersonajes />
        </div>

        <div id="posts" className="tabcontent">
          <h3>Mis posts</h3>
          <p>Contenido de la sección de mis posts.</p>
          <MisPosts/>
        </div>

        <div id="blog" className="tabcontent">
          <h3>Mi blog</h3>
          <p>Contenido de la sección de mi blog.</p>
          <MiBlog/>
        </div>

        <div id="timeline" className="tabcontent">
          <h3>Mi timeline</h3>
          <p>Contenido de la sección de mi timeline.</p>
          <TimeLine  usuario={AuthService.getCurrentUser().id}/>
        </div>
        

        <div id="configuracion" className="tabcontent">
          <h3>Configuración de usuario</h3>
          <UserConfiguration/>
        </div>

        <div id="grupos" className="tabcontent">
          <h3>Grupos de usuario</h3>
          <Grupos/>
        </div>  

        
      </div>
    );
  }
}


