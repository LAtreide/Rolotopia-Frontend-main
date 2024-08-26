import React from "react";
import logo from '../../logo.png';
import "../../css/Footer.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faTwitch } from "@fortawesome/free-brands-svg-icons";
import partidaService from "../../services/partida.service";
import { SPACE_URL } from "../../constantes";

class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            carga: 0,
            partidas: [],
        };
    }

    async componentDidMount() {
        this.setState({
            partidas: await partidaService.ultimasPartidas(15),
        })
        
        this.setState({ carga: 1 })

    }

    render() {
      
        return (
            <footer className="footer--dark footer--left footer">
                <div className="footer-container">
                    <div className="col4 c1">
                        <div className="logo-container">
                            <img src={logo} alt="Logo" className="logo" />
                            <h4>Frase molona</h4>
                        </div>
                    </div>
                    <div className="col4 c2">
                        <h4>Enlaces útiles</h4>
                        <Link to={"/incidencias"} className="nav-link">
                            Incidencias
                        </Link>
                        <Link to={"/faq"} className="nav-link">
                            Preguntas frecuentes
                        </Link>
                        <Link to={"/terminos"} className="nav-link">
                            Términos y condiciones
                        </Link>
                    </div>
                    <div className="col4 c3">
                        <h4>Contacto</h4>
                        <p>Email: contacto@example.com</p>
                    </div>
                    <div className="col4 footer-last-col c4">
                        <h4>Síguenos en redes sociales</h4>
                        <div className="social-icons"> <a href="https://www.twitch.com" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faTwitch} />
                            </a>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                        </div>
                    </div>
                </div>
                {this.state.carga === 1 &&
                    <div className="slider">
                        <h3>Últimas partidas abiertas</h3>
                        <div className="image-thumbnails">
                            {this.state.partidas.map((partida) => (
                                  
                                <Link key={partida.id} to={"/partida/"+partida.enlace}>
                                    <img src={SPACE_URL+"/portada/"+partida.imagen} alt={`Thumbnail ${partida.id}`} onError={(event)=>{event.target.src=SPACE_URL+"/portada/defecto.png"}} />
                                </Link>
                            ))}
                        </div>
                    </div>
                }
            </footer>
        );
    }
}

export default Footer;
