
import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

class colorPicker extends React.Component {
  
  constructor(props) {
    super(props);

    

    this.state = {
    displayColorPicker: false,
    color: {
      r: this.props.r ? this.props.r : '115',
      g: this.props.g ? this.props.g : '16',
      b: this.props.b ? this.props.b : '199',
      a: this.props.a ? this.props.a : '1',
      rgba: this.props.rgba ? this.props.rgba : "",
    },
  };
  }
  
 async componentDidMount() {
if(this.props.rgba && this.props.rgba !== "") {
  
    // Remueve el símbolo '#' del inicio del color hexadecimal
    let hex = this.props.rgba.replace("#", "");
  
    // Extrae los componentes de color
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
  
    // Convierte los valores de los componentes a la escala de 0 a 1

     this.setState({
      color: {r: r ,
      g:  g,
      b:  b,
      a: 1}
    })

}
  
  }

    handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
    this.props.color(this.state.color)
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
    this.props.color(this.state.color)
  };

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
          position: "relative",
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div style={{position: "relative"}}>
        
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } disableAlpha={!this.props.opacidad}/>
        </div> : null }

      </div>
    )
  }
}

export default colorPicker