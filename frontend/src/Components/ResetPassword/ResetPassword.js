import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";
import queryString from "query-string";
import "./ResetPassword.css";

class ResetPassword extends Component {
  state = {
    pass_1: "",
    pass_2: "",
    redirectToReferrer: false
  };
  render() {
    // Don't working...
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    // If user was authenticated, redirect her to where she came from.
    if (this.state.redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div className="reset-container">
        <div
          style={{
            height: 200,
            width: 220,
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
            Change your password
          </div>
          <TextField
            value={this.state.pass_1}
            placeholder="Password"
            onChange={e => {
              this.setState({ pass_1: e.target.value });
            }}
          />
          <TextField
            value={this.state.pass_2}
            type="password"
            placeholder="Please repeat your password"
            onChange={e => {
              this.setState({ pass_2: e.target.value });
            }}
          />
          <Button
            style={{ marginTop: 10 }}
            variant="outlined"
            color="primary"
            onClick={() => {
              // Authenticate the user using entered credentials.
              if (this.state.pass_1 != this.state.pass_2) {
                this.setState({ wrongCred: true });
                  return;
              } else {
                
                const parsed = queryString.parseUrl(window.location.href);
                console.log('parsed');
      
                Auth.resetPassword(parsed.query.token, this.state.pass_1, isReseted => {
                  //there is no reason to send both passwords because in this stage the pass' should be equal
                  //maybe the token is expired
                  if (isReseted) {
                    alert("your password was changed succesfuly")
                    this.props.history.push("/search");
                  }
                  else{
                    alert("your reset link was expired please generate a new one")
                  }
                });
              }

            }}

          >
            change password
          </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>Wrong username and/or password</div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(connect()(ResetPassword));

