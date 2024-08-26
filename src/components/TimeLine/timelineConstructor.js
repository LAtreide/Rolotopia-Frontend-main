import React from 'react';
import authService from '../../services/auth.service';
import { Link } from "react-router-dom";

const TimelineConstructor = (props) => {

    console.log(props)

    switch (props.numMensaje) {
        case 1:
            if (props.usuario !== authService.getCurrentUser().id) {

                return (
                    <Link to={"/usuario/" + props.datos.nombreUsuario} style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                        <span>El usuario {props.datos.nombreUsuario} creó una cuenta.</span>
                    </Link>

                )
            }
            else {
                return (<span>Creaste tu cuenta.</span>)
            }

        case 2:
            if (props.usuario !== authService.getCurrentUser().id) {

                return (
                    <Link to={"/partida/" + props.datos.enlacePartida} style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                        <span>El usuario {props.datos.nombreUsuario} creó la partida {props.datos.nombrePartida}.</span>
                    </Link>)
            }
            else {
                 return (
                <Link to={"/partida/" + props.datos.enlacePartida} style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
               <span>Creaste la partida {props.datos.nombrePartida}.</span>
               </Link>
               )
             

            }
        case 3:
            if (props.usuario !== authService.getCurrentUser().id) {
                return (<span>El usuario {props.datos.nombreUsuario} creó una entrada en su blog.</span>)
            }
            else {
                return (<span>Creaste una entrada en tu blog.</span>)
            }

        case 4:
            if (props.usuario !== authService.getCurrentUser().id) {
                return (
                    <Link to={"/partida/" + props.datos.enlacePartida} style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                        <span>El usuario {props.datos.nombreUsuario} admite nuevos jugadores en la partida {props.datos.nombrePartida}.</span>
                    </Link>
                )
            }
            else {
                return (
                    <Link to={"/partida/" + props.datos.enlacePartida} style={{ textDecoration: 'none', color: 'black', cursor: 'pointer' }}>
                        <span>Abriste la partida {props.datos.nombrePartida} a nuevos jugadores.</span>
                    </Link>
                )
            }

        default:
    }
    return (<span>Evento no reconocido.</span>)



}
export default TimelineConstructor;
