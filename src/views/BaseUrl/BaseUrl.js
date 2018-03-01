import React, { Component } from 'react';
import { Router, Route, IndexRoute, hashHistory, browserHistory, Link } from 'react-router';
import axios from 'axios';
class BaseUrl extends React.Component {
  constructor(props){
    super(props);
    this.state={
        baseUrl:"http://DESKTOP-PO2JVEN:8088/"
    }
  }
  render() {
    return
  }
}

export default BaseUrl;