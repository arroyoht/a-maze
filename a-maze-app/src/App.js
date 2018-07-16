import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MazeViewer from './components/MazeViewer'

class App extends Component {
  render() {
    return (
      <MazeViewer width="500" height="500" />
    );
  }
}

export default App;
