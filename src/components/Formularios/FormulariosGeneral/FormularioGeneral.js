import React from 'react';
import FormularioMensaje from '../FormularioMensaje/FormularioMensaje';
import formularioService from '../../../services/formulario.service';


export default class FormularioGeneral extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listaFormularios: [],
      carga: 0,
      filtrar: false
    };
  }

  async componentDidMount() {

    this.setState({
      listaFormulariosCompleta: await formularioService.listaFormularios(),

    })
    this.setState({
      listaFormularios: this.state.listaFormulariosCompleta,
      carga: 1,
    })

  }

  atender(index){
    
    let a = [...this.state.listaFormulariosCompleta];
    a[index].atendida === 1 ? a[index].atendida=0 : a[index].atendida=1;
    this.setState({listaFormulariosCompleta: a})
    if(!this.state.filtrar) this.setState({listaFormularios: this.state.listaFormulariosCompleta})
    else {
      for (let i = this.state.listaFormulariosCompleta.length - 1; i >= 0; i--) {
        if (a[i].atendida===1) a.splice(i, 1);
      }
      this.setState({ listaFormularios: a })

    }
  }

  async filtrarAtendidos() {
    await this.setState({ filtrar: !this.state.filtrar })

    if (this.state.filtrar) {
      let a = [...this.state.listaFormulariosCompleta];
      for (let i = this.state.listaFormulariosCompleta.length - 1; i >= 0; i--) {
        if (a[i].atendida===1) a.splice(i, 1);
      }
      this.setState({ listaFormularios: a })
    }
    else{this.setState({ listaFormularios: this.state.listaFormulariosCompleta })}
    
  }



  render() {
    return (

      <div>
        {this.state.carga === 1 ?


          <div>
            <h1>Formularios de contacto</h1>
            <button onClick={(e) => this.filtrarAtendidos(e)} >{this.state.filtrar ? "No filtrar" : "Filtrar por no atendidos"}</button>

            {this.state.listaFormularios.map((i,index) =>

              <li key={i.id}>

                <FormularioMensaje formulario={i} atender={()=>this.atender(index)}/>

              </li>)
            }
{this.state.listaFormularios.length === 0 ? <p>No hay formularios que mostrar</p> : null
}
          </div> : null}
      </div>


    )
  }
}

