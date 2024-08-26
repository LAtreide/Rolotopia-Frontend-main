import React from 'react';
import "./boton.scss"


export default class CloseButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personajes: false,
            lista: [],
            carga: null

        };
    }

    componentDidMount = async e => {
    };

    onCloseButton = () => {
      
        this.props.onCloseButton();
    }

    render() {
        return (


            <div className="close-container" onClick={this.onCloseButton}>
                <div className="leftright"></div>
                <div className="rightleft"></div>

                <label className="closeB closeB-label" >salir</label>
            </div>

        )
    }
};

