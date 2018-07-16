import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Maze from './components/Maze'

class App extends Component {
  render() {
    return (
      <Maze width="500" height="500" />
    );
  }
}

export default App;
