import React from 'react';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import "../../css/VerticalTimeLine.css"
import VTimeLineElement from './vTimeLineElement.component';
import TimeLineService from '../../services/timeline.service';
import authService from '../../services/auth.service';

export default class TimeLine extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      elementos: []
    };
  }

  componentDidMount = async e => {
    if(!this.props.usuario)
    this.setState({
      elementos: await TimeLineService.listaTotal(authService.getCurrentUser().id),
    });
    else{
      this.setState({
        elementos: await TimeLineService.listaTotalUsuario(this.props.usuario),
      });
    }
  }

  cargaTodos = async e => {
    if(!this.props.usuario)
    this.setState({
      elementos: await TimeLineService.listaTotal(authService.getCurrentUser().id),
    });
    else{
      this.setState({
        elementos: await TimeLineService.listaTotalUsuario(this.props.usuario),
      });
    }

  }
  
  cargaMios = async e => {
      this.setState({
        elementos: await TimeLineService.listaTotalUsuario(authService.getCurrentUser().id),
      });
    }

  


  cargaPartidas = async e => {
    if(!this.props.usuario)
    this.setState({
      elementos: await TimeLineService.listaPartidas(authService.getCurrentUser().id),
    });
    else{
      this.setState({
        elementos: await TimeLineService.listaPartidasUsuario(this.props.usuario),
      });
    }
  }





  render() {
    return (
      <div>
        <button onClick={()=>{this.cargaTodos()}} >Sin filtro</button>
       {!this.props.usuario && <button onClick={()=>{this.cargaMios()}} >Mis cosas</button>}
        <button onClick={()=>{this.cargaPartidas()}} >Partidas</button>
    
  
        <VerticalTimeline>
          {this.state.elementos.map((i, index) => {
            return (

              <VTimeLineElement
                className="vertical-timeline-element--work"
                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                date={i.fecha}
                tipo={i.tipo}
                html={i.html}
                interior={i.interior}
                key={(i.id)}
                icon={(i.icono)}
                usuario={i.idUsuario}
                numMensaje={i.numMensaje}
                datos={JSON.parse(i.datos)}
                >
              </VTimeLineElement>


            );
          })}
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
          
            
          />
        </VerticalTimeline>
      </div>
    )
  }
}

