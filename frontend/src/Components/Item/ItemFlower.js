import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

const mapStateToProps = state => {
  return {   
    loggedInUserRole : state.loggedInUserRole
  }}


class ConnectedItem extends Component {
  render() {
    return (
      <Card
        style={{ width: 200, height: 270, margin: 10, display: "inline-block" }}
      >
        <CardActionArea
          onClick={() => {
            this.props.history.push("/flowers/FlowerDetails/" + this.props.item.id);
          }}
        >
          <CardMedia
            style={{ height: 140 }}
            image={"/"+this.props.item.src}
          />
          <CardContent style={{ height: 50 }}>
            <div
              style={{
                marginLeft: 5,
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {this.props.item.name}
            </div>
            <div style={{ margin: 5 }}>Quantity: {this.props.item.quantity}</div>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withRouter(connect(mapStateToProps)(ConnectedItem));
