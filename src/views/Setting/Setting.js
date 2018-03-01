import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import cookie from 'react-cookies';
var divStyle = {
  width:'100%',
  height: '600px'
};
class Drools extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    if(cookie.load('userId') == undefined){
      window.location.assign('http://localhost:8080')
  }
  }
    render() {
      return (
        <div className="animated fadeIn">
        <Row>
          <Col xs="12">
          <iframe src="http://fraudqa.vrittianalytics.com/drools-guvnor/org.drools.guvnor.Guvnor/Guvnor.jsp" style={divStyle}></iframe>
          </Col>
          </Row>
        </div>
       
      );
    }
  }
  
  export default Drools;
