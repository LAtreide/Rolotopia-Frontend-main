import React from 'react';

import "../../css/RolByPost.css";


export default class RolByPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="container-fluid rolotopia-container">
        <div className="row">
          <div className="col">
            <div className="rolbypost-section bg-light p-4 mb-4">
              {/* Contenido de la sección de noticias */}
              <h2>Rol by Post</h2>
              <p>Blablabla</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <div className="side-sections">
              <div className="reclutamientos-section bg-light p-4 mb-4">
                <h2>Reclutamientos</h2>

              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="side-sections">
              <div className="ultpartidas-section bg-light p-4 mb-4">

                <h2>Últimas partidas</h2>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="side-sections">
              <div className="sistemas-section bg-light p-4 mb-4">

                <h2>Sistemas</h2>
               
              </div>
            </div>
          </div>
        </div>
     
      </div>
    );
  }
}



