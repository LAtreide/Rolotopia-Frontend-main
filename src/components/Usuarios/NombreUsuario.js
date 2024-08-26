import React from 'react';
import grupoService from '../../services/grupo.service';
import AuthService from '../../services/auth.service';
import { Link } from 'react-router-dom';


export default class NombreUsuario extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      carga: 0
    };
  }

  componentDidMount = async e => {
    this.setState({
      color: await grupoService.colores(AuthService.getCurrentUser().id, this.props.usuario),
      carga: 1
    })


  };

  render() {
    return (
      <>
        {this.state.carga === 1 &&
          <Link to={"/usuario/" + this.props.usuario} className="link">
            <span
              style={{ color: this.state.carga === 1 ? 'rgba(' + parseInt(this.state.color[0]) + ', ' + parseInt(this.state.color[1]) + ', ' + parseInt(this.state.color[2]) + ', ' + this.state.color[3] + ')' : 'black' }}
            >
              {this.props.usuario}
            </span>
          </Link>
        }
      </>
    );
  }


}


