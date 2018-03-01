import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from 'react-router-dom';
//import { Bar, Doughnut, Pie, Radar } from "react-chartjs-2";
import { CardColumns, Button, Card, CardHeader, CardBlock, Badge, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { bindAll } from 'lodash';
import classnames from "classnames";
import cookie from 'react-cookies';
import logo from '../../views/logo.gif';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import Insights from '../../views/Insights/';
import BaseUrl from '../../views/BaseUrl/';
import {
  LineChart, XAxis, YAxis, CartesianGrid, Area, AreaChart, Tooltip,
  ResponsiveContainer, Cell, Sector, Line, Legend, BarChart, Bar, PieChart, Pie
} from 'recharts';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
const style = {
  position: 'absolute',
  width: 300,
  height: 'auto',
  top: 20,
  right: 200,
  lineHeight: '24px'
};
const Url =new BaseUrl();
var baseUrl =Url.state.baseUrl;
//console.log(baseUrl)

class Charts extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: '1',
      startDate: moment().add(-364, 'days'),
      endDate: moment(),
      barData: [],
      pieData: [],
      DoughnutChart: [],
      isLoading: true,
      updateStartDate: '',
      updateendDate: ''
    }
    this.toggle = this.toggle.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }
  handleChangeStart(date) {
    return this.setState({ startDate: date });
  }
  handleChangeEnd(date) {
    return this.setState({ endDate: date });
  }
  componentDidMount() {
    //console.log(cookie.load('userId'));
    if(cookie.load('userId') == undefined){
      window.location.assign('http://localhost:8080')
  }
  console.log(baseUrl);
    var start = moment(this.state.startDate);
    var end = moment(this.state.endDate);
    var startD = start.unix("DD-MM-YYYY") * 1000;
    var endD = end.unix("DD-MM-YYYY") * 1000;
    axios.get(baseUrl +'vritti/api/barChart?startDate=' + startD + '&endDate=' + endD)
      .then(result => {
        this.setState({ barData: result.data });
      });
    axios.get(baseUrl +'vritti/api/redFlagPieChart?startDate=' + startD + '&endDate=' + endD)
      .then(result => {
        // console.log(result.data);
        this.setState({ pieData: result.data, isLoading: false, updateStartDate: startD, updateendDate: endD });
      }); 
    axios.get(baseUrl +'vritti/api/locationPieChart?startDate=' + startD + '&endDate=' + endD)
      .then(result => {
        this.setState({ DoughnutChart: result.data, isLoading: false, updateStartDate: startD, updateendDate: endD });
      });

  }
  handleSubmit(e) {
    e.preventDefault();
    var start = moment(this.state.startDate);
    var end = moment(this.state.endDate);
    var startD = start.unix("DD-MM-YYYY") * 1000;
    var endD = end.unix("DD-MM-YYYY") * 1000;
    //console.log(startD)
    // console.log(endD)
    axios.get(baseUrl +'vritti/api/barChart?startDate=' + startD + '&endDate=' + endD)
      .then(result => {
        // console.log(result.data);
        this.setState({ barData: result.data, updateStartDate: startD, updateendDate: endD });
      });
    axios.get(baseUrl +'vritti/api/redFlagPieChart?startDate=' + startD + '&endDate=' + endD)
      .then(result => {
        // console.log(result.data);
        this.setState({ pieData: result.data, updateStartDate: startD, updateendDate: endD });
      });
    axios.get(baseUrl +'vritti/api/locationPieChart?startDate=' + startD + '&endDate=' + endD)
      .then(result => {
        // console.log(result.data);
        this.setState({ DoughnutChart: result.data, isLoading: false, updateStartDate: startD, updateendDate: endD });
      });

  }
  handleClickpei(entry, Dates, index) {
    // console.log(entry.DateStart);
    // console.log(entry.Dateend);
    // console.log(Dates.name);
    window.location.assign('#/insights/' + Dates.name + '/' + entry.DateStart + '/' + entry.Dateend);
  };
  handleClickdon(entry, Dates, index) {
    // console.log(entry.DateStart);
    // console.log(entry.Dateend);
    // console.log(Dates.countryCode);
    var value = "beneficiaryCountryCode:" + Dates.countryCode;
    window.location.assign('#/insights/' + value + '/' + entry.DateStart + '/' + entry.Dateend);
  };
  handleClickPl(e,Dates,index){
    window.location.assign('#/insights/' + Dates.value + '/' + e.DateStart + '/' + e.Dateend);
  }
  handleClickDl(e,Dates,index){
    //   console.log(e.DateStart);
    // console.log(e.Dateend);
    // console.log(Dates.payload.countryCode);
    var value = "beneficiaryCountryCode:" + Dates.payload.countryCode;
    window.location.assign('#/insights/' + value + '/' + e.DateStart + '/' + e.Dateend);
  }
  render() {
    if (this.state.isLoading) {
      return (
        <div><center><img src={logo} className="App-logo" alt="logo" width="70" /></center></div>
      )
    }
    const DateStart = this.state.updateStartDate;
    const Dateend = this.state.updateendDate;
    var Dates = { DateStart, Dateend }
    //console.log(Dates);
    // const data = this.state.pieData;
    // const data = this.state.DoughnutChart;
    //console.log(data);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#6c3483', '#52be80', '#00cc00', '#839192', '#f08080','#FF0000','#00FF00','#0000FF','#800080','#FF00FF','#008080'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" dy={-6}>
          {`${(percent * 100).toFixed(0)}%`}</text>);
    };
    return (<div>
      <div>
        <form onSubmit={this.handleSubmit}>
          <Row>
          <Col xs="3 "></Col>
            <Col xs="2 ">
              <DatePicker className="form-control" selected={this.state.startDate} onChange={this.handleChangeStart} dateFormat="DD-MM-YYYY" />
            </Col>
            <Col xs="2 ">
              <DatePicker className="form-control" selected={this.state.endDate} onChange={this.handleChangeEnd} dateFormat="DD-MM-YYYY" />
             
            </Col>
            <Col xs="2">
              <Button color="danger"><i className="fa fa-search"></i> Search</Button>
            </Col>
            <Col xs="3 "></Col>
          </Row>
        </form>
      </div>
      <Row>
        <Col xs="12" md="12" className="mb-12">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => { this.toggle('1'); }} >
                <i className="fa fa-bar-chart fa-lg"></i> <b>Charts</b>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={() => { this.toggle('2'); }} >
                <i className="fa fa-map-marker fa-lg"></i> <b> Geo Distribution </b>
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
               {/* DoughnutChart code start */}
               <Col xs="6 card">
             <CardHeader>
           <h6> Fraud By Location</h6>
             </CardHeader>
                  <PieChart width={800} height={300} onMouseEnter={this.onPieEnter}>
                    <Pie isAnimationActive={false} data={this.state.DoughnutChart} dataKey="fraudAmount" nameKey="countryName" cx={150} cy={150} labelLine={false} label={renderCustomizedLabel}
                      innerRadius="35%" outerRadius="80%" fill="#8884d8" onClick={this.handleClickdon.bind(this, Dates)}>
                      {
                        this.state.DoughnutChart.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} />)
                      }
                    </Pie>
                    <Legend iconSize={10} width={200} height={300} verticalAlign='middle' wrapperStyle={style} onClick={this.handleClickDl.bind(this, Dates)}/>
                    <Tooltip />
                  </PieChart>
                </Col>
                 {/* DoughnutChart code end */}
                  {/* pieData code start */}
                  <Col xs="6 card">
             <CardHeader>
           <h6>Fraud By Red Flags</h6>
             </CardHeader>
                  <PieChart width={800} height={300} onMouseEnter={this.onPieEnter}>
                    <Pie isAnimationActive={false} data={this.state.pieData} dataKey="count" nameKey="rfLabel" cx={150} cy={150} labelLine={false} label={renderCustomizedLabel}
                      outerRadius="80%" fill="#8884d8" onClick={this.handleClickpei.bind(this, Dates)}>
                      {
                        this.state.pieData.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} />)
                      }
                    </Pie>
                    <Legend iconSize={10} width={300} height={400} layout='vertical' verticalAlign='middle' wrapperStyle={style} onClick={this.handleClickPl.bind(this, Dates)}  />
                    <Tooltip />
                  </PieChart>
                </Col>
                </Row>
                  {/* pieData code end */}
                 {/* barchart code start */}
               <Row>
                 <Col xs="12 card">
             <CardHeader>
           <h6> Credible Payments vs Red Flagged Payments</h6>
             </CardHeader>
                  <BarChart width={1000} height={300} data={this.state.barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="month" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="redFlagPayments" stackId="a" fill="#cc3300" barSize={30} />
                    <Bar dataKey="totalPayments" stackId="a" fill="#82e0aa" barSize={30} />
                  </BarChart>
                </Col>
                {/* barchart code end */}
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <h1>Map</h1>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </div>);
  }
}

//SimpleBarChart code end 
export default Charts;
