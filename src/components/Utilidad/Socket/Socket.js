import React from "react";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import authService from '../../../services/auth.service';
import Emitter from "../EventEmitter"


export default class Socekt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  componentDidMount = async e => {
    const user = authService.getCurrentUser();
    let logged = false;
    if (user) logged = true;
    if (logged) {

      let Sock = new SockJS('https://rolotopia-back.duckdns.org/ws');
      stompClient = over(Sock);
      stompClient.connect({}, this.onConnected, this.onError);


    }

  }



  onNotificationReceived = async (payload) => {


    var payloadData = JSON.parse(payload.body);
    
    if (payloadData.tipo === "solicitud") { Emitter.emit('solicitudRecibida', payloadData);Emitter.emit('solicitudRecibida2', payloadData); }
    if (payloadData.tipo === "solicitudLeida") { console.log(payloadData);Emitter.emit('solicitudLeida', payloadData);Emitter.emit('solicitudLeida2', payloadData); }
    if (payloadData.tipo === "mensaje") {Emitter.emit('mensajeRecibido', payloadData);}
    if (payloadData.tipo === "Mensaje abierto") Emitter.emit('mensajeAbierto', payloadData);
    if (payloadData.tipo === "post") Emitter.emit('post', payloadData);
    if (payloadData.tipo === "hilo") Emitter.emit('hilo', payloadData);
    if (payloadData.tipo === "chat") Emitter.emit('chatEntrante', payloadData);

  }
  onConnected = (err) => {
    stompClient.subscribe('/user/' + authService.getCurrentUser().username + '/private', this.onNotificationReceived);
  }

  onError = (err) => {

  }

  render() {
    return (<></>)
  }
}
var stompClient = null;