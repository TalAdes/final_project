import Button from "@material-ui/core/Button";
import React, { Component } from "react";
import "./FlowerCRUD.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
// import "./ProductList.css";
import queryString from "query-string";
import Api from "../../Api";
import ItemFlower from "../Item/ItemFlower";

class FlowerCRUD extends Component {
  constructor(props) {
  super(props);

  this.state = {
      unfinishedTasks: 0,
      openPriceDialog: false,
      wholeDataLength: null,
      items: []
  };

  this.getParamFromQS = this.getParamFromQS.bind(this);
  }

  // Convert object to query string
  objectToQueryString(params) {
  var esc = encodeURIComponent;
  var query = Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k] !== undefined ? params[k] : ""))
      .join("&");

  return query;
  }

  
  // Extract value of certain parameter from query string.
  getParamFromQS(name, props = this.props) {
  let qs = queryString.parse(props.location.search);

  switch (name) {
      case "category":
      return qs.category || "hot";
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


    Api.getFlowersData()
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
    return 'Warehose mode - All flowers';
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
                this.props.history.push("/AddNewFlower");
              }}
            >
              Add New Flower
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          {this.state.unfinishedTasks !== 0 ? (
            <CircularProgress className="circular" />
          ) : (
            this.state.items.map(item => {
              return <ItemFlower key={item.id} item={item} />;
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

export default withRouter(connect(mapStateToProps)(FlowerCRUD));