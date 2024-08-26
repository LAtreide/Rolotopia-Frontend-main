import React from 'react';
import PersonajeService from '../../../../services/personaje.service';
import ReactHtmlParser from 'react-html-parser';
import Crop from "../../../Upload/crop.component";
import AuthService from '../../../../services/auth.service';
import AvatarPersonaje from '../../../Utilidad/AvatarPersonaje/avatarPersonaje';

export default class Personajes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personaje: this.props.personaje ? this.props.personaje : 0,
            carga: null,
            pestana: null,
            director: 0,
          

        };
    }





    componentDidMount = async e => {
        this.setState({
            info: await PersonajeService.infoCompletaId(idPersonaje, AuthService.getCurrentUser().id),
        })
        if (this.state.info.pestanas.length > 0) {
            this.setState({ pestana: 0 })
        }
        this.setState({
            propietario: await PersonajeService.isPropietario(this.state.info.id, AuthService.getCurrentUser().id),
            personaje: idPersonaje
        })
        this.setState({carga: 1})

    };


    subida(e,idPj){
        let a=this.state.info;
        let b=this.state.lista;
        a.avatar=e;
        for(var i=0;i<b.length;i++){
            if(b[i].id===idPj) b[i].avatar=e;
        }
        this.setState({
            info:a,
            lista: b
        })
        

    }

    render() {
        return (
            <div style={{ padding: "20px" }}>
   
                {this.state.carga &&
                    <div>
                        <h2>Personajes</h2>
                        <div style={{ display: "inline" }}>
                            <AvatarPersonaje src={"https://rolotopia-im.ams3.digitaloceanspaces.com/avatarPj/" + this.state.info.avatar} width="120px" alt="" /> <span>{this.state.info.nombre}</span>
                            {this.state.propietario > 0 &&
                                <Crop ancho={204} alto={324} destino="avatarPj" texto="Cambiar imagen" id={this.state.info.id} subida={(e)=>{this.subida(e,this.state.personaje)}}/>
                            }
                        </div>
                        {this.state.info.pestanas.length > 0 &&

                            <div>
                                <ul style={{ border: "1px solid red", paddingTop: "1em", paddingLeft: "1em" }}>
                                    {this.state.info.pestanas.map((i, index) =>
                                        <li key={i.titulo} style={{ display: "inline" }}>

                                            <span
                                                onClick={() => this.setState({ pestana: index })}
                                                style={{
                                                    borderTop: "2px solid red",
                                                    borderLeft: "2px solid red",
                                                    borderRight: "1px solid red",
                                                    top: "1px",
                                                    padding: "2px",
                                                    backgroundColor: "orange",
                                                    borderBottom: this.state.pestana === index ? "none" : "1px solid red",
                                                    marginRight: "2px"
                                                }}>
                                                {i.titulo}
                                            </span>


                                        </li>)
                                    }
                                </ul>

                                <div>

                                    {ReactHtmlParser(this.state.info.pestanas[this.state.pestana].info)}
                                    <p>Esta pestaña es
                                        {this.state.info.pestanas[this.state.pestana].publica ? " pública, " : " privada, "}
                                        {this.state.info.pestanas[this.state.pestana].editable ? "editable, " : "no editable "}
                                        {this.state.info.pestanas[this.state.pestana].secreta ? " secreta. " : null}
                                    </p>
                                </div>
                            </div>
                        }
                        <button onClick={() => this.setState({ personaje: 0 })}>Volver</button>
                    </div>}

            </div>
        )
    }
};
