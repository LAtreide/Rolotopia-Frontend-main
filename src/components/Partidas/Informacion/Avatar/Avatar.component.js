import React from 'react';
import InfoPj from '../InfoPj';


export default class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: false,
            carga: false


        };
    }




    componentDidMount = () => {
        this.setState({carga: true})
        
 }



    render() {
        return (
            <div>
                {this.state.carga &&
                <img src={require("../../../../public/uploads/avatar/" + this.props.imagen)} width={this.props.ancho+"px"} alt="" onClick={this.setState({info:true})}/>
    }
    
                {this.state.info &&
                <InfoPj/>
                }
            </div>
        )
    }
};
