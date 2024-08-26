import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import partidaService from '../../../../services/partida.service';


export default class GeneradorRecuento extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carga: 0,
            resultado: "",
        
        };
    }

    componentDidMount = async e => {

        this.setState({
            resultado: await partidaService.solicitarRecuento(this.props.partida)
        })

        await this.setState({
            carga: 1,
        })

        this.messagesEnd.scrollIntoView({ behavior: "smooth" });

        this.setState({ resultado: this.state.resultado + await partidaService.crearRecuento(this.props.partida) })

        this.messagesEnd.scrollIntoView({ behavior: "smooth" });




    };










    render() {
        return (
            <div>

                <h1>Recuento de participación</h1>
                {this.state.carga === 0 ?
                    <h2>Cargando...</h2>    
:null}
                {this.state.carga === 1 ?
                    <div>

                        {ReactHtmlParser(this.state.resultado)}
                        <div style={{ float: "left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>

                    </div>

                    : null}
            </div>
        )
    }
};

