import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import InputAdornment from '@material-ui/core/InputAdornment';
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddAPhoto from "../../Images/add_photo_alternate-24px.svg";
import DeleteAPhoto from "../../Images/delete_forever-24px.svg";
import "./AddNewFlower.css";

class ConnectedAddNewFlower extends Component {
  state = {
    name          : "",
    price         : "",
    color         : "",
    quantity      : "",
    hot           : "",
    description   : "",
    category      : "",
    status        : "not deleted",
    image_url     : "",
    image         : [],
    redirectToReferrer: false
  };

  my_upload = e => {
    console.log('my upload');
    const files = e.target.files
    console.log('files');
    console.log(files);

    const formData = new FormData()
    formData.append('file',files[0])
    
    for (var key of formData.entries()){
      console.log(key[0]+" "+key[1])
    }

    this.setState({ 
      'image' : formData
    })
  }

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
            Add New Flower
          </div>
        
          
          <div className='image-part'>
            <label htmlFor='single'>
              <img src={AddAPhoto} title="add local image" alt='' color='#3B5998' size='10x' onClick= {() => this.setState({image_url : ""})} />
            </label>
            
            <label>
              <img src={DeleteAPhoto} title="remove local image choice" alt='' color='#3B5998' size='10x' 
              onClick= {() => this.setState({ 'image' : [] })}/>
            </label>

            <input value={this.state.image_url} style={{width:"150px"}} placeholder="Or paste here image url" type='text' id='image_url' onChange={e => this.setState ({ 'image_url': e.target.value })}/> 
          </div>
          


          {/* id,staus,category are autogenarated */}
          
          {/*price,description,quantity is Editable*/}
          
          <TextField
            label="name"
            type="text"
            value={this.state.name}
            //style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
            
            onChange={e => {
              this.setState({ name : e.target.value});
            }}
          />
          <TextField
            label="color"
            type="text"
            value={this.state.color}
            //style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
            
            onChange={e => {
              this.setState({ color : e.target.value});
            }}
          />

          <TextField
            label="price"
            InputProps={{
              endAdornment: <InputAdornment position="end">$</InputAdornment>,
            }}            
            type="text"
            value={this.state.price}
            //style={{ marginTop: 20, marginBottom: 20, width: 50 }}
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
            //style={{ marginTop: 20, marginBottom: 20, width: 50 }}
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

            onChange={e => {
              this.setState({ description: e.target.value });
            }}
          />
          
          <TextField
            label="hot (y/n)"
            type="text"
            value={this.state.hot}
            //style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
            
            onChange={e => {
              let val = e.target.value;
              switch (val) {
                case 'y':
                  this.setState({ hot : 'yes'});
                  break;
                case 'n':
                  this.setState({ hot : 'no'});
                  break;
                default:
                  this.setState({ hot: '' });
                  break;
                }
            }}
          />
          
          <Button
            //style={{ marginTop: 10 }}
            disabled={
              !this.state.name.toString().replace(/\s/g, '').length ||
              !this.state.price.toString().replace(/\s/g, '').length ||
              !this.state.color.toString().replace(/\s/g, '').length ||
              !this.state.quantity.toString().replace(/\s/g, '').length ||
              !this.state.hot.toString().replace(/\s/g, '').length ||
              !this.state.description.toString().replace(/\s/g, '').length
            }
            variant="outlined"
            color="primary"
            onClick={() => {
              const formData = new FormData()

              // fill formData with the image
              for (var key of this.state.image.entries()){
                formData.append('file',key[1])
              }

              var data = {}
                            
              data['name']=this.state.name       
              data['price']=this.state.price      
              data['color']=this.state.color      
              data['quantity']=this.state.quantity   
              if(this.state.hot === 'yes')
                data['hot']='true'        
              if(this.state.hot === 'no')
                data['hot']='false'        
              data['description']=this.state.description
              data['image_url']=this.state.image_url
              data['status']='not deleted'
              if (this.state.color.toLowerCase().includes("pink")) {
                data['category']= 'pink flowers'
              }
              else if (this.state.color.toLowerCase().includes("white")) {
                data['category']= 'white flowers'
              }
              else if (this.state.color.toLowerCase().includes("red")) {
                data['category']= 'red flowers'
              }
              else data['category']= 'other flowers'
              

              for (key in data){
                formData.append(key, data[key]);
                console.log(data[key])
              }

              Auth.addFlower(formData , flower => {
                flower = flower.data
                // registeration failed.
                if (flower.isRegisteredSuccesfully) {
                      this.props.history.push("/flower_CRUD");
                } else {
                    alert(flower.error)
                  }
              });
            }}
          >
            Add
          </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>Wrong username and/or password</div>
          )}
          <input type='file' style={{ visibility : "hidden" }} id='single' accept="image/*" onChange={this.my_upload}/> 
        </div>
      </div>
    );
  }
}
const AddNewFlower = withRouter(connect()(ConnectedAddNewFlower));

export default AddNewFlower;
