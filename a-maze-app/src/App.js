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
            <MazeViewer width="600" height="600" cellSize="6" options={this.options}/>
        </div>
    );
  }
}

export default App;
