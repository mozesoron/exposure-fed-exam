import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'sea',
      favorites: false
    };
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
          <span> </span>
          <input className="app-checkbox" onChange={event => this.setState(({favorites}) =>({favorites: !favorites}))} value={this.state.favorites} type="checkbox"/>Favorites
        </div>
        <Gallery tag={this.state.tag} favorites={this.state.favorites}/>
      </div>
    );
  }
}

export default App;
