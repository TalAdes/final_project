import React, { Component } from "react";
import "./Menu.css";
import { NavLink } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { dataForRenderingMenu } from "../../Data";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { loadCSS } from "fg-loadcss/src/loadCSS";
import Icon from "@material-ui/core/Icon";

const mapStateToProps = state => {
  return {
    showUserMenu: state.showUserMenu,
    checkedOutItems: state.checkedOutItems,
    loggedInUser: state.loggedInUser
  };
};


class ConnectedMenu extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      // Keep track of expanded title items in menu
      // reducer: arry.reduce(func(accu,current),current)
      expandedItems: dataForRenderingMenu.reduce((accum, current) => {
        if (current.type === "title") {
          accum[current.id] = true;
        }
        return accum;
      }, {}),
      menuItems:dataForRenderingMenu
    };
  }

  componentDidMount() {
    loadCSS("https://use.fontawesome.com/releases/v5.1.0/css/all.css");
  }

  render() {
    if (!this.props.showUserMenu) return null;
    return (
      <div className="menu">
        here the user menu suppose to be
        somthing like: my orders etc...
      </div>
    );
  }
}
const Menu = withRouter(connect(mapStateToProps)(ConnectedMenu));
export default Menu;
