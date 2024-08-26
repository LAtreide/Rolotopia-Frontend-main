import React from 'react';
import "../../../css/MenuLateral.css"
import partidaService from "../../../services/partida.service"
import authSerice from "../../../services/auth.service"
import { Link } from 'react-router-dom';
import { SPACE_URL } from '../../../constantes';
import Portada from '../../Partidas/Portada/portada.component';
export default class MenuLateral extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      carga: 0,
      partidas: []
    };
  }

  componentDidMount = async e => {
    this.setState({ partidas: await partidaService.lista(authSerice.getCurrentUser().id) })
 
    try {
     localStorage.getItem('mLateral');

  } catch (error) {
      localStorage.setItem("mLateral", 1);
  }
  
    if (localStorage.getItem('mLateral')==="1") this.toggleDropdown()
  }

  async toggleDropdown() {
    const arrow = document.querySelector('.arrow');
    const dropdown = document.querySelector('.dropdown');

    if (this.state.carga === 0) {
      this.setState({ partidas: await partidaService.lista(authSerice.getCurrentUser().id) })
      this.setState({ carga: 1 })
    }
    else this.setState({ carga: 0 })

    localStorage.setItem("mLateral",localStorage.getItem('mLateral') === "1" ? 0 : 1);
   
    arrow.classList.toggle('active');
    dropdown.classList.toggle('show');

  }

  render() {
    return (
      <div className="dropdown">

        {this.state.partidas.length > 0 && <div className="menu">
          <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
            {this.state.partidas[0].map((i, index) =>

              <Link to={"/partida/" + i.enlace} className="link" key={i.id}>
                <Portada src={SPACE_URL + "/portada/" + i.imagen} key={i.imagen} height={"40px"} style={{ marginRight: "5px" }} />
              </Link>

            )}
          </div>
          <div style={{ display: "inline-flex", flexWrap: "wrap" }}>
            {this.state.partidas[1].map((i, index) =>

              <Link to={"/partida/" + i.enlace} className="link" key={i.id}> <Portada src={SPACE_URL + "/portada/" + i.imagen} key={i.imagen} height={"40px"} style={{ marginRight: "5px" }} /></Link>


            )}

          </div>
        </div>}
        <div className="arrow" onClick={() => this.toggleDropdown()}>
          <span>&rarr;</span>
        </div>
      </div>
    )
  }
}

