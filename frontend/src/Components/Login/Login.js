import React, { Component } from "react";
import { ReCaptcha } from 'react-recaptcha-google'
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser, setLoggedInUserEmail, setLoggedInUserRole ,setCartItems} from "../../Redux/Actions";

import "./Login.css";
import Api from "../../Api";



const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
  };
};


class ConnectedLogin extends Component {
  
  constructor(props, context) {
    super(props, context);
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.state = {
      userName: "",
      pass: "",
      captcha: false,
      redirectToReferrer: false
    };
  }
  componentDidMount() {
    if (this.captchaVerify) {
        console.log("started, just a second...")
        this.captchaVerify.reset();
    }
  }
  onLoadRecaptcha() {
      if (this.captchaVerify) {
          this.captchaVerify.reset();
      }
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  verifyCallback(recaptchaToken) {
    // Here you will get the final recaptchaToken!!!  
    //i think to disable button till now
    this.setState({captcha : true})
    this.sleep(35000).then(()=>{
      if(!this.props.loggedInUser){// only if no one is logged in....
        this.captchaVerify.reset();
        this.setState({captcha : false})
      }
    })
  }


  render() {
    // Don't working...
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    // If user was authenticated, redirect her to where she came from.
    if (this.state.redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    // else, render login form
    return (
      <div className="login-container">
        <div
          style={{
            height: 200,
            width: 304,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              color: "#504F5A",
              marginBottom: 50,
              fontSize: 26,
              textAlign: "center"
            }}
          >
            Log in
          </div>
          <TextField
            placeholder="User name"
            value={this.state.userName}
            onChange={e => {
              this.setState({ userName: e.target.value });
            }}
          />
          <TextField
            placeholder="Password"
            style={{ marginTop: 10,marginBottom: 10 }}
            value={this.state.pass}
            type="password"
            onChange={e => {
              this.setState({ pass: e.target.value });
            }}
          />
          


          {window.grecaptcha ? (<ReCaptcha
            style={{ marginTop: 10 }}
            ref={(el) => {this.captchaVerify = el;}}
            size="normal"
            data-theme="dark"            
            render="explicit"
            sitekey="6LecVsQUAAAAACLHjV6xn_JgA6Tvon_mFXADdSeD"
            onloadCallback={this.onLoadRecaptcha}
            verifyCallback={this.verifyCallback}
          />) : (null)}
          


          <Button
            style={{ marginTop: 10 }}
            disabled={  !this.state.userName.toString().replace(/\s/g, '').length ||
                        !this.state.pass.toString().replace(/\s/g, '').length ||
                        !this.state.captcha
                      }
            variant="outlined"
            color="primary"
            onClick={() => {
              // Authenticate the user using entered credentials.
              Auth.authenticate(this.state.userName, this.state.pass, user => {
                console.log("how user looks like in frontend");
                console.log("user:");
                console.log(user);
                if (!user.isAuthenticated) {
                  // Authentication failed.
                  this.setState({ wrongCred: true });
                  return;
                }

                // If we get here, authentication was success.
                this.props.dispatch(setLoggedInUser( user.name ));
                this.props.dispatch(setLoggedInUserEmail(user.email));
                this.props.dispatch(setLoggedInUserRole(user.role));
                Api.getCartItemsMongoDB()
                  .then((res)=>
                this.props.dispatch(setCartItems(res.data)))
                this.setState(() => ({
                  redirectToReferrer: true
                }));
              });
            }}
          >
            Log in
          </Button>
          
          <Button
            style={{ marginTop: 10 }}
            variant="outlined"
            color="primary"
            onClick={() => {
              // Authenticate the user using entered credentials.
              Auth.forgotPassword(this.state.userName, message => {
                alert(message)
              });
            }}
          >
            Forgot your password?
          </Button>

          {this.state.wrongCred && (
            <div style={{ color: "red" }}>Wrong username and/or password</div>
          )}
        </div>
      </div>
    );
  }
}
const Login = withRouter(connect(mapStateToProps)(ConnectedLogin));

export default Login;
