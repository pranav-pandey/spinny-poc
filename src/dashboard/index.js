import React, { Component } from 'react';
import './../App.css';
import { Container, Input, Button } from '@material-ui/core';
import fetch from 'isomorphic-fetch';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      taskDescription: '',
      seconds: 0,
      minutes: 0,
      disabled: true,
      project: '',
      projects: [],
      tasks: props.result ? props.result : []
    };
    this.timer = {};
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.counter = this.counter.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchTasks();
  }
  async fetchTasks() {
    const res = await fetch('http://localhost:5000/', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Origin': 'http://localhost:3000/'
      }
    });
    let result = await res.json();

    const projects = await fetch('http://localhost:5000/projects', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Origin': 'http://localhost:3000/'
      }
    });
    let projectList = await projects.json();
    console.log(projectList, "list");
    

    this.setState({tasks: result, projects: projectList});
  }
  async startTimer() {    
    this.setState({disabled: false});
    //Start the timer
    this.timer = setInterval(this.counter, 1000);
  }
  counter() {
    // Increment counter value
    let seconds = this.state.seconds + 1;
    let minutes = this.state.minutes;
    if (seconds > 59) {
      minutes = minutes + 1;
      seconds = 0;
    }
    this.setState({
      seconds: seconds,
      minutes: minutes
    });
  }
  async stopTimer() {
    let timeSeconds = this.state.minutes * 60 + this.state.seconds;
    if (this.state.task == '' || this.state.taskDescription == '' || this.state.project == '') {
      this.setState({error: 'Enter all the details'});
      this.setState({task: '', project: '', taskDescription: '', seconds: 0, minutes: 0, disabled: true});
    } else {
      console.log("buttob clicked", timeSeconds);
    const res = await fetch('http://localhost:5000/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Origin': 'http://localhost:3000/',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.task,
        description: this.state.taskDescription,
        time: timeSeconds,
        projectId: this.state.project,
        // projectName: this.state.projectName
      })
    });
    let response = await res.json();
    let newList = this.state.tasks;
    newList.push(response);
    this.setState({tasks: newList, task: '', project: '', taskDescription: '', seconds: 0, minutes: 0, disabled: true});
    console.log(response, "post response");
    }

    // Fetch time, task, and task description and save in db
    // Clear the interval
      clearInterval(this.timer);
  }
  handleChange(event) {
    console.log(event.target, "ev");
    
    this.setState({project: event.target.value});
  };

  render() {    
    return (
    <div>
      <React.Fragment>
        <Container maxWidth="sm" style={{
          padding: 'auto', marginTop: '20px'
        }}>
          <FormControl disabled={this.state.disabled} variant="outlined" style={{width: '20vw', border: '1px'}}>
          <code style={{padding: 5}}>Project:</code>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.project}
              onChange={this.handleChange}
              width={'20vw'}
            >
              {
                this.state.projects.map((item, index) => {
                  return <MenuItem key={index} value={item._id}>{item.name}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        </Container>
        <Container maxWidth="sm" style={{
          padding: 'auto', marginTop: '10px'
        }}>
          <Input disabled={this.state.disabled} style={{width: '20vw'}} id="outlined-basic" label="Outlined" variant="outlined" placeholder="Task name" value={this.state.task} onChange={(e) => {
            this.setState({task: e.target.value});
          }}/>
        </Container>
        <Input multiline={true} disabled={this.state.disabled} style={{width: '30vw', marginTop: 10, fontSize: 14}} id="outlined-basic" label="Outlined" variant="outlined" placeholder="Task description" value={this.state.taskDescription} onChange={(e) => {
          this.setState({taskDescription: e.target.value});
        }}/>
        <div>
        <code style={{color: 'red'}}>{this.state.error}</code>
        </div>
        <Container maxWidth="sm" style={{
          padding: 'auto', marginTop: '10px'
        }}>
          <Button variant="contained" color="primary" style={{margin: 10}} onClick={() => {
            this.setState({error: ''})
            this.startTimer()
          }}>
            Start
          </Button>
          <Button variant="contained" color="secondary" style={{margin: 10}} onClick={() => this.stopTimer()}>
            Stop
          </Button>
        </Container>
        <Container maxWidth="sm" style={{
          padding: 'auto', marginTop: '10px'
        }}>
          <code>{this.state.minutes} : {this.state.seconds}</code>
        </Container>
      </React.Fragment>
      <React.Fragment>
        <Container maxWidth="sm" style={{
          padding: 'auto', marginTop: '50px'
        }}>
          <code>Previous tasks: </code>
            <List style={{border: '1px'}}>
            {
              this.state.tasks.map((item, index) => {                
                return (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={item.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                            >
                              {item.time} seconds -- 
                            </Typography>
                            {item.description}
                            <div>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
                                <code>Project: {item.projectName}</code>
                              </Typography>
                            </div>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })
            }
            </List>
        </Container>
      </React.Fragment>
    </div>
    )
  }
}

export default Dashboard;
