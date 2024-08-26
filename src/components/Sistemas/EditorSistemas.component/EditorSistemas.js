import React, { Component } from "react";
import SistemaService from "../../../services/sistema.service";

export default class EditorSistemas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lista: [],
      sistema: '',
      content: "",
      nombre: '',
      descripcion: "",
      portada: "",
      dadoprincipal: 0,
      panel: [],
      enviado: false,
      infoSistema: "",
      carga: false,
      editSistema: false


    };

  }


  handleSubmit = async event => {
    event.preventDefault();

    SistemaService.actualizar(this.state.lista[this.state.sistema].id, this.state.nombre, this.state.descripcion, this.state.portada, this.state.dadoprincipal, JSON.stringify(this.state.panel));
    let a=this.state.lista;
    a[this.state.sistema].nombre=this.state.nombre;
    this.setState({
      enviado: true,
      lista: a,
    });


  }




  abrirEdit = async e => {

    await this.setState({ lista: await SistemaService.lista() });
    
    this.setState({editSistema: true});
    
  };

  onChangeSistema = async e => {
    e.preventDefault();
    
    await this.setState({
      carga: false,
      sistema: e.target.value,
    });
    this.setState({ infoSistema: await SistemaService.info(this.state.lista[this.state.sistema].id) });
    await this.setState({
      nombre: this.state.infoSistema.nombre,
      descripcion: this.state.infoSistema.descripcion,
      portada: this.state.infoSistema.portada,
      dadoprincipal: this.state.infoSistema.dado_principal,
      panel: JSON.parse(this.state.infoSistema.panel),

    });
    this.setState({ carga: true })

  }


  addPanel = () => {
    let a = this.state.panel;
    let b = ["", 1, 0];
    a.push(b);
    this.setState({
      panel: a
    })

  }


  panelChange = (i, n, index) => {
    

    let a = this.state.panel;
    a[index][i] = n;
    this.setState({
      panel: a
    })

  }

  delCampo = async (index) => {
    await this.setState({ carga: false });
    let a = this.state.panel;
    a.splice(index, 1);
    await this.setState({
      panel: a
    })

    this.setState({ carga: true });

  }



  render() {
    return (
      <div>


        <button onClick={e => this.abrirEdit()}> Editar sistema</button>
        {this.state.editSistema ?
          <div>

            <p>Sistema: </p>

            <select onChange={this.onChangeSistema}>
              {this.state.lista.map((sistema,index) => <option value={index} key={sistema.id}>{sistema.nombre}</option>)}
            </select>




            <form onSubmit={this.handleSubmit}>

              <p>Nombre: </p>
              <input
                type="text"
                value={this.state.nombre}
                onChange={e => this.setState({ nombre: e.target.value })}
              />
              <p>Descripción: </p>
              <input
                type="text"
                value={this.state.descripcion}
                onChange={e => this.setState({ descripcion: e.target.value })}
              />


              <p>Portada: </p>
              <input
                type="text"
                value={this.state.portada}
                onChange={e => this.setState({ portada: e.target.value })}
              />

              <p>Dado principal: </p>
              <select value={this.state.dadoprincipal} onChange={e => this.setState({ dadoprincipal: e.target.value })}>
                <option value="2">D2</option> caras
                <option value="4">D4</option>
                <option value="6">D6</option>
                <option value="8">D8</option>
                <option value="10">D10</option>
                <option value="12">D12</option>
                <option value="20">D20</option>
                <option value="100">D100</option>

              </select>
              <p></p>

              <button onClick={this.addPanel}> Nuevo campo</button>

              {this.state.carga && this.state.panel.map((i, index) =>

                <li key={this.state.infoSistema.nombre + " " + index} style={{ listStyleType: 'none' }}>

                  <Bloque index={index} panelChange={this.panelChange} nombre={i[0]} tipo={i[1]} defecto={i[2]} delCampo={this.delCampo} />
                </li>
              )}

              <p></p>
              <input type="submit" value="Modificar" />
            </form>

            <button onClick={e => this.setState({ editSistema: false })}> Cancelar</button>

          </div>
          : null}
      </div>


    );
  }
}



class Bloque extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.nombre,
      tipo: this.props.tipo,
      defecto: this.props.defecto,
      checked: this.props.defecto,
      mostrar: true
    };

    this.panelChange1 = this.panelChange1.bind(this);
  }



  panelChange1 = async (e) => {

    await this.setState({
      value: e.target.value
    })
    this.props.panelChange(0, this.state.value, this.props.index);
  }


  panelChange2 = async (e) => {


    await this.setState({
      tipo: e.target.value,
      defecto: e.target.value === 1 ? 0 : e.target.value === 2 ? false : ""
    })

    this.props.panelChange(1, this.state.tipo, this.props.index);
  }


  panelChange3 = async (e) => {

    if (this.state.tipo === '2') {
      await this.setState({ checked: e.target.checked });
      this.props.panelChange(2, this.state.checked, this.props.index);

    }
    else {
      await this.setState({ defecto: e.target.value })


      this.props.panelChange(2, this.state.defecto, this.props.index);
    }
  }


  delCampo = () => {

    this.setState({
      mostrar: false
    })
    this.props.delCampo(this.props.index);

  }

  render() {
    return (

      <div>

        <label>
          
          <input
            name="Nombre"
            type="text"
            value={this.state.value}
            onChange={e => this.panelChange1(e)} />

          <span> </span>
          <select value={this.state.tipo} onChange={e => this.panelChange2(e)}>
          <option value={0}>Numérico (cualquier valor)</option>
            <option value={1}>Numérico (sólo positivos)</option>
            <option value={2}>Checkbox</option>
            <option value={3}>Texto</option>
          </select>
          <span> </span>

          {this.state.tipo === '0' ?
            <input
              name={this.props.nombre}
              type="number"
              value={this.state.defecto}
              onChange={e => this.panelChange3(e)} />
            : null}

          {this.state.tipo === '1' ?
            <input
              name={this.props.nombre}
              type="number"
              value={this.state.defecto}
              onChange={e => this.panelChange3(e)} />
            : null}

          {this.state.tipo === '2' ?
            <input
              name={this.props.nombre}
              type="checkbox"

              checked={this.state.checked}
              onChange={e => this.panelChange3(e)} />
            : null}
          {this.state.tipo === '3' ?
            <input
              name={this.props.nombre}
              type="number"

              value={this.state.defecto}
              onChange={e => this.panelChange3(e)} />
            : null}
          <span> </span>
          <button onClick={this.delCampo}> <span>Eliminar</span></button>


        </label>

      </div>

    );
  }
}