import React from 'react';
import { Rnd } from 'react-rnd';
import CloseButton from './CloseButton';
import Lock from './Lock';
import Personajes from './Personajes';
import Jugadores from './Jugadores';
import Marcadores from './Marcadores';
import Configuracion from './Configuracion';
import GeneradorRecuento from './GeneradorRecuento';

export default class Ventana extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activa: true,
            ancho: 250,
            alto: 250,
            fixed: true,
            noDraggable: true


        };
    }

    delCaja = () => {
        this.props.delCaja(this.props.caja.indice);
        this.setState({ activa: false });
    }

    redCaja = (indice, ancho, alto) => {
        this.props.redCaja(this.props.caja.indice, ancho, alto);
        this.setState({
            ancho: ancho,
            alto: alto,

        });

    }

    cambioFixed = () => {

        this.setState({ fixed: !this.state.fixed });
    }

    cambioDraggable = () => {

        this.setState({ noDraggable: !this.state.noDraggable });
    }

    componentDidMount = () => {

        if (this.props.caja.ancho) {
            this.setState({ ancho: this.props.caja.ancho })
        }
        if (this.props.caja.alto) {
            this.setState({ alto: this.props.caja.alto })


        }
    }

    
    onCambio=(cambio)=>{
        this.props.onCambio(cambio);
    }

    render() {
        return (
            <div>
                {this.state.activa && (this.props.director || !this.props.seguridad) &&

                    <div >
<p>ASDF</p>
                        <Rnd
                            default={{
                                x: this.props.caja.x ? this.props.caja.x : 50,
                                y: this.props.caja.y ? this.props.caja.y : 50,
                                width: this.props.caja.ancho ? this.props.caja.ancho : 250,
                                height: this.props.caja.alto ? this.props.caja.alto : 250,
                            }}
                            onResize={(e, direction, ref, delta, position) => {
                                this.redCaja(this.props.caja.indice, ref.style.width, ref.style.height);
                            }}

                            style={{ boxSizing: 'border-box', backgroundColor: '#e8c5ea', position: this.state.fixed ? 'fixed' : 'absolute', borderRadius: "10px", zIndex: "10" }}

                            onDragStop={(e, d) => {
                                this.props.mueCaja(this.props.caja.indice, d.x, d.y);
                            }}
                            disableDragging={this.state.noDraggable}
                        >
                            <div style={{
                                overflowY: 'auto', width: this.state.ancho ? this.state.ancho : 250,
                                height: this.state.alto ? this.state.alto : 250, border: '1px solid black',
                                borderRadius: "10px"

                            }}>

                                <div>
                                    <Lock cambioDraggable={this.cambioDraggable} />
                                    <CloseButton onCloseButton={this.delCaja} />

                                </div>

                                {this.props.caja.tipo === 'Personajes' ? <Personajes partida={this.props.partida} director={this.props.director} /> : null}
                                {this.props.caja.tipo === 'Configuracion' ? <Configuracion partida={this.props.partida} onCambio={(cambio)=>this.onCambio(cambio)} /> : null}
                                {this.props.caja.tipo === 'Jugadores' ? <Jugadores partida={this.props.partida} director={this.props.director} /> : null}
                                {this.props.caja.tipo === 'Marcadores' ? <Marcadores partida={this.props.partida} /> : null}
                                {this.props.caja.tipo === 'Recuento' ? <GeneradorRecuento partida={this.props.partida} /> : null}



                                <input
                                    name="fixed"
                                    type="checkbox"
                                    checked={this.state.fixed}
                                    onChange={this.cambioFixed} />

                            </div>


                        </Rnd>
                    </div>
                }
            </div>
        )
    }
};


