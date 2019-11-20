import React, { Component } from "react";
import "./UserCRUD.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ItemUser from "../Item/ItemUser";
import CircularProgress from "@material-ui/core/CircularProgress";
// import "./ProductList.css";
import queryString from "query-string";
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

  this.getParamFromQS = this.getParamFromQS.bind(this);
  this.updateURLAndRedirect = this.updateURLAndRedirect.bind(this);
  }

  // Convert object to query string
  objectToQueryString(params) {
  var esc = encodeURIComponent;
  var query = Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k] !== undefined ? params[k] : ""))
      .join("&");

  return query;
  }

  // This function is used to update the query string with new values
  // and redirect to new URL.
  updateURLAndRedirect(newValues, restartPaging) {
  let currentQs = queryString.parse(this.props.location.search);
  let newQS = { ...currentQs, ...newValues };

  if (restartPaging) {
      delete newQS["page"];
  }

  this.props.history.push("/search/?" + this.objectToQueryString(newQS));
  }

  // Extract value of certain parameter from query string.
  getParamFromQS(name, props = this.props) {
  let qs = queryString.parse(props.location.search);

  switch (name) {
      case "category":
      return qs.category || "popular";
      case "term":
      return qs.term || "";
      case "page":
      return qs.page || "1";
      case "minPrice":
      return qs.minPrice || "0";
      case "maxPrice":
      return qs.maxPrice || "1000";
      case "usePriceFilter":
      return qs.usePriceFilter === "true";
      case "sortValue":
      return qs.sortValue || "lh";
      case "itemsPerPage":
      return qs.itemsPerPage || "5";
      case "directCategoryClick":
      return qs.term === undefined;
      default:
      return undefined;
  }
  }

  fetchData() {
    // this.setState(function(prevState, props){
    //   return { unfinishedTasks: ps.unfinishedTasks + 1 }
    // });
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    var x = Api.getUsersDataFromDB;

    return x.then((res)=>{
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

  handleSortChange = e => {
  this.updateURLAndRedirect({ sortValue: e.value });
  };

  getPageTitle() {
  let pageTitle;
  if (this.getParamFromQS("category") === "popular") {
      pageTitle = "Popular products";
  } else if (this.getParamFromQS("directCategoryClick")) {
      pageTitle = this.getParamFromQS("category");
  } else {
      pageTitle = "Search results";
  }
  return pageTitle;
  }
  
  render() {
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
        </div>
        <div style={{ flex: 1 }}>
          {this.state.unfinishedTasks !== 0 ? (
            <CircularProgress className="circular" />
          ) : (
            this.state.items.map(item => {
              return <ItemUser key={item.id} item={item} />;
            })
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = () => {
  return {}
};

export default UserCRUD= withRouter(connect(mapStateToProps)(UserCRUD));
//  

// export default withRouter(connect(mapStateToProps)(ConnectedHeader));
