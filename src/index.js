import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import './config/ReactotronConfig';

import Routes from './routes';

export default class App extends Component {
  state = {};

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
        <Routes />
      </>
    );
  }
}
