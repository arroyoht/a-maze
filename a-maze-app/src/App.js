import React, { Component } from 'react';
import './App.css';
import MazeViewer from './components/MazeViewer'

class App extends Component {

  options = {
      colors: {
          background: 'white'
      }
  }  
  
  render() {
    return (
        <div className="app">
            <MazeViewer width="500" height="500" cellSize="10" options={this.options}/>
        </div>
    );
  }
}

export default App;
