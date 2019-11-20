import React, { Component } from "react";
import "./UserCRUD.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { sampleProductsAxios} from "../../Data";
import {Datatable} from "@o2xp/react-datatable";
import { refreshRows as refreshRowsAction } from "@o2xp/react-datatable/src/redux/actions/datatableActions";
import {
  refreshRowsUserPropType
} from "@o2xp/react-datatable/src/proptypes";
import {
  FreeBreakfast as CoffeeIcon,
  CallSplit as CallSplitIcon
} from "@material-ui/icons";
import { chunk } from "lodash";

const mapStateToProps = state => {
  return {
    numberOfItemsInCart: state.cartItems.length,
    loggedInUser: state.loggedInUser,
    loggedInUserRole: state.loggedInUserRole
  };
};

const options = {
  title: "Users",
  dimensions: {
    datatable: {
      width: "90%",
      height: "40%"
    },
    row: {
      height: "60px"
    }
  },
  keyColumn: "id",
  font: "Arial",
  data: {
    columns: [
      {
        id: "id",
        label: "id",
        colSize: "150px",
        editable: false
      },
      {
        id: "name",
        label: "name",
        colSize: "100px",
        editable: true,
        dataType: "text",
        inputType: "input"
      },
      {
        id: "category",
        label: "category",
        colSize: "100px",
        editable: true,
        dataType: "text",
        inputType: "input"
      },
      {
        id: "price",
        label: "price",
        colSize: "100px",
        editable: true,
        dataType: "text",
        inputType: "input"
      },
      {
        id: "description",
        label: "description",
        colSize: "100px",
        editable: true,
        dataType: "text",
        inputType: "input"
      },
      {
        id: "popular",
        label: "popular",
        colSize: "100px",
        editable: true,
        dataType: "text",
        inputType: "input"
      }  
    ],
    rows: []
  },
  features: {
    canEdit: true,
    canDelete: true,
    canPrint: true,
    canDownload: true,
    canSearch: true,
    canRefreshRows: true,
    canOrderColumns: true,
    canSelectRow: true,
    canSaveUserConfiguration: true,
    userConfiguration: {
      columnsOrder: ['id','name','category','price','description','popular'],
      copyToClipboard: true
    },
    rowsPerPage: {
      available: [10, 25, 50, 100],
      selected: 10
    },
    additionalIcons: [
      {
        title: "Coffee",
        icon: <CoffeeIcon color="primary" />,
        onClick: () => alert("Coffee Time!")
      }
    ],
    selectionIcons: [
      {
        title: "Selected Rows",
        icon: <CallSplitIcon color="primary" />,
        onClick: rows => console.log(rows)
      }
    ]
  }
};


class UserCRUD extends Component {



  actionsRow = ({ type, payload }) => {
    console.log(type);
    console.log(payload);
  };

  refreshRows = () => {
    const { rows } = options.data;
    return rows
  };


  componentDidMount() {
    var x = sampleProductsAxios;
    x.then(arry =>
      {
        options.data.rows = arry.data  
        this.props.dispatch(refreshRowsAction(refreshRowsUserPropType))
      // options.data.columns =  arry.reduce((accum, current) => {
      //     accum.push(current);
      //     return accum;
      //   }, {})
      })
  }

  _refreshRows = () => {
    alert("hackers")
  };


  render() {
    return <Datatable options={options} refreshRows={this.refreshRows} />;
  }
}

export default UserCRUD = withRouter(connect(mapStateToProps)(UserCRUD));

// export default withRouter(connect(mapStateToProps)(ConnectedHeader));
