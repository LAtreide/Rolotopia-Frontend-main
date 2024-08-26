import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";



import AuthService from "../../services/auth.service";
import logo from '../../logo.png';

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        ¡Este campo es necesario!
      </div>
    );
  }
};


const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export default class Recover extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeRepeatPassword = this.onChangeRepeatPassword.bind(this);

    this.onChangeOlvido = this.onChangeOlvido.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.handleRecover = this.handleRecover.bind(this);

    this.state = {
      password: "",
      repeatpassword: "",
      loading: false,
      token: "b",
      distintas: false,
    };
  }



  componentDidMount = async e => {


  };


  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeRepeatPassword(e) {
    this.setState({
      repeatpassword: e.target.value
    });
  }

  handleLogin(e) {

    this.form.validateAll();

    e.preventDefault();
    if (this.state.password !== this.state.repeatpassword) {
      this.setState({
        distintas: true,
      });
    }
    else {
      this.setState({
        distintas: false,
      });


      if (this.checkBtn.context._errors.length === 0) {
        AuthService.resetpassword(this.state.password, this.props.token);
        window.location.replace("/login");
      } else {
        this.setState({
          loading: false
        });
      }

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


  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src={logo}
            alt="rolotopia"
            className="profile-img-card"
          />
          <div>
            <Form
              onSubmit={this.handleLogin}
              ref={c => {
                this.form = c;
              }}
            >
              <div className="form-group">
                <label htmlFor="username">Introduce tu nueva contraseña</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Repite tu nueva contraseña</label>



                <Input
                  type="password"
                  className="form-control"
                  name="repeatpassword"
                  value={this.state.repeatpassword}
                  onChange={this.onChangeRepeatPassword}
                  validations={[required]}
                />
              </div>
              {this.state.distintas &&
                <p className="alert alert-danger">Las contraseñas no coinciden.</p>
              }

              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                  disabled={this.state.loading}
                >
                  {this.state.loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Cambiar contraseña</span>
                </button>
              </div>


              <CheckButton
                style={{ display: "none" }}
                ref={c => {
                  this.checkBtn = c;
                }}
              />
            </Form>

          </div>


        </div>
      </div>
    );
  }
}
