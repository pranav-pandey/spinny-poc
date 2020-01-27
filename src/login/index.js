import React, { Component } from 'react';
import './../App.css';
import { Container, Input, Button } from '@material-ui/core';
import fetch from 'isomorphic-fetch';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: ''
    };
    this.login = this.login.bind(this);
  }
  async login() {
    const { email, password} = this.state;
    if (email == '' || password == '') {
      this.setState({error: 'Please enter your credentials'});
    } else {
    console.log(email, password, this.props, ">> login values");
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Origin': 'http://localhost:3000/',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.email,
        username: this.state.password,
      })
    });
    let response = await res.json();
    console.log(response, "respoinse");
    
    this.props.history.push('/');
    }
  }
  render() {    
    return (
      <div className="App">
        <React.Fragment>
          <Container maxWidth="sm" style={{
            padding: 'auto', marginTop: '10px'
          }}>
            <Input style={{width: '20vw'}} id="outlined-basic" label="Outlined" variant="outlined" placeholder="Email" value={this.state.email} onChange={(e) => {
              this.setState({email: e.target.value, error: ''});
            }}/>
          </Container>
            <Input type="password" style={{width: '20vw'}} id="outlined-basic" label="Outlined" variant="outlined" placeholder="Password" value={this.state.password} onChange={(e) => {
              this.setState({password: e.target.value, error: ''});
            }}/>
          <Container maxWidth="sm" style={{
            padding: 'auto', marginTop: '10px'
          }}>
            <Button variant="contained" color="primary" style={{margin: 10}} onClick={() => this.login()}>
              Login
            </Button>
          </Container>
        </React.Fragment>
      </div>
    )
  }
}

export default Login;
