import React from "react";
import DiceRoller from "../DiceRoller/diceRoller";
import ColorPicker from "../ColorPicker";


export default class NumeroEditable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colorDados: {
        r: this.props.r ? this.props.r : '115',
        g: this.props.g ? this.props.g : '16',
        b: this.props.b ? this.props.b : '199',
        a: this.props.a ? this.props.a : '1',
      },
      texto: "1d4+1d6+1d12+1d8+1d20+1d10",

    };
  }

  componentDidMount() {
   this.rgbToHex()

  }


  rgbToHex() {
    return ("#" +
      (this.state.colorDados.r.toString(16).length === 1 ? ("0" + this.state.colorDados.r.toString(16)) : this.state.colorDados.r.toString(16)) +
      (this.state.colorDados.g.toString(16).length === 1 ? ("0" + this.state.colorDados.g.toString(16)) : this.state.colorDados.g.toString(16)) +
      (this.state.colorDados.b.toString(16).length === 1 ? ("0" + this.state.colorDados.b.toString(16)) : this.state.colorDados.b.toString(16)));
  }


  render() {

    return (
      <div>

      <input type="text" value={this.state.texto} onChange={(e)=>{this.setState({texto: e.target.value})}}/>
        <ColorPicker color={(c) => this.setState({ colorDados: c })} />
        <DiceRoller tirada={this.state.texto} color={this.rgbToHex(this.state.colorDados)} />
      </div>
    )
  }
}




