import React from 'react';
import '../../css/navbar.scss';


import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Rnd } from 'react-rnd';
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import "../../css/Ventana.css"

import NavPartida2 from "./navPartida2.component";
import authService from '../../services/auth.service';
import partidaService from '../../services/partida.service';
import Popup from 'reactjs-popup';

import Personajes from '../Partidas/Informacion/Personajes';
import Jugadores from '../Partidas/Informacion/Jugadores';
import Marcadores from '../Partidas/Informacion/Marcadores';
import Configuracion from '../Partidas/Informacion/Configuracion';
import GeneradorRecuento from '../Partidas/Informacion/GeneradorRecuento';
import { faLock, faLockOpen, faBookmark, faCog, faCalendarCheck, faFilePdf, faEllipsisV, faBellSlash, faBell, faAngleDown, faFileContract, faWindowMaximize, faWindowMinimize } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import escenaService from '../../services/escena.service';
import Emitter from '../Utilidad/EventEmitter';

export default class NavPartida extends React.Component {
    constructor(props) {
        super(props)
        this.redVentana = this.redVentana.bind(this);
        this.addVentana = this.addVentana.bind(this);
        this.mueVentana = this.mueVentana.bind(this);
        this.state = {
            ncajas: 0,
            cajas: [],
            carga: null,
            nov: "a",
            muestraActivadas: false,
            notificacionesActivadas: false,
            capMuestra: 0,
            solicitudesNoLeidas: 0,
            ventanas: [],
            key: Math.random(),

        };
    }

    addVentana = async (tipo) => {


        let v = this.state.ventanas;
        v.push({

            "draggable_id": this.state.ventanas.length ? "draggable_" + (parseInt(this.state.ventanas[this.state.ventanas.length - 1].draggable_id.split("_")[1]) + 1) : "draggable_0",
            "row_items": [{
                "id": "" + this.state.ventanas.length + "_0",
                "tipo": tipo,
            }],
            "position": {
                "x": 0,
                "y": 0,
            },
            "alto": 350,
            "ancho": 250,
            "activa": 0,
            "bloqueado": true,
            "mostrar": 1,
            "maximizado": false,

        })
        this.setState({
            ventanas: v,
            carga: 1
            })

        this.guardarVentanas(v);

    };



    
    redVentana = (indice, ancho, alto) => {
        var c = this.state.ventanas;
        c[indice].ancho = ancho;
        c[indice].alto = alto;
        this.setState({ ventanas: c })

        let v = JSON.parse(localStorage.getItem('ventanas'));

        if (this.props.director) {
            v["director"] = this.state.ventanas;
        }
        else {
            v["jugador"] = this.state.ventanas;
        }
        localStorage.setItem("ventanas", JSON.stringify(v));

    }

    mueVentana = (indice, x, y) => {

        let c = this.state.ventanas;
        c[indice].position.x = x;
        c[indice].position.y = y;

        this.guardarVentanas(c);

    }

    guardarVentanas(ventanas) {
        let v = []
        v = JSON.parse(localStorage.getItem('ventanas'));
        if (!v) v = { "director": [], "jugador": [] }

        if (this.props.director) {
            v["director"] = ventanas;
        }
        else {
            v["jugador"] = ventanas;
        }
        localStorage.setItem("ventanas", JSON.stringify(v));
    }

    cerrarCajas() {

        localStorage.removeItem("ventanas");

        localStorage.setItem("ventanas", JSON.stringify({ "director": [], "jugador": [] }));
        this.setState({ ventanas: [], carga: 0 })


    }

    componentDidMount = async e => {
        await this.setState({ notificacionesActivadas: this.props.notificaciones })
        var ventanas = null;
        try {
            ventanas = JSON.parse(localStorage.getItem('ventanas'));

            let v = this.props.director ? ventanas["director"] : ventanas["jugador"];
            for (let i = 0; i < v.length; i++) {
                if (v[i].mostrar === 0) {
                    v.splice(i, 1);
                    i--;
                }
                else {
                    v[i].draggable_id = "draggable_" + i;
                }
            }
            this.setState({
                ventanas: v
            })


        } catch (error) {
            this.setState({
                ventanas: []
            })
            localStorage.setItem("ventanas", JSON.stringify({ "director": [], "jugador": [] }));
        }
        if (this.props.director) {
            this.setState({ solicitudesNoLeidas: await partidaService.formulariosNoLeidosPartida(authService.getCurrentUser().id, this.props.partida) })
        }
        this.setState({ carga: 1 })



        Emitter.on('solicitudRecibida', (data) => {
            if (data.dato === this.props.partida) this.setState({ solicitudesNoLeidas: this.state.solicitudesNoLeidas + 1 })
        });
        Emitter.on('solicitudLeida', (data) => {

            if (data.dato.idPartida === this.props.partida) this.setState({ solicitudesNoLeidas: data.dato.noLeidas })
        });

    };

    componentWillUnmount() {
        Emitter.off('solicitudRecibida', this.handleNotificationReceived);
        Emitter.off('solicitudLeida', this.handleNotificationReceived);
    }



    handleNotif() {
        partidaService.setNotifications(authService.getCurrentUser().id, this.props.partida, !this.state.notificacionesActivadas);
        this.setState({ notificacionesActivadas: !this.state.notificacionesActivadas })
    }



    generarPDF(e) {
        this.props.generarPDF();
    }

    activarFormulario() {
        this.props.activarFormulario();
    }

    onCambio = (cambio) => {
        this.props.onCambio(cambio);
    }

    setCapitulo = async (idCapitulo) => {
        this.setState({
            capMuestra: this.state.capMuestra === idCapitulo ? 0 : idCapitulo,
            escenasCapitulo: await escenaService.listaEscenasCapitulo(idCapitulo, authService.getCurrentUser().id)
        });

    }


    maximize = (indice, position, maximizar) => {
        let ventanas = [...this.state.ventanas];
        ventanas[indice].maximizado = !ventanas[indice].maximizado;
        ventanas[indice].position = position;
        this.setState({ ventanas});
        if (maximizar) this.setState({key: Math.random() })
        
    }



    render() {
        return (
            <div>


                <NavPartida2 partida={this.props.partida}></NavPartida2>
                <header className={"navbarp"}>


                    <nav className="navigation">
                        <ul>

                            <div style={{ display: "inline-flex" }}>
                                <li><span className="nav-item" onClick={() => { this.props.salir() }} style={{ margin: "0px 5px 0px 5px" }}>{this.props.titulo}</span></li>

                                <li>
                                    <Popup
                                        trigger={
                                            <button className="nav-item"><FontAwesomeIcon icon={faAngleDown} /></button>

                                        }
                                        position="bottom left"
                                        nested
                                    >
                                        <ul style={{ background: "#35838d", border: "2px solid", borderColor: "#04434A", listStyle: "none", padding: "0px 15px 0px 15px", borderRadius: "10px", maxHeight: "400px", overflowY: "auto" }}>
                                            {this.props.escenas.length > 0 && this.props.escenas.map((i, index) =>
                                                <li key={index} style={{ borderBottom: "1px solid black" }}>



                                                    {i.tipo === 1 && <p onClick={() => this.props.handleEscena(i.enlace)} style={{ cursor: "pointer" }}>{i.nombre}</p>}
                                                    {i.tipo === 3 && <p onClick={() => this.setCapitulo(i.id)} style={{ cursor: "pointer" }}><strong>{i.nombre}</strong></p>}
                                                    {i.tipo === 3 && i.id === this.state.capMuestra &&
                                                        this.state.escenasCapitulo.map((j, index2) =>
                                                            <p onClick={() => this.props.handleEscena(j.enlace)} style={{ cursor: "pointer", marginLeft: "15px" }} key={index2}>{j.nombre}</p>
                                                        )
                                                    }

                                                </li>

                                            )}

                                            {this.props.escenas.length === 0 &&
                                                <li style={{ borderBottom: "1px solid black" }}>
                                                    <p style={{ cursor: "pointer", marginLeft: "15px" }}>No hay escenas que mostrar</p>
                                                </li>
                                            }


                                        </ul>
                                    </Popup>


                                </li>



                            </div>
                            <div style={{ display: "inline-flex", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                                <li><button className="nav-item" onClick={() => this.addVentana('Personajes')}>PERSONAJES</button></li>
                                <li><button className="nav-item" onClick={() => this.addVentana('Jugadores')}>JUGADORES</button></li>
                            </div>
                            <div style={{ display: "inline-flex", position: "absolute", right: "0" }}>
                                <li><button className="nav-item" onClick={() => this.cerrarCajas()}>X</button></li>
                                {this.props.director ? <li><button className="nav-item" onClick={() => this.addVentana('Configuracion')}><FontAwesomeIcon icon={faCog} /></button></li> : null}
                                <li><button className="nav-item" onClick={() => this.addVentana('Marcadores')}><FontAwesomeIcon icon={faBookmark} /></button></li>
                                <li><button className="nav-item" onClick={e => this.generarPDF(e)}><FontAwesomeIcon icon={faFilePdf} /></button></li>
                       
                               { (this.props.director || this.props.abierta) && 
                               <li>
                                    <button className="nav-item" onClick={e => this.activarFormulario()} style={{ position: 'relative' }}>
                                        <FontAwesomeIcon icon={faFileContract} />
                                     
                                        
                                        {this.props.director && this.state.solicitudesNoLeidas > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '0px',
                                                height: '10px',
                                                width: '10px',
                                                backgroundColor: 'green',
                                                borderRadius: '50%',
                                                border: '1px solid white',
                                                display: 'inline-block'
                                            }}>{this.state.solicitudesNoLeidas}</span>
                                        )}
                                    </button>
                                </li>}
                                <li><button className="nav-item" onClick={() => this.addVentana('Recuento')}><FontAwesomeIcon icon={faCalendarCheck} /></button></li>
                                <Popup
                                    trigger={
                                        <li> <button className="nav-item" >  <FontAwesomeIcon style={{ padding: this.state.notificacionesActivadas ? "0px 3px 0px 3px" : "" }} icon={this.state.notificacionesActivadas ? faBell : faBellSlash} onClick={() => this.handleNotif()} /></button></li>
                                    }
                                    position="bottom right"
                                    nested
                                >
                                    {close =>
                                        <p style={{ border: '1px solid black', backgroundColor: "white" }} close={setTimeout(() => {

                                            setTimeout(() => {
                                                close()
                                            }, 1000)

                                        }, 1000)}  >
                                            {this.state.notificacionesActivadas ? "Notificaciones activadas" : "Notificaciones desactivadas"}
                                        </p>

                                    }
                                </Popup>

                                <Popup
                                    trigger={
                                        <li><button className="nav-item"><FontAwesomeIcon icon={faEllipsisV} /></button></li>
                                    }
                                    position="bottom right"
                                    nested
                                >
                                    <ul style={{ background: "#35838d", border: "2px solid", borderColor: "#04434A", listStyle: "none", padding: "0px 15px 0px 15px", borderRadius: "10px", maxHeight: "400px", overflowY: "auto" }}>


                                        <li style={{ borderBottom: "1px solid black" }}>
                                            <p>AAA</p>
                                        </li>


                                    </ul>
                                </Popup>



                                <li>



                                </li>
                            </div>
                        </ul>
                    </nav>

                </header>

                {
                    this.state.carga > 0 && <Ventanas
                
                    key={this.state.key}
                        ventanas={this.state.ventanas}
                        mueVentana={this.mueVentana}
                        guardarVentanas={v => this.guardarVentanas(v)}
                        redVentana={this.redVentana}
                        director={this.props.director}
                        onCambio={(cambio) => { this.onCambio(cambio) }}
                        partida={this.props.partida}
                        nombresPj={this.props.nombresPj}
                        cambiosAvatar={this.props.cambiosAvatar}
                        maximize={(indice, position, maximizar)=>this.maximize(indice, position, maximizar)}


                    />
                }




            </div >
        )
    }
};




const getFirstListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : '#142125',
    display: 'inline-block',
    width: "100%",
    borderBottom: "1px solid #DAE0E7",
    paddingTop: "8px",
    paddingLeft: "10px"
});


const getItemStyle = (isDragging, draggableStyle, item, activa) => ({
    background: activa ? "#FFF" : isDragging ? "#FEFEFE" : "#EEE",
    float: "left",
    height: "35px",
    border: "1px solid #DAE0E7",
    overflow: "hidden",
    ...draggableStyle
});




function Ventanas(props) {
    const renderDraggable = useDraggableInPortal();

    let [numero, aumentarNumero] = React.useState(0)
    let [itemList, setItemList] = React.useState(props.ventanas);
    let [posicion, setPosicion] = React.useState({x:1,y:1});
    let [maximizado, setMaximizado] =React.useState(-1)
    const rndRefs  = React.useState({});

    const getList = (droppableId) => {
        let item_list = itemList;
        let filtered_item = item_list.find(tappedItem => tappedItem.draggable_id === droppableId);
        return filtered_item;
    }

    const getIndex = (droppableId) => {
        let item_list = itemList;
        let findIndex = item_list.findIndex(tappedItem => tappedItem.draggable_id === droppableId);
        return findIndex;
    }

    const onDragEnd = (result) => {

        const { source, destination } = result;
        // dropped outside the list
        if (!destination) {
            let state_item_list = itemList;

            state_item_list.push(
                {
                    "draggable_id": "draggable_" + (state_item_list.length),
                    "row_items": [],
                    "position": {
                        "x": 50,
                        "y": 75,
                    },
                    "nombre": "A",
                    "ancho": 250,
                    "alto": 350,
                    "activa": 0,
                    "bloqueado": state_item_list[getIndex(source.droppableId)].bloqueado,
                    "mostrar": 1
                })

            state_item_list[getIndex(source.droppableId)].activa = 0;
            state_item_list[state_item_list.length - 1].row_items[0] = state_item_list[getIndex(source.droppableId)].row_items[source.index];
            state_item_list[getIndex(source.droppableId)].row_items.splice(source.index, 1);
            let ind = getIndex(source.droppableId);
            if (state_item_list[getIndex(source.droppableId)].row_items.length === 0) {
                state_item_list[ind].mostrar = 0;
            }

            aumentarNumero(numero + 1);
            setItemList(state_item_list);
            props.guardarVentanas(state_item_list)
            return;
        }
        let state_item_list = itemList;

        if (source.droppableId === destination.droppableId) {

            let result_index = getIndex(source.droppableId);
            let result_items = reorder(getList(source.droppableId), source.index, destination.index);
            state_item_list[result_index] = result_items;
            aumentarNumero(numero + 1);
            setItemList(state_item_list);
        } else {
            let result_source_index = getIndex(source.droppableId);
            let result_dest_index = getIndex(destination.droppableId);

            let result_m = move(getList(source.droppableId), getList(destination.droppableId), source, destination);
            if (result_m === undefined || result_m.source === undefined || result_m.dest === undefined) {

                return;
            }

            state_item_list[result_dest_index] = result_m.dest;
            if (result_m.source.row_items.length === 0) {
                state_item_list[result_source_index].mostrar = 0;
            }
            else {
                state_item_list[result_source_index] = result_m.source;
                state_item_list[result_source_index].nombre = state_item_list[result_source_index].row_items[0].name;

            }
            aumentarNumero(numero + 1);
            setItemList(state_item_list);
            props.guardarVentanas(state_item_list)
        }

    }

    const reorder = (list, startIndex, endIndex) => {
        let result = Array.from(list.row_items);
        if (startIndex > endIndex) {
            let minIndex = endIndex;
            let maxIndex = startIndex;
            let aux = result[maxIndex]
            for (let i = maxIndex; i > minIndex; i--) {
                result[i] = result[i - 1];
            }
            result[minIndex] = aux;
        }
        else {
            let minIndex = startIndex;
            let maxIndex = endIndex;
            let aux = result[minIndex]
            for (let i = minIndex; i < maxIndex; i++) {
                result[i] = result[i + 1];
            }
            result[maxIndex] = aux;
        }
        let new_obj = { ...list, row_items: result };
        return new_obj;
    }

    const move = (source, destination, droppableSource, droppableDestination) => {
        try {
            const { row_items } = source;
            let result = {};
            let sourceClone = Array.from(row_items);
            let destClone = Array.from(destination.row_items);
            let first_item = sourceClone[droppableSource.index];
            let second_item = destClone[droppableDestination.index];
            if ((first_item === undefined || second_item === undefined) && (droppableDestination.index !== destination.row_items.length)) {
                return;
            }
            sourceClone.splice(droppableSource.index, 1);
            if (droppableDestination.index < destination.row_items.length) destClone.splice(droppableDestination.index, 0, first_item);
            else destClone.push(first_item)
            let source_new_obj = { ...source, row_items: sourceClone };
            let dest_new_obj = { ...destination, row_items: destClone };
            result.source = source_new_obj;
            result.dest = dest_new_obj;
            return result;
        } catch (e) {
        }
    }

    const delTab = (e, index1, index2) => {
        e.stopPropagation();
        let state_item_list = itemList;

        if (state_item_list[index1].activa === index2) {
            state_item_list[index1].activa = 0;
        }

        state_item_list[index1].row_items.splice(index2, 1);
        if (state_item_list[index1].row_items.length === 0) {
            state_item_list[index1].mostrar = 0;
          //  if (state_item_list[index1].maximizado) props.maximize(index1, 0, true); 
          
        }
        setItemList(state_item_list);

       aumentarNumero(numero + 1);
        props.guardarVentanas(itemList);
        return;


    }

    const setPestana = (indice, indice2) => {


        let a = itemList;
        a[indice].activa = indice2;
        aumentarNumero(numero + 1);
        setItemList(a);
        props.guardarVentanas(itemList)
    }

    const bloquear = (indice) => {


        let a = itemList;
        a[indice].bloqueado = !a[indice].bloqueado;
        aumentarNumero(numero + 1);
        setItemList(a);
        props.guardarVentanas(itemList)
    }

    return (

        <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            {itemList.map((item, index) => (
                <div key={index}>
                    {item.mostrar === 1 &&
                        <Rnd

                        ref={(ref) => rndRefs[item.draggable_id] = ref}

                            default={{
                                x: item.position.x,
                                y: item.position.y,
                                width: item.ancho,
                                height: item.alto,
                            }}
                            cancel=".no-drag"
                            onResize={(e, direction, ref, delta, position) => {
                                props.redVentana(index, ref.style.width, ref.style.height);
                            }}
                            style={{
                                boxSizing: 'border-box',
                                backgroundColor: '#7E8C8F',
                                borderRadius: "10px",
                                display: "flex",
                                flexDirection: "column",
                                position: item.bloqueado ? 'fixed' : 'absolute',
                                width: maximizado === index ? '100vw' : item.ancho,
                                height:  maximizado === index  ? '100vh' : item.alto,
                                top:  maximizado === index ? 0 : 'auto',
                                left:  maximizado === index  ? 0 : 'auto',
                                zIndex:  maximizado === index  ? 11 : '10'

                            }}
                            disableDragging={ maximizado === index  ? true : false}
                            enableResizing={ maximizado === index  ? false : true}
                            onDragStop={(e, d) => {
                                props.mueVentana(index, d.x, d.y);
                            }}
                        >

                            <Droppable droppableId={item.draggable_id} direction="horizontal" key={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getFirstListStyle(snapshot.isDraggingOver)}
                                        {...provided.droppableProps}
                                    >
                                        {item.row_items.map((item_row, index2) => (
                                            <div onClick={() => { setPestana(index, index2); }} key={item_row.id}>
                                                <Draggable

                                                    draggableId={item_row.id}
                                                    index={index2}
                                                    onStop={() => { }}

                                                >
                                                    {renderDraggable((provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style,
                                                                item_row,
                                                                index2 === item.activa

                                                            )}
                                                            className="no-drag"
                                                        >
                                                            <p style={{ padding: "3px 5px" }}>
                                                                {item_row.tipo}
                                                                <button href=""
                                                                    className='closeTab'
                                                                    onClick={(e) => delTab(e, index, index2)}
                                                                >✕</button>

                                                            </p>


                                                        </div>
                                                    ))}
                                                </Draggable>

                                            </div>

                                        ))}
                                        {provided.placeholder}
                                        <div style={{ color: "#C9D7DA", float: "right", marginRight: "10px" }} >
                                            { maximizado === index  ? 
                                                <span style={{ color: "#C9D7DA", marginRight: "10px", cursor: "pointer" }} onClick={() => { setMaximizado(-1); rndRefs[item.draggable_id].updateSize({ width: item.ancho, height: item.alto }); rndRefs[item.draggable_id].updatePosition({ x: posicion.x, y: posicion.y });}}>
                                                <FontAwesomeIcon icon={faWindowMinimize } />
                                            </span>
                                                :
                                                <span style={{ color: "#C9D7DA", marginRight: "10px", cursor: "pointer" }} onClick={() => { setMaximizado(index);rndRefs[item.draggable_id].updatePosition({ x: 0, y: 0 }); rndRefs[item.draggable_id].updateSize({ width: "100%", height: "100%" }); setPosicion({x:item.position.x, y:item.position.y});}}>
                                                    <FontAwesomeIcon icon={  faWindowMaximize} />
                                                </span>
                                            }
                                            <span style={{ color: "#C9D7DA", marginRight: "10px", cursor: "pointer" }} onClick={() => bloquear(index)}><FontAwesomeIcon icon={item.bloqueado ? faLockOpen : faLock} /></span>
                                        </div>


                                    </div>
                                )}
                            </Droppable>
                            <div className="no-drag" style={{

                                overflowY: 'auto', width: maximizado === index  ? "100%" : item.ancho,
                                height:  maximizado === index  ? "100%":  item.alto, border: '1px solid black', cursor: "initial", 


                            }} >

                                {itemList[index].row_items[itemList[index].activa].tipo === 'Personajes' ? <Personajes partida={props.partida} director={props.director} onCambio={(cambio) => props.onCambio(cambio)} nombresPj={props.nombresPj} cambiosAvatar={props.cambiosAvatar} /> : null}
                                {itemList[index].row_items[itemList[index].activa].tipo === 'Configuracion' ? <Configuracion partida={props.partida} onCambio={(cambio) => props.onCambio(cambio)} /> : null}
                                {itemList[index].row_items[itemList[index].activa].tipo === 'Jugadores' ? <Jugadores partida={props.partida} director={props.director} /> : null}
                                {itemList[index].row_items[itemList[index].activa].tipo === 'Marcadores' ? <Marcadores partida={props.partida} /> : null}
                                {itemList[index].row_items[itemList[index].activa].tipo === 'Recuento' ? <GeneradorRecuento partida={props.partida} /> : null}


                            </div>
                        </Rnd>
                    }
                </div>
            ))}
        </DragDropContext>

    );
};

const useDraggableInPortal = () => {
    const self = useRef({}).current;

    useEffect(() => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.pointerEvents = 'none';
        div.style.top = '0';
        div.style.width = '100%';
        div.style.height = '100%';
        self.elt = div;
        document.body.appendChild(div);
        return () => {
            document.body.removeChild(div);
        };
    }, [self]);

    return (render) => (provided, ...args) => {
        const element = render(provided, ...args);
        if (provided.draggableProps.style.position === 'fixed') {
            return createPortal(element, self.elt);
        }
        return element;
    };
};


