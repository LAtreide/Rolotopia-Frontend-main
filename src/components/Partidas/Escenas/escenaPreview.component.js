import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDice } from "@fortawesome/free-solid-svg-icons";
import ReactHtmlParser from 'react-html-parser';
import EditorTextoCompleto from '../../EditorTexto/editorTextoCompleto';
import MenuDestinatarios from './menuDestinatarios';

export default class EscenaPreview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    componentDidMount = async e => {

    }




    render() {
        return (
            <div className="escena" style={{ display: 'block', textAlign: 'left' }}>
                <p onClick={() => this.props.setEscena(this.props.escena.enlace)} style={{ fontWeight: "bold", cursor: "pointer" }}><FontAwesomeIcon icon={faDice} /> {this.props.escena.nombre}</p>
                <p></p>

                {ReactHtmlParser(this.props.escena.descripcion)}
                <p>{this.props.escena[2]}</p>
                
                {this.props.director ?
                    <Editar
                        partida={this.props.partida}
                        escena={this.props.escena}
                        saveEscenaData={(nombre, texto, recuento) => this.props.saveEscenaData(nombre, texto, recuento)}
                        listaCapitulos={this.props.listaCapitulos}
                        moverEscena={(escena, idCapitulo)=>this.props.onMover(escena,idCapitulo)}
                        sacarEscena={(escena)=>this.props.onSacar(escena)}
                        borrarEscena={(escena)=>this.props.borrarEscena(escena)}
                    />
                    : null}

            </div>
        )
    }
}




const Editar = (props) => {
    let nuevoTexto = props.escena.descripcion;
    let nuevoNombre = props.escena.nombre;
    let recuento = props.escena.recuento;
    let nuevoCapitulo = props.escena.idCapitulo;
    const [showMenu, setShowMenu] = React.useState(false)
    const [showMover, setShowMover] = React.useState(false)

    const [nombre, setNombre] = React.useState(nuevoNombre)
    const [texto, setTexto] = React.useState(nuevoTexto)
    const [capitulo, setCapitulo] = React.useState(nuevoCapitulo)

    const onClickEdit = () => setShowMenu(!showMenu)
    const onClickMover = () => setShowMover(!showMover)
    const onSave = () => {
        props.saveEscenaData(nombre, texto, crecuento)
        setShowMenu(false)
    }
    const [crecuento, setRecuento] = React.useState(recuento)
    const onSacar = () => {
        props.sacarEscena(props.escena)
    }
    const onMover = () => {
        props.moverEscena(props.escena, capitulo)
    }

    return (

        <div>
            {!showMenu ?
                <div style={{ display: "flex" }}>
                    <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={onClickEdit}>
                        <span>Editar </span>
                    </label>
                    <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={onClickMover}>
                        <span>Enviar a... </span>
                    </label>
  
                    {showMover &&
                        <select value={capitulo} onChange={(e) => {setCapitulo(e.target.value)}}>
                            <option value={0} key={0}>Ningún capítulo</option>
                            {props.listaCapitulos.map(i =>
                                <option value={i.id} key={i.id}>{i.nombre}</option>
                            )}
                        </select>
                    }
                    {showMover &&
                        <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={onMover}>
                            <span>Confirmar </span>
                        </label>
                    }


                    {props.escena.idCapitulo !== 0 &&
                        <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={onSacar}>
                            <span>Sacar de este capítulo</span>
                        </label>
                    }
                        <label 
                        style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} 
                        onClick={() => { if (window.confirm('¿Estás seguro de que quieres borrar esta escena?')) props.borrarEscena(props.escena) }}

                        >
                            <span>Eliminar escena</span>
                        </label>                                         

                </div> :
                <div>
                    <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={onClickEdit}>
                        <span>No editar </span>
                    </label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: "100%" }} />

                    <EditorTextoCompleto texto={props.escena.descripcion} onCambio={(texto) => setTexto(texto)} />
                    <input
                        type="checkbox"
                        checked={crecuento === 1}
                        onChange={e => setRecuento(e.target.checked ? 1 : 0)} />
                    <span style={{ marginLeft: "5px" }}>Incluir escena en el recuento por defecto</span>
                    <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={onSave}>
                        <span>Guardar </span>
                    </label>
                    <MenuDestinatarios partida={props.partida.id} escena={props.escena.id} cerrar={onClickEdit} />
                </div>
            }
        </div>
    )
}