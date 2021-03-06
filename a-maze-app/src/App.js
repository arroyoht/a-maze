import React, { Component } from 'react';
import './App.css';
import MazeViewer from './components/MazeViewer'

class App extends Component {

  options = {
      colors: {
          background: '#111111'
      }
  }  
  
  render() {
    return (
        <div className="app">
            <MazeViewer width="200" height="200" cellSize="10" options={this.options}/>
        </div>
    );
  }
}

export default App;
