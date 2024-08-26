import React, { Component } from "react";
import { Switch, Route, useParams, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/App.css";
import "./css/Boton.css";
import AuthService from "./services/auth.service";
import Rolotopia from "./components/Rolotopia";
import Login from "./components/Login/login.component";
import Recover from "./components/Login/recover.component";
import Register from "./components/Login/register.component";
import Home from "./components/Home/home.component";
import Profile from "./components/Login/profile.component";
import BoardUser from "./components/Paneles/board-user.component";
import BoardModerator from "./components/Paneles/board-moderator.component";
import BoardAdmin from "./components/Paneles/board-admin.component";
import Buzon from "./components/Mensajes";
import Escritorio from "./components/Paneles/escritorio.component"
import IncidenciasGeneral from "./components/Incidencias/IncidenciasGeneral"
import Navbar from "./components/Navbar/navbar.component";
import MenuPartida from "./components/Partidas/menuPartida.component";
import Usuario from "./components/Usuarios";
import CompartirPost from "./components/Partidas/Posts/CompartirPost.component";
import Footer from "./components/Footer"
import Faq from "./components/Faq";
import ForoGeneral from "./components/Foro/ForoGeneral";
import Blog from "./components/Blog"
import RolByPost from "./components/RolByPost";
import Pruebas from "./components/Pruebas"
import Socket from "./components/Utilidad/Socket"

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      novedades: null,
      clave: Math.random(),
      pruebas: false,

    };
  }

  async componentDidMount() {

    const user = AuthService.getCurrentUser();


    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),


      });
    }

  }

  onLogin() { this.setState({ clave: Math.random() }) }

  render() {


    return (



      <div>
        {this.state.pruebas ? 
        <Pruebas/>
        :
          <div>
            <Socket/>
            <Navbar key={this.state.clave} />

            <div style={{ minHeight: "800px" }}>

              <Switch>
                <Route exact path={["/", "/home"]} component={Home} />
                <Route exact path="/login" render={
                  props => <Login {...props} onLogin={() => this.onLogin()} />} />
                <Route exact path="/rol-by-post" component={RolByPost} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/inicio" component={Rolotopia} />

                <Route exact path="/perfil"> {AuthService.getCurrentUser() ? <Profile /> : <Redirect to="/login" />}</Route>

                <Route exact path="/faq" component={Faq} />
                <Route exact path="/mensajes/enviar" children={<BuzonEnviar />} />
                <Route exact path="/mensajes/enviados" children={<BuzonSalida />} />
                <Route exact path="/mensajes/recibidos" children={<BuzonEntrada />} />
                <Route path="/partidas" component={BoardUser} />
                <Route path="/escritorio" component={Escritorio} />
                <Route exact path="/post/:postid" children={<CompartirPosts />} />
                <Route path="/mod" component={BoardModerator} />
                <Route path="/admin" component={BoardAdmin} />
                <Route exact path="/partida/:partidal/escena/:escenal"> {AuthService.getCurrentUser() ? <Escena /> : <Redirect to="/login" />}</Route>
                <Route exact path="/partida/:partidal"> {AuthService.getCurrentUser() ? <Partida /> : <Redirect to="/login" />}</Route>
                <Route exact path="/usuario/:usuariol" children={<Usuariop />} />
                <Route exact path="/recover/:tokenl" children={<Recoverp />} />
                <Route path="/foros" component={ForoGeneral} />
                <Route path="/incidencias" component={IncidenciasGeneral} />
                <Route exact path="/foro/:seccionl" children={<Seccion />} />
                <Route exact path="/foro/:seccionl/hilo/:hilol" children={<Hilo />} />
                <Route exact path="/blog/:blogl/entrada/:entradal" children={<Entradal />} />
                <Route exact path="/blog/:blogl" children={<Blogl />} />

                {AuthService.getCurrentUser() ? <Redirect to="/escritorio" /> : <Redirect to="/login" />}



              </Switch>

            </div>
            <div>
              <Footer></Footer>
            </div>
          </div>
        }
      </div>


    );
  }
}


function Blogl() {
  let { blogl } = useParams();
  return (
    <div>

      <Blog key={blogl} blog={blogl} />

    </div>
  );

}


function Entradal() {

  let { blogl } = useParams();
  let { entradal } = useParams();

  return (
    <div>

      <Blog blog={blogl} entrada={entradal} ></Blog>

    </div>
  );

}


function Partida() {
  let { partidal } = useParams();
  return (
    <div>

      <MenuPartida key={partidal} partida={partidal} />

    </div>
  );

}
function Escena() {

  let { partidal } = useParams();
  let { escenal } = useParams();

  return (
    <div>
      <MenuPartida partida={partidal} escena={escenal} />
    </div>
  );

}

function Usuariop() {

  let { usuariol } = useParams();

  return (
    <div>
      <Usuario usuario={usuariol} key={usuariol}></Usuario>

    </div>
  );

}

function Recoverp() {

  let { tokenl } = useParams();

  return (
    <div>
      <Recover token={tokenl} />


    </div>
  );
}

function CompartirPosts() {

  let { postid } = useParams();

  return (
    <div>
      <CompartirPost post={postid} />

    </div>
  );
}


function Seccion() {
  let { seccionl } = useParams();
  return (
    <div>

      <ForoGeneral seccion={seccionl} />

    </div>
  );

}



function Hilo() {

  let { seccionl } = useParams();
  let { hilol } = useParams();

  return (
    <div>

      <ForoGeneral seccion={seccionl} hilo={hilol} />

    </div>
  );

}

function BuzonEnviar() {
  return (
    <div>
      <Buzon buzon={0} />
    </div>
  );
}

function BuzonSalida() {
  return (
    <div>
      <Buzon buzon={2} />
    </div>
  );
}
function BuzonEntrada() {
  return (
    <div>
      <Buzon buzon={1} />
    </div>
  );
}

export default App;
