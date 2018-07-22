import React, { Component } from 'react';
import './MazeViewer.css';

export class Controls extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="action section">
                <span className="btn">
                    <button onClick={this.props.step} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect mdl">
                        <i className="material-icons">skip_next</i>
                    </button>
                </span>
                <span className="btn">
                    <button onClick={this.props.play} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect mdl">
                        <i className="material-icons">play_arrow</i>
                    </button>
                </span>
                <span className="btn">
                    <button onClick={this.props.pause} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect mdl">
                        <i className="material-icons">pause</i>
                    </button>
                </span>
                <span className="btn">
                    <button onClick={this.props.record} style={{'background-color': '#ff4136'}} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect mdl">
                        <i className="material-icons">fiber_manual_record</i>
                    </button>
                </span>
            </div>
        );
    }
}
