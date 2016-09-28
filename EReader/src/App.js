import React, { Component } from 'react';
import './App.css';

/* globals Jigsaw */

let config = {
  vbid: "LF9780170130653-03",
  el: "book",
  page: "recent",
  brand: "vitalsource",
  zoomDisabled: false,
  swipeDisabled: false,
  highlightsEnabled: false
};

class App extends Component {
  componentDidMount() {
    this.viewer = Jigsaw.createPageViewer(config,  (data) => {
      if(data.code === 200) {
        console.log(data);
        this.viewer.bind('book:selectionWithPosition', (event) => {
          console.log(event);
          this.viewer.Book.highlightCurrentSelection({markerId: 'sample'}, (highlighter) => {
            console.log(highlighter);
          });
        });
      }
    });
  }

  render() {
    return (
      <div id="book"></div>
    );
  }
}

export default App;
