import React, { Component } from 'react';
import './App.css';
import { Container, Input, Button } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard';
import AuthRoute from './utils/authRoute';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: props.result
    };
  }
  render() {    
    return (
      <Switch>
        <React.Fragment>
          <div className="App">
            <header className="App-header">
                <code>spinny POC</code>          
            </header>
            <Route exact path="/login" component={() => <Login />} />
            <Route exact path="/" component={() => <Dashboard result={this.state.result} />} />
          </div>
        </React.Fragment>
      </Switch>
    )
  }
}

export default App;
