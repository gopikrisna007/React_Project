import React, { Component } from "react";
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';
import { Container, Row, Col, CardGroup, Card, CardBlock, Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import axios from 'axios';
import cookie from 'react-cookies';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: { 
        "userId": "", 
        "password": "", 
        "errorCount": 0, 
        "serverError": ''
       }
    };
    this.submitForm = this.submitForm.bind(this);
   // this.onLogin = this.onLogin.bind(this);
  }
  // onLogin(userId) {
  //   this.setState({ userId })
  //   cookie.save('userId', userId, { path: '/' });
  //     console.log(cookie.load('userId'));
  // }
  submitForm(e) {
    e.preventDefault();
    this.setState({ message: {} });
    const formData = {};
    for (const field in this.refs) {
      formData[field] = this.refs[field].value;
    }
    var errors = this._validate(formData);
    const posts = errors;
    this.setState({ message: posts });
    const location = this.props.location;
    console.log(formData);
    if (errors.errorCount == 0) {
      axios.post('http://localhost:8088/vritti/api/authenticate', formData)
        .then(data => {
          console.log(data);
          this.setState({ status: data});
          this.props.history.push('/charts');
        })
        // .catch(error1 => {
        //   this.setState({ message: { userId: "", password: "", errorCount: 0, serverError: error1.response.data.error.message } });
        // });
    }
  }

 _validate(formData) {
    var errors = { userId: "", password: "", errorCount: 0, serverError: '' };
    if (formData.userId == "") {
      errors.userId = "userId is required";
      errors.errorCount++;
    }
    if (formData.password == "") {
      errors.password = "Password is required";
      errors.errorCount++;
    }
    return errors;
}
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="4">
              <CardGroup className="mb-0">
                <Card className="p-4">
                  <CardBlock className="card-body">
                    <center> <h2><span className="fa fa-vimeo"></span>ritti Analytics</h2></center>
                    <form className="form-signin" onSubmit={this.submitForm} >
                      <InputGroup className="mb-3">
                        <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                        <input type="text" ref="userId" id="inputEmail" className={"form-control " + (this.state.message.userId == '' ? "" : 'colorRedBorder')} placeholder="User Name" />
                      </InputGroup>
                      <span className={(this.state.message.userId == '') ? "" : 'colorRed'} > {this.state.message.userId} </span>
                      <InputGroup className="mb-4">
                        <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                        <input type="password" ref="password" id="inputPassword" className={"form-control " + (this.state.message.password == '' ? "" : 'colorRedBorder')} placeholder="Password" />                        
                      </InputGroup>
                       <span className={(this.state.message.password == '') ? "" : 'colorRed'} > {this.state.message.password} </span> 
                      <span color="primary"> {this.state.message.serverError} </span>
                      <Row>
                        <Col xs="12">
                          <center> <Button color="primary" className="px-4" type="submit">Login</Button>
                          </center>
                        </Col>
                      </Row>
                    </form>
                  </CardBlock>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Login;
