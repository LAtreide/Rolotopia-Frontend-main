import React from 'react';


import postService from "../../../../services/posts.service"
import authService from '../../../../services/auth.service';
import "../../../../css/Destinatarios.css"
import MenuPartida from '../../menuPartida.component';


export default class CompartirPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: 0,
      carga:0
    };


  }

  

  
  componentDidMount = async () => {
    await this.setState({post: await postService.compartirPost(this.props.post, authService.getCurrentUser().id)})
    this.setState({carga:1})
    
  }

  
  render() {
    return (
<div>      {this.state.carga>0 && <div>
        <MenuPartida partida={this.state.post[3]} escena={this.state.post[2]} pagina={parseInt(this.state.post[1])} post={this.state.post[0]} ></MenuPartida>
  
      </div>}
      </div>

    )
  }
}

