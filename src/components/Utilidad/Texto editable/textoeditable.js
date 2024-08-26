import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";





export default class Textoeditable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editar: false,
      valor: this.props.valor

    };
  }



  guardar = async e => {
    this.props.onCambio(this.state.valor);
    this.setState({ editar: false })
    e.preventDefault();

  }

  render() {

    return (
      <div>


        {this.state.editar === false ?
          <div onClick={() => this.setState({ editar: true })}>
            {this.props.valor}

          </div>
          :
          <div>

            <form onClick={this.guardar}>
              <input
                style={{ maxWidth: "80%" }}
                type="text"
                value={this.state.valor}
                onChange={e => this.setState({ valor: e.target.value })}
              />



              <button type="submit">O</button>
            </form>
          </div>}
      </div>
    )
  }
}




