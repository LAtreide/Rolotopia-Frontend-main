import React from 'react';
import { Rnd } from 'react-rnd';
import CloseButton from '../CloseButton';



export default class InfoPj extends React.Component {
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
        this.setState({ activa: false });
    }

    redCaja = (ancho, alto) => {
        this.setState({
            ancho: ancho,
            alto: alto,

        });

    }



    componentDidMount = () => {

 }



    render() {
        return (
            <div>
                {this.state.activa &&

                    <div >

                        <Rnd
                            default={{
                                x: 75,
                                y: 100,
                                width: 250,
                                height: 250,
                            }}
                            onResize={(e, direction, ref, delta, position) => {
                                this.redCaja(ref.style.width, ref.style.height);
                            }}

                            style={{ boxSizing: 'border-box', backgroundColor: '#e8c5ea', position: this.state.fixed ? 'fixed' : 'absolute', borderRadius: "10px", zIndex: "10" }}

                            onDragStop={(e, d) => {
                                
                            }}
                            disableDragging={this.state.noDraggable}
                        >
                            <div style={{
                                overflowY: 'auto', width: this.state.ancho ? this.state.ancho : 250,
                                height: this.state.alto ? this.state.alto : 250, border: '1px solid black',
                                borderRadius: "10px"

                            }}>

                                <div>
                                    <CloseButton onCloseButton={this.delCaja} />

                                </div>

                            <h1>ola</h1>

                            </div>


                        </Rnd>
                    </div>
                }
            </div>
        )
    }
};
