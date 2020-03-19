import React, { Component } from 'react';
import _ from 'lodash';


export default class etheventviewerTile extends Component {

  render() {
    return (
      <div className="w-100 h-100 relative bg-white bg-gray0-d ba b--black b--gray1-d">
        <a className="w-100 h-100 db pa2 no-underline" href="/~etheventviewer">
          <p className="black white-d absolute f9" style={{ left: 8, top: 8 }}>Ethereum Event Viewer</p>
        </a>
      </div>
    );
  }

}

window.etheventviewerTile = etheventviewerTile;
