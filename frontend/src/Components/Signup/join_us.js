import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";

import "./join_us.css";

class ConnectedJoin_us extends Component {
  state = {
    userName: "",
    pass: "",
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
      <div className="login-container">
        <div
          style={{
            height: 200,
            width: 200,
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
            Join US
          </div>
          <TextField
            value={this.state.userName}
            placeholder="User name"
            onChange={e => {
              this.setState({ userName: e.target.value });
            }}
          />
          <TextField
            value={this.state.pass}
            type="password"
            placeholder="Password"
            onChange={e => {
              this.setState({ pass: e.target.value });
            }}
          />
          <Button
            style={{ marginTop: 10 }}
            variant="outlined"
            color="primary"
            onClick={() => {
              // Authenticate the user using entered credentials.
              Auth.register(this.state.userName, this.state.pass, user => {
                // registeration failed.
                if (!user) {
                  this.setState({ wrongCred: true });
                  return;
                }

                // If we get here, authentication was success.
                this.props.dispatch(setLoggedInUser({ name: user.name }));
                this.setState(() => ({
                  redirectToReferrer: true
                }));
              });
            }}
          >
            join
          </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>Wrong username and/or password</div>
          )}
        </div>
      </div>
    );
  }
}
const Join_us = withRouter(connect()(ConnectedJoin_us));

export default Join_us;
