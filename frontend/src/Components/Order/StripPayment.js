import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast } from "react-toastify";
import { setCheckedOutItems ,setCartItems } from "../../Redux/Actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
//import "./styles.css";

toast.configure();

const mapStateToProps = state => {
  return {
  };
};

function Stripe() {
  const product = {
    name: "Tesla Roadster",
    price: 64998.67,
    description: "Cool car"
  }

  var handleToken = async (token, addresses) => {
    var that = this.props.that
    that.props.dispatch(setCartItems([]));
    that.props.dispatch(setCheckedOutItems([]));
    //   const response = await axios.post(
    //   "/checkout",
    //   { token, product }
    // );
    // const { status } = response.data;
    // console.log("Response:", response.data);
    // if (status === "success") {
    //   this.props.dispatch(setCartItems([]));
    //   this.props.dispatch(setCheckedOutItems([]));
    //   toast("Success! Check email for details", { type: "success" });
    // } else {
    //   toast("Something went wrong", { type: "error" });
    // }
  }

  return (
      <StripeCheckout
        stripeKey="pk_test_5vKC2C8nXDr2zF7U4fAUk0j60045VLH3vN"
        token={handleToken}
        amount={product.price * 100}
        name="Flowers"
        billingAddress
        shippingAddress
      />
  );
}

export default withRouter(connect(mapStateToProps)(Stripe));
