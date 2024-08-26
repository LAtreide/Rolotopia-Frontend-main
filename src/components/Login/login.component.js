import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import { TiArrowBack } from "react-icons/ti";

import AuthService from "../../services/auth.service";
import logo from '../../logo.png';
import "../../css/Login.css"

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger alerta" role="alert">
        ¡Este campo es necesario!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger alerta" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeOlvido = this.onChangeOlvido.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.handleRecover = this.handleRecover.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",
      olvido: false,
      email: "",
      respuesta: ""
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();
    
    this.setState({
      message: "",
      loading: true
    });


    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        () => {
          this.props.history.push("/escritorio");
          this.props.onLogin();
          //window.location.reload();
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage === "Request failed with status code 401" ? "Error: Usuario o contraseña incorrectos" : resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  onChangeOlvido(e) {
    e.preventDefault();
    this.setState({
      olvido: !this.state.olvido,
      password: "",
      respuesta: ""
    });
  };

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  async handleRecover(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });


    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      this.setState({
        respuesta: await AuthService.recover(this.state.email),
        loading: false
      });
    }
  
  }


  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),

      });
    }
  }

  render() {
    return (

      <div className="col-md-12 login">
        <div className="card card-container">
          <img
            src={logo}
            alt="rolotopia"

          />
          {this.state.olvido === false ?
            <div>
              <Form
                onSubmit={this.handleLogin}
                ref={c => {
                  this.form = c;
                }}
              >
                <div className="form-group">
                  <label htmlFor="username">Usuario</label>

                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>


                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required]}
                  />
                </div>



                <div className="form-group">
                  <button className="noButton">

                    <div className="button2">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      ENTRAR
                    </div>
                  </button>
                </div>

                {this.state.message && (
                  <div className="form-group">
                    <div className="alert alert-danger alerta" role="alert">
                      {this.state.message}

                    </div>
                  </div>
                )}


                <div className="clickableLogin">

                <CheckButton
                  style={{ display: "none" }}
                  ref={c => {
                    this.checkBtn = c;
                  }}
                />
                  <span onClick={this.onChangeOlvido}>¿Has olvidado tu contraseña?</span>
                </div>

              </Form>

            </div>
            :
            null}
          {this.state.olvido === true && this.state.respuesta === "" ?
            <Form
              onSubmit={this.handleRecover}
              ref={c => {
                this.form = c;
              }}
            >
              <div className="form-group">
                <label htmlFor="username">Correo electrónico</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChangeEmail}
                  validations={[required, email]}
                />
              </div>


              <div className="form-group">
                <button
                  className="btn btn-block buttonRolotopia"
                  disabled={this.state.loading}
                >
                  {this.state.loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Recuperar mi contraseña</span>
                </button>
              </div>





              <div className="backArrow">
                <TiArrowBack onClick={this.onChangeOlvido} />
              </div>
              <CheckButton
                style={{ display: "none" }}
                ref={c => {
                  this.checkBtn = c;
                }}
              />
            </Form>
            : null}

          {this.state.olvido === true && this.state.respuesta === "Error" ?
            <div>
              <p className="alert alert-danger alerta">Email no encontrado</p>
              <button onClick={this.onChangeOlvido} className="btn btn-block buttonRolotopia">Volver</button>

            </div>

            : null}
          {this.state.olvido === true && this.state.respuesta !== "Error" && this.state.respuesta !== "" ?
            <div>
              <p>Hemos enviado un email a <b>{this.state.email} </b>con las instrucciones para recuperar la contraseña.</p>
              <button onClick={this.onChangeOlvido} className="btn btn-primary btn-block buttonRolotopia">Volver</button>


            </div>
            : null}

        </div>
      </div>

    );
  }
}
