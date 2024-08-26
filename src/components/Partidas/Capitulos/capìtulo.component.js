import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import EditorTextoCompleto from '../../EditorTexto/editorTextoCompleto';
import escenaService from '../../../services/escena.service';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import authService from '../../../services/auth.service';
import EscenaPreview from '../Escenas/escenaPreview.component';

export default class Capitulo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            desplegar: false,
            escenas: [],
        };


    }

    componentDidMount = async e => {

    }

    async desplegar() {

        if (!this.state.desplegar) {
            await this.setState({ escenas: await escenaService.listaEscenasCapitulo(this.props.capitulo.id, authService.getCurrentUser().id) })
        }

        this.setState({ desplegar: !this.state.desplegar })

    }

    onSacar(escena) {
        let a = this.state.escenas;
        a.splice(this.state.escenas.indexOf(escena), 1);
        this.setState({ escenas: a })
        this.props.onMover(escena, 0)
    }

    onMover(escena, idCapitulo) {
        let a = this.state.escenas;
        a.splice(this.state.escenas.indexOf(escena), 1);
        this.setState({ escenas: a })
        this.props.onMover(escena, idCapitulo)
    }

    borrarEscena(escena) {
        let a = this.state.escenas;
        a.splice(this.state.escenas.indexOf(escena), 1);
        this.setState({ escenas: a })
        this.props.borrarEscena(escena);
    }

    async borrarCapitulo(capitulo){
        await this.setState({ escenas: await escenaService.listaEscenasCapitulo(this.props.capitulo.id, authService.getCurrentUser().id) })
        this.props.borrarCapitulo(capitulo, this.state.escenas)
    }

    render() {
        return (

            <div className="escena" style={{ display: 'block', textAlign: 'left' }}>
                <p onClick={() => this.desplegar()} style={{ fontWeight: "bold", cursor: "pointer" }}>{this.props.capitulo.nombre}</p>
                <p></p>
                {ReactHtmlParser(this.props.capitulo.descripcion)}
                <p>{this.props.capitulo[2]}</p>

                {this.props.director ?
                    <EditarCapitulo
                        capitulo={this.props.capitulo}
                        saveCapituloData={(nombre, texto) => this.props.saveCapituloData(nombre, texto)}
                        borrarCapitulo={(capitulo) => this.borrarCapitulo(capitulo)}
                    />
                    : null}


                {this.state.desplegar &&
                    <ListaEscenasC
                        partida={this.props.partida}
                        capitulo={this.props.capitulo.id}
                        escenas={this.state.escenas}
                        director={this.props.director}
                        handleEscena={escena => this.props.handleEscena(escena)}
                        onSaveEscenaData={(i, nombre, texto, recuento) => this.onSaveEscenaData(i, nombre, texto, recuento)}
                        escenaCreada={(e) => this.escenaCreada(e)}
                        listaCapitulos={this.props.listaCapitulos}
                        onMover={(escena, idCapitulo) => this.onMover(escena, idCapitulo)}
                        onSacar={(escena) => this.onSacar(escena)}
                        borrarEscena={(escena) => this.borrarEscena(escena)}
                    />
                }




            </div>
        );
    }
}



const EditarCapitulo = (props) => {
    let nuevoTexto = props.capitulo.descripcion;
    let nuevoNombre = props.capitulo.nombre;
    const [showMenu, setShowMenu] = React.useState(false)
    const [nombre, setNombre] = React.useState(nuevoNombre)
    const [texto, setTexto] = React.useState(nuevoTexto)
    const onClick = () => setShowMenu(!showMenu)
    const onSave = () => {
        props.saveCapituloData(nombre, texto)
        setShowMenu(false)
    }

    return (

        <div>
            {!showMenu ?
                <div>
                    <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={onClick}>
                        <span>Editar </span>
                    </label>
                    <label
                        style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }}
                        onClick={() => { if (window.confirm('¿Estás seguro de que quieres borrar este capítulo?')) props.borrarCapitulo(props.capitulo) }}

                    >
                        <span>Eliminar capítulo</span>
                    </label>
                </div> :
                <div>
                    <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={onClick}>
                        <span>No editar </span>
                    </label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: "100%" }} />

                    <EditorTextoCompleto texto={props.capitulo.descripcion} onCambio={(texto) => setTexto(texto)} />


                    <label style={{ width: "150px", border: "1px solid grey", cursor: "pointer", backgroundColor: "black", color: "white", textAlign: "center" }} onClick={onSave}>
                        <span>Guardar </span>
                    </label>

                </div>
            }
        </div>
    )
}




function ListaEscenasC(props) {


    let [characters, updateCharacters] = React.useState(props.escenas);
    const [ordenar, setOrdenar] = React.useState(false);
    const [orden, setOrden] = React.useState([]);

    const onClickOrdenar1 = () => setOrdenar(true);
    const onClickOrdenar2 = () => { setOrdenar(false); escenaService.ordenCapitulo(props.capitulo, orden); }



    const setEscena = (escena) => {
        props.handleEscena(escena);
    };




    function handleOnDragEnd(result) {
        if (!result.destination) return;
        const items = Array.from(characters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        var a = [];
        items.forEach(function (i) {

            a.push(i.id);

        });
        setOrden(a);
        updateCharacters(items);
    }


    return (
        <div>
            {props.director ?
                <div>
                    {!ordenar && <button onClick={onClickOrdenar1}>Ordenar</button>}
                    {ordenar && <button onClick={onClickOrdenar2}>No ordenar</button>}


                </div>
                : null}



            {ordenar ?
                <div>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">
                            {(provided) => (
                                <ul className="listaEscenas" {...provided.droppableProps} ref={provided.innerRef}>
                                    {characters.map((i, index) => {
                                        return (
                                            <Draggable key={i.id} draggableId={i.id + ""} index={index}>
                                                {(provided) => (
                                                    <li className="escena" style={{ border: '1px solid white' }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <p className="link" style={{ fontWeight: "bold" }}>{i.nombre}</p>
                                                        <p></p>
                                                    </li>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                :
                <div>


                    <ul className="listaEscenas" >
                        {characters.map((i, index) =>
                            <li key={i.id} style={{ display: 'block', textAlign: 'left' }}>

                                {i.tipo === 1 ?

                                    <EscenaPreview
                                        escena={i}
                                        director={props.director}
                                        saveEscenaData={(nombre, texto, recuento) => props.onSaveEscenaData(index, nombre, texto, recuento)}
                                        setEscena={(enlace) => setEscena(enlace)}
                                        partida={props.partida}
                                        listaCapitulos={props.listaCapitulos}
                                        onMover={(idEscena, idCapitulo) => props.onMover(idEscena, idCapitulo)}
                                        onSacar={(idEscena) => props.onSacar(idEscena)}
                                        borrarEscena={(escena) => props.borrarEscena(escena)}
                                    />


                                    :
                                    <Capitulo capitulo={i} director={props.director} saveCapituloData={(nombre, texto) => props.onSaveCapituloData(index, nombre, texto)} />
                                }


                            </li>
                        )}
                    </ul>
                </div>
            }








        </div >
    );
}

