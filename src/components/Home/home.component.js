import React, { Component } from "react";


import { Parallax } from "react-parallax";
import logo from '../../logo.png';
import "../../css/ContactoHome.css"

import { useRef } from "react";
import { useEffect } from "react";
import "../../css/Cuadros.scss"
import formularioService from "../../services/formulario.service";
import { SPACE_URL } from "../../constantes";


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      scrolled: false,
      scroll: 0,
      nombre: "",
      email: "",
      consulta: "",
      enviado: false,
    };
  }

  setScrolled = (v) => {
    this.setState({ scrolled: v });
  }

  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }


  handleScroll = e => {
    if (window.scrollY > 100) {
      this.setScrolled(true);
    }
    else {
      this.setScrolled(false);
    }
  }

  async scroll(n) {
    await this.setState({ scroll: n });
  }

  enviarFormulario() {

    if (this.state.nombre !== "" && this.state.email !== "" && this.state.consulta !== "" && this.ValidateEmail(this.state.email)) {
      this.setState({
        nombre: "",
        email: "",
        consulta: "",
        enviado: true,
      })
      formularioService.enviarFormulario(this.state.nombre, this.state.email, this.state.consulta);
    }

  }

  ValidateEmail(mail) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    return (false)
  }

  render() {


    return (


      <div>

        <div>

          {this.state.scrolled &&
            <header className="navbarp" style={{ position: "fixed", zIndex: "100", top: "0", height: "5vh", minHeight: "5vh" }}>
              <div className="logo">

                {this.props.director ? <button className="nav-item" onClick={adCaja => this.addCaja('Configuracion')}>Configuracion</button> : null}

              </div>

              <nav className="navigation">
              <ul style={{marginTop:"12px"}}>
                  <li><button className="nav-item" onClick={() => this.scroll(1)}>Inicio</button></li>
                  <li><button className="nav-item" onClick={() => this.scroll(2)}>¿Quiénes somos?</button></li>
                  <li><button className="nav-item" onClick={() => this.scroll(3)}>¿Qué es Rol By Post?</button></li>
                  <li><button className="nav-item" onClick={() => this.scroll(4)}>¿Tienes dudas?</button></li>

                </ul>
              </nav>

            </header>


          }

          <header className="navbarp" style={{ height: "5vh", minHeight: "5vh" }}>
            <div className="logo">

              {this.props.director ? <button className="nav-item" onClick={adCaja => this.addCaja('Configuracion')}>Configuracion</button> : null}

            </div>

            <nav className="navigation">
              <ul style={{marginTop:"12px"}}>
                <li><button className="nav-item" onClick={() => this.scroll(1)}>Inicio</button></li>
                <li><button className="nav-item" onClick={() => this.scroll(2)}>¿Qué es Rolotopía?</button></li>
                <li><button className="nav-item" onClick={() => this.scroll(3)}>¿Quiénes somos?</button></li>
                <li><button className="nav-item" onClick={() => this.scroll(4)}>¿Tienes dudas?</button></li>

              </ul>
            </nav>

          </header>




        </div>

        <div style={{ textAlign: 'center' }}>
          {this.state.scroll === 1 && <ScrollDemo />}

          <Parallax bgImage={SPACE_URL + "/fondo%2FFondo1.jpg"} strength={500} style={{ minHeight: "100vh" }}>
            <img src={logo} className="App-logo" style={{ height: '40vmin', marginTop: "65px" }} alt="logo" />
            <div className="container box" style={{ textAlign: 'center' }}>
              <header className=" box-inner " >
                <h3>Te damos la bienvenida a Rolotopía.</h3>
              </header>

            </div>

          </Parallax>
          {this.state.scroll === 2 && <ScrollDemo />}
          <h1 style={{ margin: "40px" }}>¿Quiénes somos?</h1>
          <Parallax bgImage={SPACE_URL + "/fondo%2FFondo2.jpg"} strength={500} style={{ minHeight: "100vh" }}>

            <div className="container box" style={{ marginTop: "20%", }}>
              <header className="box-inner" >
                <h3>¿Quiénes  somos?</h3>
                <p>Somos un grupo de aficionados al rol que hemos decidido crear esta plataforma para jugar, acercarnos los unos a los otros y poder así disfrutar de esta afición que enriquece nuestro ocio con historias increíbles. </p>

              </header>

            </div>
          </Parallax>
          {this.state.scroll === 3 && <ScrollDemo />}
          <h1 style={{ margin: "40px" }}>¿Qué es Rol By Post?</h1>
          <Parallax bgImage={SPACE_URL + "/fondo%2FFondo3.jpg"} strength={500} style={{ minHeight: "100vh" }}>
            <div className="container box" style={{ marginTop: "20%", }}>
              <header className="box-inner" >
                <h3>¿Qué es Rol By Post?</h3>
                <p>Si has llegado hasta aquí seguramente sepas o tengas una idea de lo que es el rol. Esta que presentamos aquí es una de las muchas formas de jugar al rol, con sus propias virtudes. Jugar es realmente sencillo, pues solo se necesita que te encante leer y escribir. Es una forma diferente a otras más tradicionales,  que permite ahondar con mucha más facilidad en los motivos y sentimientos de los protagonistas, lo que puede llegar a hacerlos mucho más especiales. También permite preparar cada uno de los post con mucho más detalle, pues se tiene más tiempo para hacerlo.  </p>

                <p>El funcionamiento es muy sencillo y, al igual que en otros sistemas, solemos tener la figura de un narrador, una directora o master que prepara la trama y muestra el mundo y sus habitantes a los otros jugadores, que interpretaran a los personajes protagonistas. Todo esto se consigue intercalando posts a un ritmo determinado al iniciar la partida y con el tiempo la historia terminará cobrando una profundidad y una belleza que nos hará querer u odiar a cada uno de esos personajes que han aparecido.  </p>
              </header>
            </div>
          </Parallax>
          {this.state.scroll === 4 && <ScrollDemo />}
          <h1 style={{ margin: "40px" }}>¿Tienes dudas?</h1>
          <Parallax bgImage={SPACE_URL + "/fondo%2FFondo4.jpg"} strength={500} style={{ minHeight: "100vh" }}>
            <div className="container box" style={{ marginTop: "20%", }}>
              <header className="box-inner" >
                <h3>Formulario de contacto</h3>
                <div className="page">
                  <div className="field field_v1">
                    <label htmlFor="first-name" className="ha-screen-reader">Nombre</label>
                    <input id="first-name" className="field__input" placeholder="Introduce tu nombre" onChange={(e) => this.setState({ nombre: e.target.value })} />
                    <span className="field__label-wrap" aria-hidden="true">
                      <span className="field__label">Nombre</span>
                    </span>
                  </div>
                  <div className="field field_v2">
                    <label htmlFor="last-name" className="ha-screen-reader">Email</label>
                    <input id="last-name" className="field__input" placeholder="Introduce tu correo electrónico" onChange={(e) => this.setState({ email: e.target.value })} />
                    <span className="field__label-wrap" aria-hidden="true">
                      <span className="field__label">Contacto</span>
                    </span>
                  </div>
                  <div className="field field_v3">
                    <label htmlFor="consulta" className="ha-screen-reader">Consulta</label>
                    <span id="consulta" className="field__input" role="textbox" contentEditable style={{ overflow: "hidden", height: "10em", textAlign: "left" }} onInput={e => this.setState({ consulta: e.currentTarget.textContent })}></span>
                    <span className="field__label-wrap" aria-hidden="true">
                      <span className="field__label">Consulta</span>
                    </span>
                  </div>
                </div>
                <div className="linktr">
                  {this.state.enviado ?
                    <p>Formulario enviado</p> :
                    this.ValidateEmail(this.state.email) && this.state.nombre !== "" && this.state.consulta !== "" ?
                      <div className="linktr__goal r-link" onClick={() => this.enviarFormulario()}>Enviar</div> :
                      <div className="linktr__goal r-link" onClick={(e) => e.preventDefault()} style={{ opacity: '50%', cursor: 'not-allowed' }}>Enviar</div>
                  }
                </div>
              </header>
            </div>
          </Parallax>


        </div>
      </div>
    );
  }
}



const useMountEffect = fun => useEffect(fun, []);

const ScrollDemo = () => {
  const myRef = useRef(null);

  const executeScroll = () => myRef.current.scrollIntoView({ behavior: 'smooth' });

  useMountEffect(executeScroll); // Scroll on mount

  return (
    <>
      {/* React.Fragment*/}
      <div ref={myRef} />
      {/* Scroll on click */}
    </>
  );
};

