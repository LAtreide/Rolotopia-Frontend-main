import React from 'react';
import '../../css/navbar.scss';

import Logo from '../../letras.png';
export default class NavPartida2 extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
        scrolled: false,


    };
}
  
  setScrolled = function(v){
      this.setState({scrolled: v});
  }

  componentDidMount (){
    window.addEventListener('scroll', this.handleScroll);
  }


  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  
  handleScroll = e =>{
    if(window.scrollY > 200 ){
      this.setScrolled(true);
    }
    else{
      this.setScrolled(false);
    }
  }



  render() {
  return (
    this.state.scrolled &&
    <header className={" scrolled navbar"}>
        <div className="logo">
                        <img src={Logo} alt="Logo" title="Logo" className="navbar-logo"/>
                    </div>
        <nav className="navigation">
            <ul>
              <li><a href="#post1">Home</a></li>
              <li><a href="#post2">Home</a></li>
              <li><a href="#post2">Home</a></li>
              <li><a href="#post3">Home</a></li>
              <li><a href="#post4">Home</a></li>
            </ul>
        </nav>

    </header>
  )
};

}