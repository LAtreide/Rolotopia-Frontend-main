import React from 'react';
import partidaService from '../../../../services/partida.service';
import authService from '../../../../services/auth.service';

export default class Marcadores extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            marcadores: null,
            carga: null,

        };
    }
    componentDidMount = async e => {

        this.setState({ carga: 0 })

        this.setState({
            marcadores: await partidaService.getMarcadores(this.props.partida, authService.getCurrentUser().id),

        })

        this.setState({ carga: 1 })
     };


    borrarMarcador(index) {
        partidaService.borrarMarcador(this.props.partida, authService.getCurrentUser().id, this.state.marcadores[1][index])
        let a=this.state.marcadores[0];
        let b=this.state.marcadores[1];
        a.splice(index,1);
        b.splice(index,1);
        let c=[a,b];
        this.setState({marcadores:c})

    }

    render() {
        return (
            <div>
                {this.state.carga &&
                    <div>
                        {this.state.marcadores[0].map((i, index) =>
                            <li key={index} style={{ display: 'inline-block', marginLeft: "15px" }}>
                                <a href={i}>{this.state.marcadores[1][index]}</a>
                                <button type="submit" onClick={() => this.borrarMarcador(index)}>X</button>

                            </li>
                        )}


                    </div>
                }
            </div>
        )
    }
};
