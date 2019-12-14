import React, { Component } from "react";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import "./Header.css";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Badge from "@material-ui/core/Badge";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  showCartDlg,
  toggleMenu,
  setLoggedInUser,
  setLoggedInUserEmail,
  setLoggedInUserRole,
  setCheckedOutItems
} from "../../Redux/Actions";
import logo from "../../Images/logo2.png";
import Auth from "../../Auth";
import Person from "@material-ui/icons/PersonOutline";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Tooltip } from "@material-ui/core";
import Api from "../../Api";
import axios from 'axios'

const mapStateToProps = state => {
  return {
    numberOfItemsInCart: state.cartItems.length,
    loggedInUser: state.loggedInUser,
    loggedInUserRole: state.loggedInUserRole
  };
};

class ConnectedHeader extends Component {
  state = {
    searchTerm: "",
    anchorEl: null,
    categoryFilter: [],
    categoryOptions : []
  };


  componentDidMount() {
    axios.get('/is_loged') 
        .then(isLoged =>{ 
          isLoged = isLoged.data
          if(!isLoged){
            this.props.dispatch(setLoggedInUser(null))
            this.props.dispatch(setLoggedInUserRole(null))
          }
        })
    Api.filterData()
      .then(res => res.data)
        .then(res => {
          var categoryOptions = res.map(x => {
            return (
              <MenuItem key={x.name} value={x.name}>
                {x.name}
              </MenuItem>
            );
      })
          this.setState({categoryOptions,categoryFilter:res[0].name})}
      )
  }
  render() {
    let { anchorEl } = this.state;
    // force logout
    // this.props.dispatch(setLoggedInUser(null))
    return (
      <AppBar
        position="static"
        style={{ backgroundColor: "#FAFAFB", height: 80 }}
      >
        <Toolbar style={{ height: "100%" }}>
          <div className="left-part">
            <IconButton
              onClick={() => {
                this.props.dispatch(toggleMenu());
              }}
            >
              {/* menuIcon is a registered word for a specific icon, i can use <img> in order to choose other img */}
              <MenuIcon size="medium" />
            </IconButton>

            <img
              src={logo}
              alt={"Logo"}
              style={{ marginLeft: 10 }}
              width="64"
              height="64"
            />
            <TextField
              label="Search products"
              value={this.state.searchTerm}
              onChange={e => {
                this.setState({ searchTerm: e.target.value });
              }}
              style={{ marginLeft: 40, width: 250, paddingBottom: 14 }}
            />

            <Select
              style={{ maxWidth: 200, marginTop: 1, marginLeft: 20 }}
              value={this.state.categoryFilter}
              MenuProps={{
                style: {
                  maxHeight: 500
                }
              }}
              onChange={e => {
                this.setState({ categoryFilter: e.target.value });
              }}
            >
              {this.state.categoryOptions}
            </Select>

            <Button
              style={{ marginLeft: 20 }}
              variant="outlined"
              color="primary"
              onClick={() => {
                // Generate new URL to redirect user to
                this.props.history.push(
                  "/search/?category=" +
                    this.state.categoryFilter +
                    "&term=" +
                    this.state.searchTerm
                );
              }}
            >
              Search
            </Button>



            <Button
              style={{ marginLeft: 20 }}
              variant="outlined"
              color="primary"
              onClick={() => {
                Api.tryyyy().then(x => console.log(x))
                Api.tryyyy().then(x => console.log(x))
                // Api.whoIsLoged().then(x => alert(x.data))
                // Api.getMyLastOrders().then(x => console.log(x.data))
              //   axios.get('/chat/get_PK_and_random').then(res => {
              //     alert(res)})
            }}
            >
              TEST fetch data from db
            </Button>




          </div>
          <div className="right-part">
            {!this.props.loggedInUser ? 
            (
              <div style={{ display: "inline-block"}}>
                <Button
                  variant="outlined"
                  style={{ marginRight: 20 }}
                  color="primary"
                  onClick={() => {
                    this.props.history.push("/login");
                  }}
                >
                  Log in
                </Button>

                <Button
                    variant="outlined"
                    style={{ marginRight: 20 }}
                    color="primary"
                    onClick={() => {
                      this.props.history.push("/join_us");
                    }}
                  >
                    join us
                  </Button>
              </div>
            ) : (
              <Avatar
                onClick={event => {
                  this.setState({ anchorEl: event.currentTarget });
                }}
                style={{ backgroundColor: "#3f51b5",marginRight: 20}}
              >
                <Person />
              </Avatar>
            )}
            { this.props.loggedInUserRole === 'subscriber' ? 
              (<Tooltip title="Cart">
                <IconButton
                  aria-label="Cart"
                  style={{marginRight: 20}}
                  tooltip="sd"
                  onClick={() => {
                    this.props.dispatch(showCartDlg(true));
                  }}
                  >
                  <Badge badgeContent={this.props.numberOfItemsInCart} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              )
              :
              (null)
            }
            <Menu
            // this are menu simple definitions, don't need to break the head
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => {
                this.setState({ anchorEl: null });
              }}
            >

              {/* {(this.props.loggedInUserRole === 'worker' || this.props.loggedInUserRole === 'admin') ? */}
              {(this.props.loggedInUserRole === 'admin'||this.props.loggedInUserRole === 'worker') ?
              (<MenuItem
                onClick={() => {
                  this.setState({ anchorEl: null });
                  this.props.history.push("/user_CRUD");
                }}
              >
                Users
              </MenuItem>
              ):(null)}
              {(this.props.loggedInUserRole === 'admin'||this.props.loggedInUserRole === 'worker') ?
              (<MenuItem
                onClick={() => {
                  this.setState({ anchorEl: null });
                  this.props.history.push("/flower_CRUD");
                }}
              >
                Warehouse
              </MenuItem>
              ):(null)}
              <MenuItem
                onClick={() => {
                  this.setState({ anchorEl: null });
                  this.props.history.push("/my_area");
                }}
              >
                My area
              </MenuItem>
              <MenuItem
                onClick={() => {
                      alert('now we supose to move to Blog')
                      //push...
                }}
              >
                Blog
              </MenuItem>
            
              <MenuItem
                onClick={() => {
                  alert('now we supose to move to Chat')
                  //push...
                }}
              >
                Chat
              </MenuItem>
            
              <MenuItem
                onClick={() => {
                  Auth.signout(problem => {
                    if(problem)
                      alert(problem)
                    else{
                      this.props.dispatch(setCheckedOutItems([]));
                      this.props.dispatch(setLoggedInUser(null));
                      this.props.dispatch(setLoggedInUserEmail(null));
                      this.props.dispatch(setLoggedInUserRole(null));
                      this.props.history.push("/");
                    }
                  });
                  this.setState({ anchorEl: null });
                }}
              >
                Logout
              </MenuItem>
            </Menu>
            
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

const Header = withRouter(connect(mapStateToProps)(ConnectedHeader));
export default Header;
// export default withRouter(connect(mapStateToProps)(ConnectedHeader));
