import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { setCheckedOutItems ,setCartItems } from "../../Redux/Actions";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast } from "react-toastify";
import Api from "../../Api";


const mapStateToProps = state => {
  return {
    checkedOutItems: state.checkedOutItems,
    userEmail: state.loggedInUserEmail
  };
};



// This component shows the items user checked out from the cart.
class ConnectedOrder extends Component {
  constructor(props) {
    super(props);
      this.state = {
        totalPrice: 0,
      };

      this.handleToken = this.handleToken.bind(this);
    }
  
  async handleToken(token, addresses){
    
    

    var product = {
      name: "Michael's and Tal's Flowers LTD",
      price: this.state.totalPrice*100,
      description: this.props.checkedOutItems.map((item, index) => {
        return (
            item.name
        );
      })
    }

    const response = await axios.post(
      "/cart/checkout",
      { token, product }
    );
    const { status } = response.data;
    console.log("Response:", response.data);
    if (status === "success") {
      toast("Success! Check email for details", { type: "success" });
      this.props.dispatch(setCheckedOutItems([]));
      this.props.dispatch(setCartItems([]));
      Api.setCartItemsMongoDB([])
    } else {
      toast("Something went wrong", { type: "error" });
    }
  }
  
  render() {
    let totalPrice = this.props.checkedOutItems.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, 0);
    if (this.state.totalPrice === 0 && this.props.checkedOutItems.length !==0) {
      this.setState({totalPrice})
    }

    return (
      <div style={{ padding: 10 }}>
        <div className="online-shop-title">
          Please review order before purchase
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.checkedOutItems.map((item, index) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div
          // style={{
          //   color: "#504F5A",
          //   marginLeft: 5,
          //   marginTop: 50,
          //   fontSize: 22
          // }}
        >
          Total price: {totalPrice} $
        </div>
        
        <Button
          color="secondary"
          variant="outlined"
          disabled={totalPrice === 0}
          onClick={() => {
            this.props.dispatch(setCheckedOutItems([]));
          }}
        >
          Discard
        </Button>
      {/* <StripPayment that={this} /> */}
        <div onClick={() => {
          // setTimeout(
          //   () =>
          //     {
          //       this.props.dispatch(setCheckedOutItems([]));
          //       this.props.dispatch(setCartItems([]));
          //       Api.setCartItemsMongoDB([])
          //     }
          // ,3000);
        }}>

          <StripeCheckout
            stripeKey="pk_test_5vKC2C8nXDr2zF7U4fAUk0j60045VLH3vN"
            token={this.handleToken}
            amount={totalPrice*100}
            name="Happy Flowers LTD"
            email={this.props.userEmail}
            shippingAddress
            />
        </div>
      </div>
    );
  }
}
const Order = withRouter(connect(mapStateToProps)(ConnectedOrder));

export default Order;
