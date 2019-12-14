import React, { Component } from "react";
import { loadReCaptcha } from 'react-recaptcha-google'
import "./App.css";
import Header from "./Components/Header/Header.js";
import ProductList from "./Components/ProductList/ProductList";
import { Switch, Route } from "react-router-dom";
import Menu from "./Components/Menu/Menu";
import CartDialog from "./Components/CartDialog/CartDialog";
import Details from "./Components/Details/Details";
import UserDetails from "./Components/Details/UserDetails";
import FlowerDetails from "./Components/Details/FlowerDetails";
import Order from "./Components/Order/Order";
import UserCRUD from "./Components/UserCRUD/UserCRUD";
import AddNewUser from "./Components/UserCRUD/AddNewUser";
import AddNewFlower from "./Components/FlowerCRUD/AddNewFlower";
import FlowerCRUD from "./Components/FlowerCRUD/FlowerCRUD";
import Login from "./Components/Login/Login";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import Signup from "./Components/Signup/join_us";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Footer from "./Components/Footer/Footer";
import Chat from './Chat/components/Chat/Chat';
import Join from './Chat/components/Join/Join';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  showCartDlg,
  setLoggedInUser,
  setLoggedInUserRole,
  setCartItems
} from "./Redux/Actions";
import axios from 'axios'
import SelfDetails from "./Components/Details/SelfDetails";




const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    loggedInUserRole: state.loggedInUserRole
  };
};




class App extends Component {
  
  componentDidMount() {
    loadReCaptcha();
    axios.get('/is_loged') 
        .then(isLoged =>{ 
          isLoged = isLoged.data
          if(!isLoged){
            this.props.dispatch(setLoggedInUser(null))
            this.props.dispatch(setLoggedInUserRole(null))
            this.props.dispatch(showCartDlg(false))
            this.props.dispatch(setCartItems([]))
          }
        })
  }
  
  render() {
    if (!this.props.loggedInUser) {
      this.props.dispatch(setCartItems([]))
      // this.props.history.push('/login')
      // return
    }
    return (

        <div className="app">
          <Header />
          <div className="app-body">
            <Menu />
            <div className="content">
              <CartDialog />
              {/* changing container */}
              <Switch>
                <Route path="/chat/chat" component={Chat} />
                <Route path="/chat/join" component={Join} />
                <Route path="/search/" component={ProductList} />
                <Route path="/" exact component={ProductList} />
                <Route path="/AddNewUser" exact component={AddNewUser} />
                <Route path="/AddNewFlower" exact component={AddNewFlower} />
                <Route path="/user_CRUD" exact component={UserCRUD} />
                <Route path="/flower_CRUD" exact component={FlowerCRUD} />
                <Route path="/users/UserDetails/:id" component={UserDetails} />
                <Route path="/flowers/FlowerDetails/:id" component={FlowerDetails} />
                <Route path="/details/:id" component={Details} />
                <Route path="/about" render={() => <div>About us</div>} />
                <Route path="/info" render={() => <div>info</div>} />
                <Route path="/login" component={Login} />
                <Route path="/reset_password" component={ResetPassword} />
                <Route path="/join_us" component={Signup} />
                <ProtectedRoute path="/order" component={Order} />
                <ProtectedRoute path="/my_area" component={SelfDetails} />
                <Route
                  component={() => (
                    <div style={{ padding: 20 }}>Page not found</div>
                  )}
                />
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
      )
  }
}
export default withRouter(connect(mapStateToProps)(App));
// export default App;
