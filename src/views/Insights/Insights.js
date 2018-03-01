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
import { Router, Route, IndexRoute, hashHistory, browserHistory, Link } from 'react-router';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import { connect } from 'react-redux';
import moment from 'moment';
import { CSVLink, CSVDownload } from 'react-csv';
import logo from '../../views/logo.gif';
import squish from 'object-squish';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import BaseUrl from '../../views/BaseUrl/';
import _ from 'lodash';
const Url =new BaseUrl();
var baseUrl =Url.state.baseUrl;
//console.log(baseUrl)
class Insights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      isLoading: true,
      totaldataCount: '',
      tagValue: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (cookie.load('userId') == undefined) {
      window.location.assign('http://localhost:8080')
    }
    var Url = this.props.location.pathname;
    var res = Url.split("/");
    console.log(res);
    var value = res[2];
    var startdate = res[3];
    var enddate = res[4];
    //console.log(data1);
    if (this.props.location.pathname == "/insights") {
      axios.get(baseUrl +'vritti/api/gbtFraudResults?query=&from=0&till=3100')
        .then(result => {
         // console.log(result.data.totalCount);
          this.setState({ items: result.data.data, isLoading: false, totaldataCount: result.data.totalCount });
        });
    } else {
      axios.get(baseUrl +'vritti/api/drillDown?query=' + value + '&startDate=' + startdate + '&endDate=' + enddate + '&from=0&till=25')
        .then(result => {
          //console.log(value);
          this.setState({ items: result.data.data, isLoading: false, totaldataCount: result.data.totalCount, tagValue: value });
        });
    }

  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.refs.srch !== null) {
      var input = this.refs.srch;
      var inputValue = input.value;
      console.log(inputValue);
      axios.get(baseUrl +'vritti/api/gbtFraudResults?query=' + inputValue + '&from=0&till=22')
        .then(result => {
          console.log(result.data);
          this.setState({ items: result.data.data, isLoading: false, totaldataCount: result.data.totalCount });
        });
    }
    // what to do here
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
          display: "none",
          margin: "20px 0px 10px 0px",
          height: "40px",
          // width: "50%",
          fontSize: 16,
          placeholder: "Search"
        }
      },
    }
    const dowStyle={
      display:"none"
    }
    var totalData = this.state.items
    // var BeneficiaryName=_.mapValues(totalData,'beneficiaryName')
    // console.log(BeneficiaryName);
    // BeneficiaryName.toString();
    // var data1 = [
    //   {firstname:BeneficiaryName}
    // ];

    
    // download data end
    if (this.state.isLoading) {
      return (
        <div>
          <Row>
            <Col xs="12 card">
              <center><img src={logo} className="App-logo" alt="logo" width="70" /></center>
            </Col>
          </Row>
        </div>
      )
    }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="4 card-body">
          </Col>
          <Col xs="12" md="4 card-body">
            <form onSubmit={this.handleSubmit}>
              <InputGroup>
                <InputGroupButton>
                  <Button color="danger"><i className="fa fa-search"></i> Search</Button>
                </InputGroupButton>
                <input ref="srch" type="text" className="form-control" id="input1-group2" placeholder={this.state.tagValue} />
              </InputGroup>
            </form>
          </Col>
          <Col xs="12" md="2 card-body">
         
          </Col>
          <Col xs="12" md="2 card-body">
          <div>
          {/* <ReactHTMLTableToExcel id="test-table-xls-button" className="btn btn-primary"
           table="table-to-xls" filename="Vritti" sheet="Vritti"></ReactHTMLTableToExcel> */}
           {/* <Button color="danger" >{this.state.totaldataCount}</Button> */}
            {/* <table id="table-to-xls" style={dowStyle}>
                <tbody>
                <tr>
                <td>Transaction Code </td>
                <td>Transaction Number</td>
                <td>Location Entity </td>
                <th>Location Entity Code </th>
                <th>Beneficiary Country Code</th>
                <th>Beneficiary Name </th>
                <th>Beneficiary Currency </th>
                <th>Vendor Id </th>
                <th>Sanction Status </th>
                <th>Supplier PayGroup </th>
                <th>Transaction Amount</th>
                <th>Discount Amount </th>
                <th>Transaction Date</th>
                <th>Invoice Number </th>
                <th>Payment Reason </th>
                <th>BillPayment Number </th>
                <th>Payment Status </th>
                <th>ThirdParty AccountNumber </th>
                <th>Beneficiary AccountCountry</th>
                <th>User Selected Status </th>
                <th>Updated UserName </th>
                <th>User Comment</th>
                <th>Red Flags</th>
                </tr>
                {totalData.map((item, i) =><TableRow key={i}
                  dataList={item} />)}
              </tbody>
                </table> */}
            </div>
             <CSVLink data={totalData} className="btn btn-primary" filename={"Vritti.csv"}>Download CSV - {this.state.totaldataCount}</CSVLink> 
          </Col>
        </Row>
        <Row>
          <Col xs="12 card">
            <Griddle styleConfig={styleConfig} data={totalData} plugins={[plugins.LocalPlugin]} pageProperties={{
              currentPage: 1, pageSize: 20, recordCount: 100
            }} >
              <RowDefinition>
                <ColumnDefinition id="invoiceNumber" title="Invoice Number" />
                <ColumnDefinition id="beneficiaryName" title="Beneficiary Name" />
                <ColumnDefinition id="beneficiaryCountryCode" title="Beneficiary Country" />
                <ColumnDefinition id="transactionNumber" title="Transaction Number" />
                <ColumnDefinition id="transactionAmount" title="Transaction Amount" customComponent={enhancedWithRowData(MyCustomComponent)} />
                <ColumnDefinition id="redFlagsDesc" title="Red Flags" customComponent={enhancedWithRowData(MyCustomRedFlagsComponent)} />
                <ColumnDefinition id="transactionDate" title="Transaction Date" customComponent={enhancedWithRowData(MyDateComponent)} />
                <ColumnDefinition id="name" title="Action" customComponent={enhancedWithRowData(ViewModals)} />
                <ColumnDefinition id="id" title="Action" customComponent={enhancedWithRowData(EditModals)} />
              </RowDefinition>
            </Griddle>
          </Col>
        </Row>
      </div>
    );
  }
}
//custom sorting filter download
// class TableRow extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     var totalListDat = this.props.dataList;
//     var t = moment(totalListDat.transactionDate);
//     var transactionDate = t.format("DD-MM-YYYY");
//     var redFlags = totalListDat.redFlagsDesc.join(', ');
//     return (
//       <tr>
//         <td>{totalListDat.transactionCode}</td>
//         <td>{totalListDat.transactionNumber}</td>
//         <td>{totalListDat.locationEntity}</td>
//         <td>{totalListDat.locationEntityCode}</td>
//         <td>{totalListDat.beneficiaryCountryCode}</td>
//         <td>{totalListDat.beneficiaryName}</td>
//         <td>{totalListDat.beneficiaryCurrency}</td>
//         <td>{totalListDat.vendorId}</td>
//         <td>{totalListDat.sanctionStatus}</td>
//         <td>{totalListDat.supplierPayGroup}</td>
//         <td>{totalListDat.beneficiaryCurrency}{totalListDat.transactionAmount}</td>
//         <td>{totalListDat.discountAmount}</td>
//         <td>{transactionDate}</td>
//         <td>{totalListDat.invoiceNumber}</td>
//         <td>{totalListDat.paymentReason}</td>
//         <td>{totalListDat.billPaymentNumber}</td>
//         <td>{totalListDat.paymentStatus}</td>
//         <td>{totalListDat.thirdPartyAccountNumber}</td>
//         <td>{totalListDat.beneficiaryAccountCountry}</td>
//         <td>{totalListDat.userSelectedStatus}</td>
//         <td>{totalListDat.updatedUserName}</td>
//         <td>{totalListDat.userComment}</td>
//         <td>{redFlags}</td>
//       </tr>
//     );
//   }
// }
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
// component for marge Currency and code
function MyCustomComponent({ value, griddleKey, rowData }) {
  return (
    <div className="MyCustomComponent">
      {rowData.beneficiaryCurrency}{value}
    </div>
  );
}
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
//customComponent for MyCustomRedFlagsComponent start
function MyCustomRedFlagsComponent({ value, griddleKey, rowData }) {
  //console.log(rowData.redFlagsDesc)
  var redFlags = rowData.redFlagsDesc.join(', ');
  return (
    <div className="MyCustomComponent">
    <span style={{ color: '#AA0000' }}>{redFlags}</span>
    </div>
  );
}
//customComponent for view  button code    
class ViewModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      large: false,
    };
    this.toggleLarge = this.toggleLarge.bind(this);
  }
  toggleLarge() {
    this.setState({
      large: !this.state.large
    });
  }
  render() {
    const { value, griddleKey, rowData } = this.props;
    // console.log(rowData);
    var t = moment(rowData.transactionDate);
    var transactionDate = t.format("DD-MM-YYYY");
    //console.log(transactionDate);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Button color="primary" onClick={this.toggleLarge} >View</Button>
            <Modal isOpen={this.state.large} toggle={this.toggleLarge}
              className={'modal-lg modal-primary  ' + this.props.className}>
              <ModalHeader toggle={this.toggleLarge}>Invoice Number : {rowData.invoiceNumber}</ModalHeader>
              <ModalBody>
                <Table responsive>
                  <tbody>
                    <tr>
                      <td>Transaction Code : <b>{rowData.transactionCode}</b></td>
                      <td>Transaction Number : <b>{rowData.transactionNumber}</b></td>
                    </tr>
                    <tr>
                      <td>Location Entity : <b>{rowData.locationEntity}</b></td>
                      <td>Location Entity Code : <b>{rowData.locationEntityCode}</b></td>
                    </tr>
                    <tr>
                      <td>Beneficiary Country Code : <b>{rowData.beneficiaryCountryCode}</b></td>
                      <td>Beneficiary Name : <b>{rowData.beneficiaryName}</b></td>
                    </tr>
                    <tr>
                      <td>Beneficiary Currency : <b>{rowData.beneficiaryCurrency}</b></td>
                      <td>Vendor Id : <b>{rowData.vendorId}</b></td>

                    </tr>
                    <tr>
                      <td>Sanction Status : <b>{rowData.sanctionStatus}</b></td>
                      <td>Supplier PayGroup : <b>{rowData.supplierPayGroup}</b></td>
                    </tr>
                    <tr>
                      <td>Transaction Amount : <b>{rowData.transactionAmount}</b></td>
                      <td>Discount Amount : <b>{rowData.discountAmount}</b></td>
                    </tr>
                    <tr>
                      <td>Transaction Date : <b>{transactionDate}</b></td>
                      <td>Invoice Number : <b>{rowData.invoiceNumber}</b></td>

                    </tr>
                    <tr>
                      <td>Payment Reason : <b>{rowData.paymentReason}</b></td>
                      <td>BillPayment Number : <b>{rowData.billPaymentNumber}</b></td>
                    </tr>
                    <tr>
                      <td>Payment Status : <b>{rowData.paymentStatus}</b></td>
                      <td>ThirdParty AccountNumber : <b>{rowData.thirdPartyAccountNumber}</b></td>
                    </tr>
                    <tr>
                      <td>Beneficiary AccountCountry : <b>{rowData.beneficiaryAccountCountry}</b></td>
                      <td>User Selected Status : <b>{rowData.userSelectedStatus}</b></td>
                    </tr>
                    <tr>
                      <td>Updated UserName : <b>{rowData.updatedUserName}</b></td>
                      <td>User Comment : <b>{rowData.userComment}</b></td>
                    </tr>
                    <tr>
                      <td>RedFlags Desc : <b>{rowData.redFlagsDesc}</b></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </ModalBody>
            </Modal>
          </Col>
        </Row>
      </div>
    )
  }
}
//end of view
//edit EditModals Component start
class EditModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      large: false,
      comment: '',
      status: 'authorize',
      items: '',
      isHidden: true
    };
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  toggleLarge() {
    this.setState({
      large: !this.state.large
    });
  }
  handleStatusChange(e) {
    this.setState({
      status: e.target.value
    })
  }
  handleCommentChange(e) {
    this.setState({
      comment: e.target.value
    })

  }
  submitForm(e) {
    e.preventDefault();
    var id = this.props.value;
    var status = this.state.status;
    var comment = this.state.comment;
    axios.get(baseUrl +'vritti/api/saveTransactionStatus?id=' + id + '&status=' + status + '&comment=' + comment)
      .then(response => {
        // console.log(response.data);
        this.setState({ items: response.data, isHidden: !this.state.isHidden });
        // console.log(items);
      })
  }
  render() {
    const { value, griddleKey, rowData } = this.props;
    // console.log(rowData.updatedDate);
    var t = moment(rowData.transactionDate);
    var transactionDate = t.format("DD-MM-YYYY");
   // console.log(rowData.updatedDate);
    var updatedDate = moment.unix(rowData.updatedDate).format('DD-MM-YYYY');
   // console.log(updatedDate);
    const date = new Date();
    const formattedDate = moment(date).format('DD-MM-YYYY');
   // console.log(rowData.userComment);
    if (rowData.userComment == null) {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Button color="success" onClick={this.toggleLarge} >Edit</Button>
              <Modal isOpen={this.state.large} toggle={this.toggleLarge}
                className={'modal-lg modal-primary  ' + this.props.className}>
                <ModalHeader toggle={this.toggleLarge}>Edit Transaction</ModalHeader>
                <ModalBody>
                  <Row>
                    <Col xs="7" sm="7">
                      <ul>
                        <li>Transaction Code : <b>{rowData.transactionCode}</b></li>
                        <li>Transaction Number : <b>{rowData.transactionNumber}</b></li>
                        <li>Location Entity : <b>{rowData.locationEntity}</b></li>
                        <li>Location Entity Code : <b>{rowData.locationEntityCode}</b></li>
                        <li>Beneficiary Country Code : <b>{rowData.beneficiaryCountryCode}</b></li>
                        <li>Beneficiary Name : <b>{rowData.beneficiaryName}</b></li>
                        <li>Beneficiary Currency : <b>{rowData.beneficiaryCurrency}</b></li>
                        <li>Vendor Id : <b>{rowData.vendorId}</b></li>
                        <li>Sanction Status : <b>{rowData.sanctionStatus}</b></li>
                        <li>Supplier PayGroup : <b>{rowData.supplierPayGroup}</b></li>
                        <li>Transaction Amount : <b>{rowData.transactionAmount}</b></li>
                        <li>Discount Amount : <b>{rowData.discountAmount}</b></li>
                        <li>Transaction Date : <b>{transactionDate}</b></li>
                        <li>Invoice Number : <b>{rowData.invoiceNumber}</b></li>
                        <li>Payment Reason : <b>{rowData.paymentReason}</b></li>
                        <li>BillPayment Number : <b>{rowData.billPaymentNumber}</b></li>
                        <li>Payment Status : <b>{rowData.paymentStatus}</b></li>
                        <li>ThirdParty AccountNumber : <b>{rowData.thirdPartyAccountNumber}</b></li>
                        <li>Beneficiary AccountCountry : <b>{rowData.beneficiaryAccountCountry}</b></li>
                        <li>User Selected Status : <b>{rowData.userSelectedStatus}</b></li>
                        <li>Updated UserName : <b>{rowData.updatedUserName}</b></li>
                        <li>User Comment : <b>{rowData.userComment}</b></li>
                        <li>redFlagsDesc : <b>{rowData.redFlagsDesc}</b></li>
                      </ul>
                    </Col>
                    <Col xs="5" sm="5">
                      <CardBlock className="card-body">
                        <Form onSubmit={this.submitForm} >
                          <FormGroup>
                            <Input type="select" value={this.state.status} onChange={this.handleStatusChange} id="ccyear">
                              <option name="authorize">Authorize</option>
                              <option name="ignore">Ignore</option>
                              <option name="report">Report</option>
                              <option name="flag">Flag</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                            <Input type="textarea" value={this.state.comment} onChange={this.handleCommentChange}
                              name="comment" id="textarea-input" rows="9" placeholder="Content..." />
                          </FormGroup>
                          <FormGroup className="form-actions">
                            <Button type="submit" size="sm" color="success" >Send</Button>
                          </FormGroup>
                        </Form>
                        <b>  Status Updated By: {!this.state.isHidden && this.state.items} </b><br />
                        <b>  Updated Date:{!this.state.isHidden && formattedDate} </b>
                      </CardBlock>
                    </Col>
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        </div>
      )
    } else {
      return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Card>
                <Button color="success" onClick={this.toggleLarge} >Edit</Button>
                <Modal isOpen={this.state.large} toggle={this.toggleLarge}
                  className={'modal-lg modal-primary  ' + this.props.className}>
                  <ModalHeader toggle={this.toggleLarge}>Edit Transaction</ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col xs="7" sm="7">
                        <ul>
                          <li>Transaction Code : <b>{rowData.transactionCode}</b></li>
                          <li>Transaction Number : <b>{rowData.transactionNumber}</b></li>
                          <li>Location Entity : <b>{rowData.locationEntity}</b></li>
                          <li>Location Entity Code : <b>{rowData.locationEntityCode}</b></li>
                          <li>Beneficiary Country Code : <b>{rowData.beneficiaryCountryCode}</b></li>
                          <li>Beneficiary Name : <b>{rowData.beneficiaryName}</b></li>
                          <li>Beneficiary Currency : <b>{rowData.beneficiaryCurrency}</b></li>
                          <li>Vendor Id : <b>{rowData.vendorId}</b></li>
                          <li>Sanction Status : <b>{rowData.sanctionStatus}</b></li>
                          <li>Supplier PayGroup : <b>{rowData.supplierPayGroup}</b></li>
                          <li>Transaction Amount : <b>{rowData.transactionAmount}</b></li>
                          <li>Discount Amount : <b>{rowData.discountAmount}</b></li>
                          <li>Transaction Date : <b>{transactionDate}</b></li>
                          <li>Invoice Number : <b>{rowData.invoiceNumber}</b></li>
                          <li>Payment Reason : <b>{rowData.paymentReason}</b></li>
                          <li>BillPayment Number : <b>{rowData.billPaymentNumber}</b></li>
                          <li>Payment Status : <b>{rowData.paymentStatus}</b></li>
                          <li>ThirdParty AccountNumber : <b>{rowData.thirdPartyAccountNumber}</b></li>
                          <li>Beneficiary AccountCountry : <b>{rowData.beneficiaryAccountCountry}</b></li>
                          <li>User Selected Status : <b>{rowData.userSelectedStatus}</b></li>
                          <li>Updated UserName : <b>{rowData.updatedUserName}</b></li>
                          <li>User Comment : <b>{rowData.userComment}</b></li>
                          <li>redFlagsDesc : <b>{rowData.redFlagsDesc}</b></li>
                        </ul>
                      </Col>
                      <Col xs="5" sm="5">
                        <CardBlock className="card-body">
                          <Form onSubmit={this.submitForm} >
                            <FormGroup>
                              <Input type="select" value={rowData.userSelectedStatus} onChange={this.handleStatusChange} id="ccyear" disabled>
                                <option name="authorize">Authorize</option>
                                <option name="ignore">Ignore</option>
                                <option name="report">Report</option>
                                <option name="flag">Flag</option>
                              </Input>
                            </FormGroup>
                            <FormGroup>
                              <Input type="textarea" value={rowData.userComment} onChange={this.handleCommentChange}
                                name="comment" id="textarea-input" rows="9" placeholder="Content..." disabled />
                            </FormGroup>
                            <FormGroup className="form-actions">
                              <Button type="submit" size="sm" color="success" disabled>Send</Button>
                            </FormGroup>
                          </Form>
                          <b>  Status Updated By: {rowData.updatedUserName} </b><br />
                          <b>  Updated Date:{updatedDate} </b>
                        </CardBlock>
                      </Col>
                    </Row>
                  </ModalBody>
                </Modal>
              </Card>
            </Col>
          </Row>
        </div>
      )
    }
  }
}

export default Insights;

