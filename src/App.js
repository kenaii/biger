
import React, { Component } from 'react';
import Router from "./screen";
import { View, StatusBar } from 'react-native';

XMLHttpRequest = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : GLOBAL.XMLHttpRequest;
console.disableYellowBox = true;


export default class App extends Component {
  render() {
    return (
      <Router />
    );
  }
};
