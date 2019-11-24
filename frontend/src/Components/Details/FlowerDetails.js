import InputAdornment from '@material-ui/core/InputAdornment';
import React, { Component } from "react";
import "./Details.css";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../../Api";
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { withRouter } from "react-router-dom";

const mapStateToProps = state => {
  return {   
    loggedInUserRole : state.loggedInUserRole
  }}


class FlowerDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: undefined,
      unfinishedTasks: 0,
      quantity : "",
      price :"",
      description : ""
    };
  }

  fetchProductUsingID(id) {
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    Api.getFlowerDataUsingID(id).then((res)=>{
      res = res.data;
      this.setState(ps => ({
            item: res,
            unfinishedTasks: ps.unfinishedTasks - 1,
            price : res.price,
            description : res.description,
            quantity : res.quantity
        }));
    })
  }

  componentDidMount() {
    this.fetchProductUsingID(this.props.match.params.id);
  }

  render() {
    if (this.state.item === "hacker....") {
      alert(this.state.item)
      this.props.history.push("/login");
      return null
    }

    if (this.state.item === undefined || this.state.unfinishedTasks !== 0) {
      return <CircularProgress className="circular" />;
    }

    return (
    (this.props.loggedInUserRole === 'admin' || this.props.loggedInUserRole === 'worker')
    ? 
      (<div className="details" style={{ padding: 10 }}>
        {/* title of user */}
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
        
        {/* img and details */}
        <div style={{ display: "flex" }}>
          
          {/* img */}
          <div
            style={{
              width: 100,
              height: 180,
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
          
          {/* details */}
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              display: "flex",
              flexDirection: "column"
            }}
          >

          {/* id,name,color is Uneditable */}
          <TextField
            label="id"
            disabled="true"
            type="text"
            value={this.state.item.id}
            style={{ marginTop: 20 , marginBottom: 20 , width: '200px' 
            }}
          />
          <TextField
            label="name"
            disabled="true"
            type="text"
            value={this.state.name}
            style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
            
            onChange={e => {
              this.setState({ name : e.target.value});
            }}
          />
          <TextField
            label="color"
            disabled="true"
            type="text"
            value={this.state.color}
            style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
            
            onChange={e => {
              this.setState({ name : e.target.value});
            }}
          />

          {/*price,description,quantity is Editable*/}
          
          <TextField
            label="price"
            type="text"
            value={this.state.price}
            InputProps={{
              endAdornment: <InputAdornment position="end">$</InputAdornment>,
            }}            
            style={{ marginTop: 20, marginBottom: 20, width: 50 }}
            onChange={e => {
              let val = parseInt(e.target.value);
              if (val < 1){
                this.setState({ price: '1' });
              }
              else if (isNaN(val)) {
                this.setState({ price: '3' });
              } else {
                this.setState({ price: val.toString() }); 
              }
            }}
          />

          <TextField
            label="quantity"
            type="text"
            value={this.state.quantity}
            style={{ marginTop: 20, marginBottom: 20, width: 50 }}
            onChange={e => {
              let val = parseInt(e.target.value);
              if (val < 1){
                this.setState({ quantity: '1' });
              }
              else if (isNaN(val)) {
                this.setState({ quantity: '3' });
              } else {
                this.setState({ quantity: val.toString() }); 
              }
            }}
          />
        
          <TextField
            label="description"
            type="text"
            value={this.state.description}
            style={{ marginTop: 20 , marginBottom: 20 , maxWidth: '600px' }}
            multiline
            onChange={e => {
              this.setState({ description: e.target.value });
            }}
          />


          
          {
            (!this.state.price.replace(/\s/g, '').length || 
            !this.state.quantity.toString().replace(/\s/g, '').length || 
            !this.state.description.replace(/\s/g, '').length)
            &&
            (<div style={{ color: "red" }}> description and price and quantity cant be empty</div>)
          }


          {/* save button */}
          <Button
            style={{ width: 200, marginTop: 5 }}
            disabled={
              !this.state.price.replace(/\s/g, '').length || 
              !this.state.quantity.toString().replace(/\s/g, '').length || 
              !this.state.description.replace(/\s/g, '').length
            }
            color="primary"
            variant="contained"
            onClick={() => {
              this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));
              var temp = this.state.item
              temp.price = this.state.price
              temp.quantity = this.state.quantity
              temp.description = this.state.description
              Api.updateFlowerDataToDB(temp).then((res)=>{
                res = res.data;
                this.setState(ps => ({
                      item: res,
                      unfinishedTasks: ps.unfinishedTasks - 1,
                  }));
              })
            }}
          >
            save <SaveAltIcon style={{ marginLeft: 5 }} />
          </Button>
          
          {/* delete button */}
          <Button
            style={{ width: 200, marginTop: 5 }}
            color="primary"
            variant="contained"
            onClick={() => {
              this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));
              Api.deleteFlowerData(this.state.item).then((res)=>{
                if (res.data) {
                  alert(res.data)
                  this.props.history.push("/flower_CRUD");
                  return
                }
                res = res.data;
                this.setState(ps => ({
                      item: res,
                      unfinishedTasks: ps.unfinishedTasks - 1,
                  }));
              })
            }}
          >
            delete <DeleteIcon style={{ marginLeft: 5 }} />
          </Button>
          
          
          
          
          </div>
              
          {/* every that i will put down will be in right */}

          
        </div>
      </div>
    )
    :
    (null)
    )
  }
}

export default withRouter(connect(mapStateToProps)(FlowerDetails));