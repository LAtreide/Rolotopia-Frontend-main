import React, { Component } from 'react';
import SistemaService from '../../../services/sistema.service'
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import DiceRoller from '../../Utilidad/DiceRoller/diceRoller';
import getTiradaDatos from "../../Utilidad/DiceRoller/getTirada"
import tiradaService from '../../../services/tirada.service';
import authService from '../../../services/auth.service';
import PartidaService from '../../../services/partida.service';
import "../../../css/Tiradas.css"

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        ¡Este campo es necesario!

      </div>
    );
  }
};


const mayorque = (value, input) => {
  if (value < input.min) {
    return (
      <div className="alert alert-danger" role="alert">
        ¡Este campo debe valer más que {input.min}!

      </div>
    );
  }
};



class Numero extends Component {   //Muestra un cuadro de input para introducir el número de dados
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defecto
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    //const name = target.name;

    this.setState({
      value: value,

    });
  }

  render() {
    return (
      <span>
        {this.props.nombre}

        <Input
          name={this.props.nombre}
          type="number"
          value={"" + this.state.value}
          min={this.props.minimo}
          onChange={this.handleInputChange}
          validations={
            this.props.minimo && this.props.requerido === true ? [mayorque, required] :
              !this.props.minimo && this.props.requerido === true ? [required] :
                this.props.minimo && this.props.requerido === false ? [mayorque] :
                  []}
        />

      </span>
    );
  }
}

class Texto extends Component {   //Muestra un cuadro de input para introducir el número de dados
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defecto
    };

    this.handleInputChange = this.handleInputChange.bind(this);

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;

    this.setState({
      value: value
    });
  }

  render() {
    return (
      <label>
        {this.props.nombre}
        <Input
          name={this.props.nombre}
          type="text"
          value={this.state.value}
          onChange={this.handleInputChange}
          validations={this.props.required === true ? [required] : []}
        />

      </label>
    );
  }
}

class Check extends Component {   //Muestra una checkbox en el panel de tirada
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      nombre: "",

    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {

    return (
      <span>
        <span>{this.props.texto}</span>
        <input
          name={this.props.nombre}
          type="checkbox"
          checked={this.state.value}
          onChange={this.handleInputChange} />
      </span>
    );
  }
}


class Panel extends Component {   //Hace la iteración por todos los elementos de un panel de tiradas y los va mostrando


  constructor(props) {
    super(props);
    this.state = {
      carga: false,
      infoSistema: "",
      infoGenerico: "",
      tipo: 1,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValueChange = this.onValueChange.bind(this);

  }

  componentDidMount = async e => {


    this.setState({
      infoSistema: await SistemaService.info(this.props.juego),
      infoGenerico: await SistemaService.info(0),
    });
    this.setState({
      nombre: this.state.infoSistema.nombre,
      panel: JSON.parse(this.state.infoSistema.panel),
      panelGenerico: JSON.parse(this.state.infoGenerico.panel),



    });

    this.setState({ carga: true })

  }


  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onValueChange(event) {
    this.setState({
      tipo: parseInt(event.target.value)
    });
  }

  onResultado(resultados) {

  }


  handleSubmit(event) {
    event.preventDefault();
    this.form.validateAll();
    
    if (this.checkBtn.context._errors.length === 0) {
      let a = {};
      a["Sistema"] = this.props.juego;
      for (let i = 0; i < (event.target).length - 1; i++) {

        if (event.target[i].type === "checkbox") {
          a[event.target[i].name] = event.target[i].checked;
        }
        else if (event.target[i].type === "radio") {
          if (event.target[i].checked)
            a[event.target[i].name] = event.target[i].value;


        }

        else if (event.target[i].type !== "number" && event.target[i].value !== "") {
          a[event.target[i].name] = event.target[i].value;
        }
        else if (event.target[i].type === "number" && event.target[i].value !== "") {
          a[event.target[i].name] = parseInt(event.target[i].value);
        }

      }

      if (this.props.visible && (this.state.tipo !== 3 || this.props.director)) {
        this.props.lanzarProvisional(a, true);
        
        let data = { tirada: getTiradaDatos(a), color: this.props.colorDados, panelLanzar: a, onLanzar: this.props.lanzar, onResultado: this.onResultado }
      
        DiceRoller(data)
      }

      else {
        this.props.lanzarProvisional(a, false);
      }
    }
  }

  render() {

    return (
      <div>
        <br />
        {this.state.carga &&
          <Form
            onSubmit={this.handleSubmit}
            ref={c => {
              this.form = c;
            }}
            id="tiradaForm"
            key={this.props.juego}
          >
            <br />
            <PanelSistema juego={this.props.juego} key={this.props.juego}/>



            <div>
              <label>
                <input
                  type="radio"
                  name="Tipo"
                  value={1}
                  checked={this.state.tipo === 1}
                  onChange={this.onValueChange}
                />
                Pública
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  name="Tipo"
                  value={2}
                  checked={this.state.tipo === 2}
                  onChange={this.onValueChange}
                />
                Privada
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  name="Tipo"
                  value={3}
                  checked={this.state.tipo === 3}
                  onChange={this.onValueChange}
                />
                Oculta
              </label>
            </div>

          <input type="submit" value="Tirar dados" form="tiradaForm" disabled={this.props.tiradaProceso}/>

            
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        }
      </div>
    );
  }
}



class Tirada extends Component {   //Muestra un cuadro de input para introducir el número de dados
  constructor(props) {
    super(props);
    this.state = {
      showSistema: true,
      carga: false,
      infoSistema: "",
      visible: true,
      director: false,

    };

    this.lanzar = this.lanzar.bind(this);
    this.lanzarProvisional = this.lanzarProvisional.bind(this);


  }

  componentDidMount = async e => {

    await this.setState({
      infoSistema: await SistemaService.info(this.props.juego),
      director: await PartidaService.isDirector(this.props.partida, authService.getCurrentUser().id),
      visible: await tiradaService.tiradaVisible(authService.getCurrentUser().id, this.props.partida)
    });
    await this.setState({
      nombre: this.state.infoSistema.nombre,
    });

    this.setState({ carga: true })

  }


  lanzar(panel, resultados) {

    this.props.lanzar(panel, resultados);
  }

  lanzarProvisional(panel, visibilidad) {
    if (visibilidad)
      this.props.lanzarProvisional(panel);
    else {
      this.props.lanzarBackend(panel);
    }
  }
  render() {
    return (
      <div>

        {this.state.carga &&

          <div>
            {this.props.juego !== 0 ?
              <div>
                <button onClick={e => this.setState({ showSistema: true })}>{this.state.nombre}</button>
                <button onClick={e => this.setState({ showSistema: false })}>Tirada Genérica</button>
              </div>
              :
              <p>Tirada Genérica</p>}




            <Panel
              key={this.props.juego}
              juego={this.state.showSistema ? this.props.juego : 0}
              lanzar={(panel, resultados) => this.lanzar(panel, resultados)}
              lanzarProvisional={(panel, visibilidad) => this.lanzarProvisional(panel, visibilidad)}
              colorDados={this.props.colorDados}
              visible={this.state.visible}
              director={this.state.director} 
              tiradaProceso={this.props.tiradaProceso}
              />

          </div>
        }
      </div>
    )
  }
}




class PanelSistema extends Component {   //Hace la iteración por todos los elementos de un panel de tiradas y los va mostrando


  constructor(props) {
    super(props);
    this.state = {
      carga: false,
      infoSistema: "",
    };


  }

  componentDidMount = async e => {


    this.setState({
      infoSistema: await SistemaService.info(this.props.juego),
    });
    this.setState({
      nombre: this.state.infoSistema.nombre,
      panel: JSON.parse(this.state.infoSistema.panel),



    });

    this.setState({ carga: true })

  }


  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  render() {

    const publicar = (nombre, tipo, defecto) => {
      switch (tipo) {
        case 0:
          return (
            <Numero nombre={nombre} defecto={defecto} requerido={true}></Numero>
          );
        case 1:
          return (
            <Numero nombre={nombre} defecto={defecto} minimo={0} requerido={true}></Numero>
          );
        case 2:
          return (
            <Check nombre={nombre}></Check>
          );
        case 3:
          return (
            <Texto nombre={nombre} defecto={defecto}></Texto>
          )

        default:
          return (<div></div>)
      }
    }

    const sistema = (juego) => {

      switch (juego) {

        case 0:
          return (
            <div>
              <Texto nombre="Motivo" required={true}></Texto>
              <PanelGenerico />


            </div>

          )

        case 2:

          return (
            <div>
              <img src="https://www.pngmart.com/files/17/Ankh-Symbol-PNG-Pic.png" width="50px" alt="" />
              <Texto nombre="Motivo" required={true}></Texto>

              <ul style={{ listStyle: 'none', paddingLeft: "0px" }}>


                <li key="Reserva">
                  <Numero nombre={"Reserva"} defecto={0} minimo={1} requerido={false} />

                </li>
                <li key="Dificultad">
                  <Numero nombre={"Dificultad"} defecto={0} minimo={0} requerido={false} />
                </li>

                <li key="Fuerza de voluntad">

                  <Check nombre={"Fuerza de voluntad"} texto={"Fuerza de voluntad"} />

                </li>

                <li key="Especialidad">

                  <Check nombre={"Especialidad"} texto={"Especialidad"} />

                </li>
              </ul>
            </div>
          )

        default:

          return (
            <div>
              <Texto nombre="Motivo" required={true}></Texto>

              {this.state.carga &&
                <ul style={{ listStyle: 'none', paddingLeft: "0px" }}>

                  {this.state.panel.map(i =>

                    <li key={i[0]}>
                      <div>
                        {i.length === 3 && publicar(i[0], parseInt(i[1]), i[2])}

                        {i.length === 2 && publicar(i[0], parseInt(i[1]), "")}
                      </div>

                    </li>
                  )}


                </ul>
              }
            </div>
          )

      }
    }

    return (
      sistema(this.props.juego)
    );
  }
}






export default Tirada;




























class PanelGenerico extends React.Component {
  state = {
    inputValues: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    minValues: [0, 0, 0, 0, 0, 0, 0, 0, null],
    nombres: ["D2", "D4", "D6", "D8", "D10", "D12", "D20", "D100", "Modificador"],
    dadosExplotan: false,
    aplicarModificadorSeparado: false,
    texto: ''
  }

  handleInputChange = async (event, index) => {
    const { target: { value } } = event;
    const { inputValues } = this.state;
    const newInputValues = [...inputValues];
    newInputValues[index] = Number(value);
    await this.setState({ inputValues: newInputValues })
    this.setState({
      texto: (
        (this.state.inputValues[0] !== 0 ? this.state.inputValues[0] + "d2" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[1] !== 0 ? this.state.inputValues[1] + "d4" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[2] !== 0 ? this.state.inputValues[2] + "d6" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[3] !== 0 ? this.state.inputValues[3] + "d8" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[4] !== 0 ? this.state.inputValues[4] + "d10" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[5] !== 0 ? this.state.inputValues[5] + "d12" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[6] !== 0 ? this.state.inputValues[6] + "d20" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[7] !== 0 ? this.state.inputValues[7] + "d100" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[8] !== 0 ? this.state.inputValues[8] + "+" : "")
      ).slice(0, -1)
    })
  }

  handleCheckboxChange = async (event) => {
    const { target: { name, checked } } = event;
    await this.setState({ [name]: checked });
    this.setState({
      texto: (
        (this.state.inputValues[0] !== 0 ? this.state.inputValues[0] + "d2" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[1] !== 0 ? this.state.inputValues[1] + "d4" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[2] !== 0 ? this.state.inputValues[2] + "d6" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[3] !== 0 ? this.state.inputValues[3] + "d8" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[4] !== 0 ? this.state.inputValues[4] + "d10" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[5] !== 0 ? this.state.inputValues[5] + "d12" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[6] !== 0 ? this.state.inputValues[6] + "d20" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[7] !== 0 ? this.state.inputValues[7] + "d100" + (this.state.dadosExplotan ? "!" : "") + "+" : "") +
        (this.state.inputValues[8] !== 0 ? this.state.inputValues[8] + "+" : "")
      ).slice(0, -1)
    })

  }

  handleTextChange = (event) => {
    const { target: { value } } = event;
    this.setState({ texto: value, inputValues: [0, 0, 0, 0, 0, 0, 0, 0, 0] });

  }



  render() {
    const { inputValues, dadosExplotan, aplicarModificadorSeparado } = this.state;


    const dadoImages = [
      { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROuPq7DTU0jOj_Ns6yUpyneWDIJ9n6d4twXA&usqp=CAU', alt: 'D2' },
      { src: 'https://static.thenounproject.com/png/2453696-200.png', alt: 'D4' },
      { src: 'https://cdn-icons-png.flaticon.com/512/2228/2228338.png', alt: 'D6' },
      { src: 'https://static.thenounproject.com/png/2453699-200.png', alt: 'D8' },
      { src: 'https://static.thenounproject.com/png/2453698-200.png', alt: 'D10' },
      { src: 'https://www.seekpng.com/png/full/300-3007396_the-icon-resembles-a-12-sided-dice-shape.png', alt: 'D12' },
      { src: 'https://st3.depositphotos.com/15532916/36405/v/1600/depositphotos_364050312-stock-illustration-vector-sided-game-dice-multi.jpg', alt: 'D20' },
      { src: 'https://rollthedice.online/assets/images/dice/1x1/d100_dice_1x1.png', alt: 'D100' },
      { src: 'https://media.istockphoto.com/id/688550958/es/vector/signo-de-negro-s%C3%ADmbolo-positivo.jpg?s=612x612&w=0&k=20&c=LyVTdpQ0VUUnhYVyY6Emy6CXx96dUOU9O7GXmEN_Vxo=', alt: 'Modificador' },
    ];



    return (
      <div className="dado-container">
        <div className="dado-inputs-container">
          {inputValues.map((value, index) => (
            <div key={index} className="dado-input-container">
              <img src={dadoImages[index].src} alt={dadoImages[index].alt} width="20px" />
              <input type="number" min={this.state.minValues[index]} name={this.state.nombres[index]} value={value} onChange={(event) => this.handleInputChange(event, index)} style={{ width: '35px' }} />
            </div>
          ))}
        </div>
        <div className="dado-text-container">
          <input type="text" name="Escribir" value={this.state.texto} onChange={this.handleTextChange} placeholder="Puedes escrbiir aquí tu tirada" />
        </div>
        <div className="dado-checkbox-container">
          <label className="dado-checkbox-label">
            <input type="checkbox" name="dadosExplotan" checked={dadosExplotan} onChange={this.handleCheckboxChange} />
            Los dados explotan
          </label>
          <label className="dado-checkbox-label">
            <input type="checkbox" name="aplicarModificadorSeparado" checked={aplicarModificadorSeparado} onChange={this.handleCheckboxChange} />
            Aplicar el modificador por separado
          </label>
        </div>


      </div>
    );
  }
}

