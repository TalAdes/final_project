import React, { Component } from "react";
import "./UserCRUD.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import ItemUser from "../Item/ItemUser";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../../Api";

class UserCRUD extends Component {
  constructor(props) {
  super(props);

  this.state = {
      unfinishedTasks: 0,
      openPriceDialog: false,
      wholeDataLength: null,
      items: []
  };

  }

  // Convert object to query string
  objectToQueryString(params) {
  var esc = encodeURIComponent;
  var query = Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k] !== undefined ? params[k] : ""))
      .join("&");

  return query;
  }



  fetchData() {
    // this.setState(function(prevState, props){
    //   return { unfinishedTasks: ps.unfinishedTasks + 1 }
    // });
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));


    Api.getUsersDataFromDB()
      .then((res)=>{
      res = res.data;
      this.setState(ps => ({
            items: res,
            unfinishedTasks: ps.unfinishedTasks - 1,
            wholeDataLength: res.length
        }));
    })
  }

  componentDidMount() {
  this.fetchData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
  this.fetchData();
  }


  getPageTitle() {
    return 'All users';
  }
  
  getItemUser(item) {
    if(item.status === 'active') 
      return <ItemUser key={item.id} item={item} />
    return null
  }
  
  render() {
    if (this.state.items === "hacker....") {
      alert(this.state.items)
      this.props.history.push("/login");
      return null
    }
    return (
      <div
        style={{
          display: "flex",
          padding: 10,
          flexDirection: "column",
          height: "100%"
        }}
      >
        <div className="product-list-header">
          <div className="online-shop-title" style={{ flexGrow: 1 }}>
            {this.getPageTitle()}
          </div>
          <Button
              style={{ marginLeft: 20 }}
              variant="outlined"
              color="primary"
              onClick={() => {
                this.props.history.push("/AddNewUser");
              }}
            >
              Add New User
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          {this.state.unfinishedTasks !== 0 ? (
            <CircularProgress className="circular" />
          ) : (
            this.state.items.map(item => this.getItemUser(item))
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {}
};

export default withRouter(connect(mapStateToProps)(UserCRUD));
//  

// export default withRouter(connect(mapStateToProps)(ConnectedHeader));
