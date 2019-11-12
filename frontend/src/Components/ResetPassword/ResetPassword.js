import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";

import "./join_us.css";

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
            value={this.state.pass_1}
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
              Auth.register(req.query.token, this.state.pass_1, this.state.pass_2, user => {
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
            change password
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(connect()(ResetPassword));

