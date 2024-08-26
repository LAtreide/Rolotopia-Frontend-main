import React from 'react';
import AuthService from '../../services/auth.service';
import ColorPicker from "../Utilidad/ColorPicker";
import grupoService from '../../services/grupo.service';
import Textoeditable from '../Utilidad/Texto editable/textoeditable';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import usuariosService from '../../services/usuarios.service';

export default class Grupos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listaGrupos: [],
      carga: 0,
      jugador: null,
      nuevo: false,
      agregarUsuario: 0,
      color: {
        r: this.props.r ? this.props.r : '115',
        g: this.props.g ? this.props.g : '16',
        b: this.props.b ? this.props.b : '199',
        a: this.props.a ? this.props.a : '1',
      },

    };
  }

  componentDidMount = async e => {
    this.setState({
      listaGrupos: await grupoService.listaGrupos(AuthService.getCurrentUser().id),
      usuarios: await usuariosService.listaUsuarios(),
      nuevo: false,
      nombreNuevo: "",
    })

    if (this.state.listaGrupos.length === 0) {
      let nuevoGrupo = { nombre: "Usuarios que sigo", r: 0, g: 0, b: 0, a: 1, protegido: 1 };
      await grupoService.guardarGrupo(nuevoGrupo.nombre, AuthService.getCurrentUser().id, nuevoGrupo.r, nuevoGrupo.g, nuevoGrupo.b, nuevoGrupo.a, nuevoGrupo.protegido);
      this.setState({
        listaGrupos: await grupoService.listaGrupos(AuthService.getCurrentUser().id),
      })

    }

    this.setState({carga:1})
  }

  setValue = (value) => this.setState({ jugador: value });

  cerrar() {
    this.setState({
      nuevo: false,
      nombreNuevo: "",
    })
  }

  async guardarGrupo() {
    let cambio=true;
    for (let i=0; i<this.state.listaGrupos.length;i++){
      if(this.state.listaGrupos[i].nombre === this.state.nombreNuevo && this.state.listaGrupos[i].protegido === 1)
        cambio=false;
    }

    if (cambio) {
      await grupoService.guardarGrupo(this.state.nombreNuevo, AuthService.getCurrentUser().id, this.state.color.r, this.state.color.g, this.state.color.b, this.state.color.a,0);
      this.setState({
        nuevo: false,
        nombreNuevo: "",

      })
    }
  }
  async cambioNombre(id, nombre) {
    let cambio=true;
    for (let i=0; i<this.state.listaGrupos.length;i++){
      if(this.state.listaGrupos[i].nombre === this.state.nombreNuevo && this.state.listaGrupos[i].protegido === 1)
        cambio=false;
    }
  
    if (cambio) {
      await grupoService.actualizarNombre(id, nombre);
      this.setState({ listaGrupos: await grupoService.listaGrupos(AuthService.getCurrentUser().id) });
    }
  }


  cambioColor(id, color) {
    grupoService.actualizarColor(id, color.r, color.g, color.b, color.a);

  }

  async addUsuario(id) {
    await grupoService.addUsuario(id, this.state.jugador);
    this.setState({
      agregarUsuario: 0,
      listaGrupos: await grupoService.listaGrupos(AuthService.getCurrentUser().id)
    })

  }


  async delUsuario(id, jugador) {
    await grupoService.delUsuario(id, jugador);
    this.setState({
      listaGrupos: await grupoService.listaGrupos(AuthService.getCurrentUser().id)
    })

  }

  async delGrupo(id) {
    await grupoService.delGrupo(id);
    this.setState({
      listaGrupos: await grupoService.listaGrupos(AuthService.getCurrentUser().id)
    })

  }



  render() {
    return (
      <div style={{ textAlign: 'center' }} className="container mt-3">

        {this.state.nuevo === false && <input type="submit" onClick={() => this.setState({ nuevo: true })} style={{ margin: '5px', padding: '5px', backgroundColor: 'black', color: 'white' }} value="Nuevo grupo" />}
        {this.state.nuevo === true &&
          <span style={{ display: '-webkit-inline-box' }}>
            <span>Nombre</span>
            <input type="text" value={this.state.nombreNuevo} onChange={e => this.setState({ nombreNuevo: e.target.value })} style={{ color: 'rgba(' + this.state.color.r + ', ' + this.state.color.g + ', ' + this.state.color.b + ', ' + this.state.color.a + ')' }} />
            <input type="submit" onClick={() => this.cerrar()} style={{ margin: '5px', padding: '5px', backgroundColor: 'white' }} value="Cancelar" />
            <input type="submit" onClick={() => this.guardarGrupo()} style={{ margin: '5px', padding: '5px', backgroundColor: 'white' }} value="Guardar" />
            <ColorPicker color={(c) => this.setState({ color: c })} />


          </span>

        }
        {this.state.carga === 1 &&

          <ul>


            {this.state.listaGrupos.map((i) =>


              <li key={i.id} >
                <div>
                  <div style={{ display: 'inline-flex' }}>
                    <ColorPicker r={i.r} g={i.g} b={i.b} a={i.a} color={(c) => this.cambioColor(i.id, c)} />
                    
                    {i.protegido ? <span>{i.nombre}</span> : <Textoeditable valor={i.nombre} onCambio={(v) => this.cambioNombre(i.id, v)} />}

                    {i.id !== this.state.agregarUsuario &&
                      <span style={{ marginLeft: "5px", cursor: "pointer" }} onClick={() => this.setState({ agregarUsuario: i.id })}>+</span>}
                    {i.id === this.state.agregarUsuario &&
                      <span style={{ marginLeft: "5px", cursor: "pointer" }} onClick={() => this.setState({ agregarUsuario: 0 })}>-</span>
                    }
                    {i.protegido !== 1 &&
                      <button type="submit" style={{ marginLeft: '10px' }} onClick={() => this.delGrupo(i.id)}><span style={{ marginLeft: '1em', marginRight: '1em' }}>X</span></button>
                    }
                  </div>
                  {i.id === this.state.agregarUsuario &&
                    <div style={{ display: 'flex' }}>
                      <Autocomplete
                        value={this.state.jugador}
                        onChange={(event, newValue) => { this.setValue(newValue); }}
                        options={this.state.usuarios}
                        getOptionLabel={(option) => option}
                        style={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Añadir usuario" variant="outlined" />}
                      />
                      <button type="submit" onClick={() => this.addUsuario(i.id)}>Añadir</button>
                    </div>
                  }

                  <ul>

                    {i.usuarios.map((j, index) =>
                      <li key={index} style={{ display: 'flex' }}>
                        <p>{j}</p>
                        <button type="submit" style={{ marginLeft: '10px' }} onClick={() => this.delUsuario(i.id, j)}>Eliminar</button>

                      </li>
                    )}

                  </ul>
                </div>
              </li>
            )}
          </ul>
        }
      </div >
    )
  }
};

