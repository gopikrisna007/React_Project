import React, { Component } from "react";
import {
  Row, Col, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBlock, ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton
} from "reactstrap";
import axios from 'axios';
import cookie from 'react-cookies';
import moment from 'moment';
import logo from '../../views/logo.gif';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory, browserHistory, Link } from 'react-router';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import ReactFileReader from 'react-file-reader';
import BaseUrl from '../../views/BaseUrl/';
const Url =new BaseUrl();
var baseUrl =Url.state.baseUrl;
console.log(baseUrl)

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoading: true
    };
  }
  componentDidMount() {
    if(cookie.load('userId') == undefined){
      window.location.assign('http://localhost:8080')
  }
    axios.post(baseUrl+'vritti/api/fileDetailsDisplay')
      .then(result => {
        console.log(result.data.filesData);
        this.setState({ items: result.data.filesData,isLoading: false });
      });
  }
  render() {
    const styleConfig = {
      icons: {
        TableHeadingCell: {
          sortDescendingIcon: '▼',
          sortAscendingIcon: '▲'
        },
      },
      classNames: {
        Cell: 'griddle-cell',
        Filter: 'griddle-filter',
        Loading: 'griddle-loadingResults',
        NextButton: 'griddle-next-button',
        NoResults: 'griddle-noResults',
        PageDropdown: 'griddle-page-select',
        Pagination: 'griddle-pagination',
        PreviousButton: 'griddle-previous-button',
        Row: 'griddle-row',
        RowDefinition: 'griddle-row-definition',
        Settings: 'griddle-settings',
        SettingsToggle: 'griddle-settings-toggle',
        Table: 'griddle-table',
        TableBody: 'griddle-table-body',
        TableHeading: 'griddle-table-heading',
        TableHeadingCell: 'griddle-table-heading-cell',
        TableHeadingCellAscending: 'griddle-heading-ascending',
        TableHeadingCellDescending: 'griddle-heading-descending',
      },
      styles: {
        Table: {
          border: "1px solid #2fa8ed ",
          width: "100%"
        },
        TableHeading: {
          border: "1px solid #2fa8ed ",
          background: "#2fa8ed",
          color: "#fff"

        },
        SettingsToggle: {
          display: "none"
        },
        Row: {
          border: "1px solid rgb(212, 209, 209)"
        },
        Filter: {
          margin: "20px 0px 20px 0px",
          height: "40px",
          width: "50%",
          fontSize: 16,
          placeholder: "Search",
          display: "none"
        }
      },

    }
    var totalData = this.state.items
    console.log(totalData);
    if(this.state.isLoading){
      return(
        <div><center><img src={logo} className="App-logo" alt="logo" width="70"/></center></div>
      )
    }
    return (
      <div className="animated fadeIn">
        <Row>
        <Col xs="12 card">
        <h1></h1>
        <center><UploadData/></center>
        <h1></h1>
        </Col>
          <Col xs="12 card">
          <h1></h1>
            <Griddle styleConfig={styleConfig} data={totalData} plugins={[plugins.LocalPlugin]} pageProperties={{
              currentPage: 1, pageSize: 10, recordCount: 100}} >
              <RowDefinition>
                <ColumnDefinition id="name" title="Name" />
                <ColumnDefinition id="storageClass" title="Storage Class" />
                <ColumnDefinition id="lastModified" title="Last Modified" customComponent={enhancedWithRowData(MyDateComponent)} />
                <ColumnDefinition id="size" title="Size (Kb)" />
              </RowDefinition>
            </Griddle>
          </Col>
        </Row>
      </div>
    );
  }
}
//customComponent for beneficiaryCurrency and code
const rowDataSelector = (state, { griddleKey }) => {
  return state
    .get('data')
    .find(rowMap => rowMap.get('griddleKey') === griddleKey)
    .toJSON();
};

const enhancedWithRowData = connect((state, props) => {
  return {
    // rowData will be available into MyCustomComponent
    rowData: rowDataSelector(state, props)
  };
});

// component for date formate
function MyDateComponent({ value, griddleKey, rowData }) {
  var t = moment(value);
  var formatted = t.format("DD-MM-YYYY");
  return (
    <div className="MyCustomComponent">
      {formatted}
    </div>
  );
}

class UploadData extends React.Component {
  constructor() {
    super();
    this.state = {
      viewitems: []
    }
  }
 handleFiles (files) {
    var reader = new FileReader();
    reader.onload = function(e) {
    // Use reader.result
    //alert(reader.result)
    console.log(reader.result);
    axios.post(baseUrl+'vritti/fraud/uploadFile', reader.result)
       .then(data => {
         console.log(data);
           this.setState({ viewitems: data });                   
         })
    }
  reader.readAsText(files[0]);
}
  render() {
    console.log(this.state.viewitems);
    return <div>
     <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'} >
    <Button color="primary"> Upload CSV File </Button>
    </ReactFileReader>
    </div>
  }
}
export default Upload;

