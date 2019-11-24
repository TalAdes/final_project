import React, { Component } from "react";
import "./Menu.css";
import { NavLink } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Api from "../../Api";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { loadCSS } from "fg-loadcss/src/loadCSS";
import Icon from "@material-ui/core/Icon";

const mapStateToProps = state => {
  return {
    showMenu: state.showMenu,
    checkedOutItems: state.checkedOutItems,
    loggedInUser: state.loggedInUser,
    menuStatus: state.menuStatus,
    loggedInUserRole: state.loggedInUserRole
  };
};


class ConnectedMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Keep track of expanded title items in menu
      // reducer: arry.reduce(func(accu,current),current)
      expandedItems: [],
      menuItems:[]
    };
  }

  componentDidMount() {
      Api.menuData()
      .then(arry =>
        {
        arry = arry.data  
        this.setState({'menuItems' : arry, 'expandedItems' : arry.reduce((accum, current) => {
          if (current.type === "title") {
            accum[current.id] = true;
          }
          return accum;
          }, {})})
        })
    
    loadCSS("https://use.fontawesome.com/releases/v5.1.0/css/all.css");
  }

  render() {
    if (!this.props.showMenu) return null;
    return (
      <div className="menu">
        {
          // filtering ti categories of the menu if its needed
          this.state.menuItems
          .filter(y => {
            // If needed, filter some menu items first.
            if (y.parentID && !this.state.expandedItems[y.parentID]) return false;
            if (y.protected && !this.props.loggedInUser) return false;
            return true;
          })
          .map((x, i) => {
            if (x.type === "item") {
              return (
                <NavLink
                  to={x.url}
                  exact
                  isActive={(_, location) => {
                
                    // If there is a query string, we have some manual way to decide which menu item is active.
                    if (location.search) {
                      let categoryFromQS = queryString.parse(location.search)
                        .category;
                      let isDirectClick =
                        queryString.parse(location.search).term === undefined;
                      return isDirectClick && x.name === categoryFromQS;
                    }
                    
                    // if chose homepage
                    return x.url === location.pathname;
                  }}
                  style={{
                    textDecoration: "none",
                    color: "rgb(32, 32, 34)",
                    marginLeft: 10
                  }}
                  key={x.id}
                  activeStyle={{
                    color: "#4282ad"
                  }}
                >
                  <div className="menuItem">
                    <Icon
                      className={x.icon}
                      style={{ fontSize: 22, width: 25, marginRight: 10 }}
                    />
                    {x.name}
                  </div>
                </NavLink>
              );
            } else if (x.type === "title") {
              return (
                <div
                  key={x.id}
                  className="menuTitle"
                  onClick={() => {
                    console.log(this.state);
                    this.setState(ps => {
                      return {
                        expandedItems: {
                          ...ps.expandedItems,
                          [x.id]: !ps.expandedItems[x.id]
                        }
                      };
                    });
                    console.log("this.state");
                    console.log(this.state);
                  }}
                >
                  <span style={{ flex: 1 }}>{x.name}</span>
                  {this.state.expandedItems[x.id] ? <ExpandLess /> : <ExpandMore />}
                </div>
              );
            }

            return null;
          })}
      </div>
    );
  }
}
const Menu = withRouter(connect(mapStateToProps)(ConnectedMenu));
export default Menu;
