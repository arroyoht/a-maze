import React, { Component } from 'react';
import './App.css';
import MazeViewer from './components/MazeViewer'

class App extends Component {

  options = {
      colors: {
          done: 'white',
          touched: '#AD5203'
      }
  }  
  
  render() {
    return (
      <MazeViewer width="500" height="500" cellSize="10" options={this.options}/>
    );
  }
}

export default App;
