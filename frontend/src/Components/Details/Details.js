import React, { Component } from "react";
import "./Details.css";
import Button from "@material-ui/core/Button";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import CircularProgress from "@material-ui/core/CircularProgress";
import { addItemInCart } from "../../Redux/Actions";
import Api from "../../Api";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { withRouter } from "react-router-dom";

var Remarkable = require("remarkable");

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
    loggedInUserRole: state.loggedInUserRole
  };
};


class ConnectedDetails extends Component {
  constructor(props) {
    super(props);

    this.isCompMounted = false;

    this.state = {
      quantity: "1",
      item: {quantity : 2},
      unfinishedTasks: 0
    };
  }

  async fetchProductUsingID(id) {
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    // First, let's get the item, details of which we want to show.
    Api.getItemUsingID(id).then(item =>{
      if (this.isCompMounted) {
        this.setState(ps => {
          return {
            item,
            unfinishedTasks: ps.unfinishedTasks - 1,
          };
        });
      }
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.fetchProductUsingID(nextProps.match.params.id);
  }

  componentDidMount() {
    this.isCompMounted = true;
    this.fetchProductUsingID(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.isCompMounted = false;
  }

  // Product information contains markup, we use Remarkable for this.
  getRawMarkup(data) {
    const md = new Remarkable();
    return { __html: md.render(data) };
  }


  render() {
    if (this.state.unfinishedTasks !== 0) {
      return <CircularProgress className="circular" />;
    }

    if (!this.state.item) {
      return null;
    }



    return (
      <div className="details" style={{ padding: 10 }}>
        <div
          style={{
            color: "#504F5A",
            marginTop: 15,
            marginBottom: 20,
            fontSize: 22
          }}
        >
          {this.state.item.name}
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: 290,
              height: 290,
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 40,
              paddingRight: 40,
              border: "1px solid lightgray",
              borderRadius: "5px"
            }}
          >
          <img
            alt=""
            style={ { height: '100%', width: '100%'}}
            src={"/" + this.state.item.src}
          />  
          </div>
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{ fontSize: 18, marginTop: 10 }}>
              Price: {this.state.item.price} $
            </div>
            {this.state.item.hot === true && (
              <span style={{ color: "#1a9349", marginTop: 5, fontSize: 14 }}>
                hot product
              </span>
            )}

            { this.props.loggedInUser !== null ? 
              (
              <TextField
                type="text"
                value={this.state.quantity}
                style={{ marginTop: 20, marginBottom: 20, width: 50 }}
                label="Quantity"
                onChange={e => {
                  let val = parseInt(e.target.value);
                  if (val < 1 || val > this.state.item.quantity) return this.setState({ quantity: this.state.item.quantity.toString() });
                  this.setState({ quantity: val.toString() });
                }}
              />
              )
              :
              (null)
            }

            { this.props.loggedInUserRole === 'subscriber' ? 
              (
              <Button
                style={{ width: 200, marginTop: 5 }}
                color="primary"
                variant="contained"
                onClick={() => {
                  this.props.dispatch(
                    addItemInCart({
                      ...this.state.item,
                      quantity: parseInt(this.state.quantity)
                    })
                  );
                  Api.addItemInCartMongoDB({
                    ...this.state.item,
                    quantity: parseInt(this.state.quantity)
                  }).then(()=> {
                    alert('item added succesfully')
                    this.props.history.push("/");
                  })
                }}
              >
                Add to Cart <AddShoppingCartIcon style={{ marginLeft: 5 }} />
              </Button>
              )
              :
              (null)
            }
            
          </div>
        </div>

        <div
          style={{
            color: "#504F5A",
            marginTop: 50,
            marginBottom: 10,
            fontSize: 22
          }}
        >
          Product Description
        </div>


        <span style={{ color: "#gray", marginTop: 5, fontSize: 13 }}>
        {this.state.item.description}
        </span>

        
      </div>
    );
  }
}

const Details = withRouter(connect(mapStateToProps)(ConnectedDetails));
export default Details;
