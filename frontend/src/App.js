import React, { Component } from "react";
import "./App.css";
import Header from "./Components/Header/Header.js";
import ProductList from "./Components/ProductList/ProductList";
import { Switch, Route } from "react-router-dom";
import Menu from "./Components/Menu/Menu";
import UserMenu from "./Components/Menu/UserMenu";
import CartDialog from "./Components/CartDialog/CartDialog";
import Details from "./Components/Details/Details";
import Order from "./Components/Order/Order";
import Login from "./Components/Login/Login";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import Signup from "./Components/Signup/join_us";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Footer from "./Components/Footer/Footer";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Menu />
          <div className="content">
            <CartDialog />
            {/* changing container */}
            <Switch>
              <Route path="/search/" component={ProductList} />
              <Route path="/" exact component={ProductList} />
              <Route path="/details/:id" component={Details} />
              <Route path="/about" render={() => <div>About us</div>} />
              <Route path="/login" component={Login} />
              <Route path="/reset_password" component={ResetPassword} />
              <Route path="/join_us" component={Signup} />
              <ProtectedRoute path="/order" component={Order} />
              <Route
                component={() => (
                  <div style={{ padding: 20 }}>Page not found</div>
                )}
              />
            </Switch>
          </div>
          <UserMenu/>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
