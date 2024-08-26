import React from 'react';

import { Rnd } from 'react-rnd';

import Tirada from "../tirada.component"
import PostService from "../../../../services/posts.service"
import TiradaService from "../../../../services/tirada.service"
import "../../../../css/Destinatarios.css"
import AuthService from "../../../../services/auth.service"
import EditorTexto from '../../../EditorTexto';
import AvatarPersonaje from '../../../Utilidad/AvatarPersonaje/avatarPersonaje';
import { SPACE_URL } from '../../../../constantes';
import confirmacion from '../../../Utilidad/Confirmacion';
import TiradaConstructor from '../tiradaConstructor.component';


export default class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

      editorConfiguration: {
        removePlugins: ['Markdown', 'Title'],
        mediaEmbed: {
          previewsInData: "True",
          removeProviders: ['youtube', 'instagram'],
          extraProviders: [
            {
              name: "Pyoutube",
              url: /^youtu\.be\/([\w-]+)(?:\?t=(\d+))?/,
              html: t => {
                const e = t[1];
                const n = t[2];
                return (
                  '<div style="position: relative;">' +
                  `<iframe src="https://www.youtube.com/embed/${e}${n ? `?start=${n}` : ""}" ` +
                  'style="width: 100%; height: 50px; top: 0; left: 0;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                  "</iframe>" +
                  "</div>"
                )
              }

            },

            {

              name: "Gyoutube",
              url: [/^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)(?:&t=(\d+))?/, /^(?:m\.)?youtube\.com\/v\/([\w-]+)(?:\?t=(\d+))?/, /^youtube\.com\/embed\/([\w-]+)(?:\?start=(\d+))?/, /^youtu\.be\/([\w-]+)(?:\?t=(\d+))?/],
              html: t => {
                const e = t[1]; const n = t[2];
                return (
                  '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                  `<iframe src="https://www.youtube.com/embed/${e}${n ? `?start=${n}` : ""}" ` +
                  'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                  'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                  "</iframe>" +
                  "</div>")
              }
            },


            {

              name: "instagram2",
              url: /^instagram\.com\/p\/([\w-]+)(?:)?/,
              html: t => {
                const e = t[1]
                return (
                  `<iframe src="https://www.instagram.com/p/${e}/embed" width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`

                )
              }
            }
          ]
        },


        toolbar: {
          items: this.props.editor,
          shouldNotGroupWhenFull: true
        },
        table: {
          contentToolbar: [
            'tableColumn', 'tableRow', 'mergeTableCells',
            'tableProperties', 'tableCellProperties'
          ],

          // Configuration of the TableProperties plugin.
          tableProperties: {
            // ...
          },

          // Configuration of the TableCellProperties plugin.
          tableCellProperties: {
            // ...
          }
        },
        image: {
          // Configure the available styles.
          styles: [
            'alignLeft', 'alignCenter', 'alignRight'
          ],
          resizeUnit: "px",

          // Configure the available image resize options.
          resizeOptions: [
            {
              name: 'imageResize:original',
              label: 'Original',
              value: null
            },
            {
              name: 'imageResize:50',
              label: '50%',
              value: '50'
            },
            {
              name: 'imageResize:75',
              label: '75%',
              value: '75'
            }
          ],

          // You need to configure the image toolbar, too, so it shows the new style
          // buttons as well as the resize buttons.
          toolbar: [
            'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
            '|',
            'imageResize',
            '|',
            'imageTextAlternative'
          ]
        }
      },
      carga: false,
      texto: this.props.texto,
      contenido: [],
      autor: 0,
      muestra: "UoIthkBMuqIn.png",
      nombre: "",
      destinatarios: [],
      editar: this.props.editar,
      editar2: this.props.editar,
      insertar: this.props.insertar,
      showNotas: false,
      showTirar: false,
      notas: this.props.notas,
      pjsescribir: this.props.pjsescribir,
      idEditar: this.props.idEditar,
      tirada: this.props.tirada ? this.props.tirada : [],
      escena: null,
      nTirada: 0,
      tiradaProceso: false,
    };

    this.handleChangeAutor = this.handleChangeAutor.bind(this);
    this.handlePublicar = this.handlePublicar.bind(this);
    this.handleChangePost = this.handleChangePost.bind(this);
    this.handleChangeNotas = this.handleChangeNotas.bind(this);
    this.lanzar = this.lanzar.bind(this);

  }




  handleInputChangeB(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async handlePublicar(event) {

    event.preventDefault();

    let arr = event.target;
    let a = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].checked) a.push(parseInt(arr[i].name));
    }
    await this.setState({ destinatariospost: a });
    if (!this.state.editar && !this.state.insertar) {
      this.setState({ contenido: await PostService.crearPost(this.state.escena.id, this.state.autor, this.state.texto, this.state.notas, AuthService.getCurrentUser().id, this.state.destinatariospost) });
    }
    if (this.state.insertar) {
      this.setState({ contenido: await PostService.insertPost(this.props.idInsertar, this.state.escena.id, this.state.autor, this.state.texto, this.state.notas, AuthService.getCurrentUser().id, this.state.destinatariospost) });

    }
    if (this.state.editar) {
      this.setState({ contenido: await PostService.editPost(this.state.idEditar, this.state.escena.id, this.state.autor, this.state.texto, this.state.notas, AuthService.getCurrentUser().id, this.state.destinatariospost) });
    }


    let c = this.state.contenido;
    c.avPersonaje = this.state.muestra;
    c.nPersonaje = this.state.nombre;
    c.tiradas = this.state.tirada;
    c.editable = true;
    this.setState({ contenido: c })

    this.props.onEnviar(this.state.contenido);
    let b = JSON.parse(localStorage.getItem('borradoresPost'));
    delete b[this.props.escena.id];
    localStorage.setItem("borradoresPost", JSON.stringify(b));
  }


  async handleChangePost(texto) {

    let a = localStorage.getItem('borradoresPost') ? JSON.parse(localStorage.getItem('borradoresPost')) : {};
    a[this.props.escena.id] = texto;
    this.setState({
      texto: texto,
    });
    localStorage.setItem("borradoresPost", JSON.stringify(a));

  }

  async handleChangeNotas(notas) {
    this.setState({ notas: notas });
  }

  componentDidMount = async () => {

    if (!this.props.editar) {
      this.setState({
        muestra: this.props.pjsescribir[0].avatar,
        nombre: this.props.pjsescribir[0].nombre,
        autor: this.props.pjsescribir[0].id,
        showNotas: this.props.notas,
        escena: this.props.escena,
        destinatarios: this.props.destinatarios,
        texto: localStorage.getItem('borradoresPost') ?
          (JSON.parse(localStorage.getItem('borradoresPost'))[this.props.escena.id] ?
            (await confirmacion("Tienes un borrador de post en esta escena, ¿quieres recuperarlo?") ?
              JSON.parse(localStorage.getItem('borradoresPost'))[this.props.escena.id] : "") : "") : "",
      });

    }
    else {
      this.setState({

        muestra: this.props.muestra,
        nombre: this.props.nombre,
        autor: this.props.autor,
        destinatarios: this.props.destinatarios,
        escena: this.props.escena,
        texto: localStorage.getItem('borradoresPost') ?
          (JSON.parse(localStorage.getItem('borradoresPost'))[this.props.escena.id] ?
            (await confirmacion("Tienes un borrador de post en esta escena, ¿quieres recuperarlo?") ?
              JSON.parse(localStorage.getItem('borradoresPost'))[this.props.escena.id] : this.props.texto) : this.props.texto) : this.props.texto,
      });

    }

    this.setState({ carga: true })




  }

  async handleChangeAutor(event) {
    await this.setState({ autor: event.target.value });
    for (let a = 0; a < this.props.pjsescribir.length; a++) {
      if (parseInt(this.props.pjsescribir[a].id) === parseInt(this.state.autor)) {
        this.setState({ muestra: this.props.pjsescribir[a].avatar });
        this.setState({ nombre: this.props.pjsescribir[a].nombre });

      }
    }

  }


  async lanzar(panel, resultados) {
    window.onbeforeunload = null;

    let r = []
    let n = [];
    if (resultados.type === "die") {
      for (let i = 0; i < resultados.rolls.length; i++) {
        r.push(resultados.rolls[i].roll)
      }
    }
    else {
      for (let i = 0; i < resultados.dice.length; i++) {
        if (resultados.dice[i].type === "die")
          for (let j = 0; j < resultados.dice[i].rolls.length; j++) {
            r.push(resultados.dice[i].rolls[j].roll)
          }
        else if (resultados.dice[i].type === "number") {
          n.push(resultados.dice[i].value)
        }
      }

    }
    let raux = this.state.nTirada;
    raux.resultado = r;
    let j = JSON.parse(this.state.nTirada.solicitud);
    j["Modificadores"] = n;
    raux.solicitud = JSON.stringify(j)
    this.setState({ nTirada: raux })

    if (this.state.editar) {

      let a = this.state.tirada;
      a.push(await TiradaService.tiradaDefinitiva(this.state.nTirada));
      this.setState({ tirada: a });




    }
    else {
      let t = await TiradaService.tiradaDefinitiva(this.state.nTirada);
      let a = [];
      a.push(t);
      this.setState({
        idEditar: t.idPost,
        editar: true,
        tirada: a

      });



    }
    this.setState({ tiradaProceso: false })
  }
  async lanzarProvisional(panel) {


    this.setState({ tiradaProceso: true })

    if (this.state.editar) {
      let n = await TiradaService.editaTiradaProvisional(this.state.idEditar, panel, AuthService.getCurrentUser().id, this.props.partida.id);
      this.setState({ nTirada: n })

    }
    else {
      let n = await TiradaService.nuevaTiradaProvisional(this.state.escena.id, this.state.autor, AuthService.getCurrentUser().id, JSON.stringify(panel), this.props.partida.id);
      this.setState({ nTirada: n });
    }
  }


  async lanzarBackend(panel) {

    if (this.state.editar) {
      let a = this.state.tirada;

      a.push(await TiradaService.editaTirada(this.state.idEditar, panel, AuthService.getCurrentUser().id, this.props.partida.id));
      this.setState({ tirada: a });

    }
    else {
      let r = await TiradaService.nuevaTirada(this.state.escena.id, this.state.autor, AuthService.getCurrentUser().id, JSON.stringify(panel), this.props.partida.id);
      let a = [];
      a.push(r);
      this.setState({
        idEditar: r.idPost,
        editar: true,
        tirada: a

      });


    }

  }




  render() {
    return (

      <div>
        {this.state.carga && <div className="Post">


          {this.state.showTirar &&

            <div style={{ position: 'absolute' }}>

              <Rnd

                default={{
                  x: 150,
                  y: 250,
                  width: 250,

                }}
                style={{ boxSizing: 'border-box', backgroundColor: this.props.partida.estilo.fondoPost, borderRadius: "10px", zIndex: "10", position: 'relative', padding: "10px" }}
              >
                {this.state.tiradaProceso && <Confirmacion />}
                <Tirada
                  key={this.props.sistema}
                  juego={this.props.sistema}
                  lanzar={(b, resultados) => this.lanzar(b, resultados)}
                  lanzarProvisional={(b) => this.lanzarProvisional(b)}
                  lanzarBackend={(b) => this.lanzarBackend(b)}
                  colorDados={this.props.partida.estilo.colorDados}
                  partida={this.props.partida.id}
                  tiradaProceso={this.state.tiradaProceso}
                />

                <button onClick={e => { if (this.state.tiradaProceso) { e.preventDefault(); return; } this.setState({ showTirar: false }); }}> No tirar</button>


              </Rnd>
            </div>
          }



          <form onSubmit={this.handlePublicar}>

            <select value={this.state.autor} onChange={this.handleChangeAutor}>
              {this.props.pjsescribir.map(i =>
                <option value={i.id} key={i.id}>{this.props.nombresPj[i.id] ? this.props.nombresPj[i.id] : i.nombre}</option>
              )}
            </select>

            <AvatarPersonaje
              key={(this.props.cambiosAvatar[this.state.autor] ? this.props.cambiosAvatar[this.state.autor] : this.state.muestra)}
              src={SPACE_URL + "/avatarPj/" + (this.props.cambiosAvatar[this.state.autor] ? this.props.cambiosAvatar[this.state.autor] : this.state.muestra)}
              width="200px"
              alt="" />
            <p></p>
            {(this.state.destinatarios[0].length > 0 || this.state.destinatarios[1].length > 0) && <ul className="ks-cboxtags">

              {this.state.destinatarios[0].map(i =>
                <li key={i.id}>
                  <input
                    type="checkbox"
                    id={"checkbox" + i.id}
                    name={i.id}
                    value={i.nombre}
                    defaultChecked={!this.state.editar2 || this.props.destinatariospost.includes(i.id)} />
                  <label htmlFor={"checkbox" + i.id}>
                    <AvatarPersonaje
                      key={(this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id] : i.avatar)}
                      src={SPACE_URL + "/avatarPj/" + (this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id] : i.avatar)}
                      width="70px"
                      alt="" />
                    <p>{this.props.nombresPj[i.id] ? this.props.nombresPj[i.id] : i.nombre}</p>
                  </label>
                </li>

              )}
              {this.state.destinatarios[1].map(i =>
                <li key={i.id}>
                  <input
                    type="checkbox"
                    id={"checkbox" + i.id}
                    name={i.id}
                    value={i.nombre}
                    defaultChecked={this.state.editar2 && this.props.destinatariospost.includes(i.id)} />
                  <label htmlFor={"checkbox" + i.id}>
                    <AvatarPersonaje
                      key={(this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id] : i.avatar)}
                      src={SPACE_URL + "/avatarPj/" + (this.props.cambiosAvatar[i.id] ? this.props.cambiosAvatar[i.id] : i.avatar)}
                      width="70px"
                      alt="" />
                    <p>{this.props.nombresPj[i.id] ? this.props.nombresPj[i.id] : i.nombre}</p>


                  </label>
                </li>



              )}
            </ul>
            }

            <div style={{ width: '750px', display: 'inline-block', textAlign: 'left', color: 'black' }}>

              <EditorTexto config={this.state.editorConfiguration} texto={this.state.texto} onCambio={this.handleChangePost} />

              {this.state.showNotas && <div><p>Notas</p><EditorTexto config={this.state.editorConfiguration} texto={this.state.notas} onCambio={this.handleChangeNotas} /></div>}

              <div style={{ display: "inline-flex", width: '750px', justifyContent: "space-between", marginBottom: '5px', translate: "-85px" }}>
                <div>

                  {this.state.showNotas && <button onClick={e => this.setState({ showNotas: false })}>Cerrar notas</button>}
                  {!this.state.showNotas && <button onClick={e => this.setState({ showNotas: true })}>Notas</button>}
                  {!this.state.showTirar && <button onClick={e => this.setState({ showTirar: true })}>Tirar</button>}
                  {this.state.showTirar && !this.state.tiradaProceso && <button onClick={e => this.setState({ showTirar: false })}>No tirar</button>}
                  {this.state.showTirar && this.state.tiradaProceso && <button>No tirar</button>}
                  
                </div>
                {this.state.tiradaProceso ?

                  <input style={{ backgroundColor: 'black', color: 'white', textAlign: 'right', opacity: "50%", cursor: "not-allowed" }} onClick={(e) => e.preventDefault()} value="Publicar" />
                  :
                  <input style={{ backgroundColor: 'black', color: 'white', textAlign: 'right' }} type="submit" value="Publicar" />

                }
              </div>

            </div>

          </form>

          {this.state.tirada.length > 0 &&
            <div className="tiradasPost">
              <p className="tituloTiradas">Tiradas</p>
              <ul className="listaTiradas">
                {this.state.tirada.map(i =>
                  <li key={i.id} className="itemTirada">

                    {TiradaConstructor(i)}
                  </li>
                )}
              </ul>
            </div>
          }

        </div>
        }
      </div>
    )
  }
}


class Confirmacion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount = async () => {

    window.onbeforeunload = function (e) {
      return "Please click 'Stay on this Page' if you did this unintentionally";
    }


  }



  render() {
    return (
      <div></div>
    )


  }

}
