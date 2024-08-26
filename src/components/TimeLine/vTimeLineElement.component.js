import React from 'react';
import { SPACE_URL } from '../../constantes';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import "../../css/VerticalTimeLine.css"
import logodado from '../../logodado.png';
import ReactHtmlParser from 'react-html-parser';
import { confirm } from "react-confirm-box";
import TimelineConstructor from './timelineConstructor';




export default class VTimeLineElement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  contentStyle() {

    switch (this.props.tipo) {
      case "usuario":
        return { background: 'rgb(33, 150, 243)', color: '#000' }

      case "partida":
        return { background: 'rgb(154, 27, 16)', color: '#000' }
      case "comunidad":
        return { background: 'green', color: '#000' }
      default:
        return {}
    }

  }

  iconStyle() {

    switch (this.props.tipo) {
      case "usuario":
        return { background: 'rgb(33, 150, 243)', color: '#fff' }

      case "partida":
        return { background: 'rgb(154, 27, 16)', color: '#000' }
      case "comunidad":
        return { background: 'green', color: '#000' }
      default:
        return {}
    }



  }


  icon(){

    if (this.props.icon==="defecto") return logodado; 
    else switch (this.props.tipo) {
      case "usuario":
        return SPACE_URL + "/avatarUser/" + this.props.icon;
      case "partida":
        return SPACE_URL + "/portada/" + this.props.icon;
      case "comunidad":
        return logodado;
      default:
        return {}
  }

}

  arrowStyle() {

    switch (this.props.tipo) {
      case "usuario":
        return { background: 'transparente', color: '#fff' }

      case "partida":
        return { background: 'transparent', color: 'rgb(154, 27, 16)' }
      case "comunidad":
        return { background: 'transparent', color: '#000' }
      default:
        return {}
    }

  }


  render() {
    return (

      <VerticalTimelineElement
        className="vertical-timeline-element--education"
        contentStyle={this.contentStyle()}
        iconStyle={this.iconStyle()}
        contentArrowStyle={this.arrowStyle()}
        date={this.props.date ? this.props.date : null}
        icon={<img src={this.icon()} alt="Logo" title="Logo" width={"60px"} style={{ cursor: this.props.interior ? "pointer" : null }} />}
        iconOnClick={() => this.props.interior ? informacion(this.props.interior) : null}
        contentOnClick={() => informacion(this.props.interior)}
      >
        {TimelineConstructor(this.props)}
      </VerticalTimelineElement>

    )
  }
}



async function informacion(message) {
  return await confirm(message,

    {
      closeOnOverlayClick: true,
      render: (message) => {
        return (
          <div style={{ border: "1px solid black", backgroundColor: "white", position: "fixed", borderRadius: "10px", padding: "5px", MinWidth: "350px", textAlign: "center", maxHeight: "70%", maxWidth: "70%", overflowY: "auto", top: "50%", transform: "translateY(-50%)" }}>
            {ReactHtmlParser(message)}
          </div>
        );
      }
    }

  )
}
