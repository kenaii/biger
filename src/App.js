/* eslint-disable no-undef */
import React, {Component} from 'react';
import Router from './screen';

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
GLOBAL.WebSocket = GLOBAL.originalWebSocket || GLOBAL.WebSocket;
GLOBAL.FormData = GLOBAL.originalFormData || GLOBAL.FormData;

if (window.FETCH_SUPPORT) {
  window.FETCH_SUPPORT.blob = false;
} else {
  GLOBAL.Blob = GLOBAL.originalBlob || GLOBAL.Blob;
  GLOBAL.FileReader = GLOBAL.originalFileReader || GLOBAL.FileReader;
}
console.disableYellowBox = true;

export default class App extends Component {
  render() {
    return <Router />;
  }
}
