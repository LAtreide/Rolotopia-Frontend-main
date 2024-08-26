import React from 'react';
import "./lock.scss"


export default class Lock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bloqueo: false

        };
    }

    componentDidMount = async e => {
    };

    Bloqueo = () => {
        this.setState({bloqueo: !this.state.bloqueo});
        this.props.cambioDraggable();
    }
    render() {
        return (

<div className="containerLock" onClick={this.Bloqueo}>
<span className={this.state.bloqueo ? "lock unlocked":"lock"}></span>

  
</div>

        )
    }
};

