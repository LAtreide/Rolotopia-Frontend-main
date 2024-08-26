import React from 'react'
import { Rnd } from 'react-rnd';
import CloseButton from '../../Partidas/Informacion/CloseButton';
import InfoPersonaje from '../../Partidas/Informacion/InfoPersonaje/InfoPersonaje.component';
import AvatarPersonaje from '../AvatarPersonaje/avatarPersonaje';
import personajeService from '../../../services/personaje.service';

export default class AvatarInfoPj extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mostrar: false,
            personaje: null,
        };
    }


    abrir = async e => {


        if (this.props.personaje) await this.setState({ personaje: this.props.personaje })
        else {
            await this.setState({
                personaje: await personajeService.getIdFromAvatar(this.props.avatar),
          
              });
        
        }
        
        this.setState({ mostrar: true })
        
    }

    cerrar() {

        this.setState({
            mostrar: false,
            ancho: null,
            alto: null
        })
        
    }

    redCaja = (ancho, alto) => {

        this.setState({
            ancho: ancho,
            alto: alto,

        });

    }

    render() {
        return (

            <div style={{display: "inline"}}>
                <div onClick={() => this.abrir2()} style={{display: "inline", cursor: this.state.mostrar ? null : "pointer"}}>

                    <AvatarPersonaje
                        src={this.props.src}
                        width={this.props.width}
                        alt={this.props.alt}
                        style={this.props.style}

                    />
                </div>
                {this.state.mostrar &&
                    <Rnd
                        default={{
                            x: 50,
                            y: 50,
                            width: 550,
                            height: 550,
                        }}
                        onResize={(e, direction, ref, delta, position) => {
                            this.redCaja(ref.style.width, ref.style.height);
                        }}

                        style={{ boxSizing: 'border-box', backgroundColor: '#e8c5ea', position: this.state.fixed ? 'fixed' : 'absolute', borderRadius: "10px", border: '1px solid black', zIndex: "0" }}

                        onDragStop={(e, d) => {

                        }}
                        disableDragging={this.state.noDraggable}
                    >
                        <div style={{
                            overflowY: 'auto', width: this.state.ancho ? this.state.ancho : 550,
                            height: this.state.alto ? this.state.alto : 550, border: '1px solid black',
                            borderRadius: "10px"
                        }}>

                            <div>

                                <CloseButton onCloseButton={() => this.cerrar()} />

                            </div>
                            <InfoPersonaje director={true} personaje={this.state.personaje} />

                        </div>


                    </Rnd>
                }
            </div>



        )
    }
}