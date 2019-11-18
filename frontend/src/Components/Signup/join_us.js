import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../Redux/Actions";
import isEmail from 'validator/lib/isEmail';
import AddAPhoto from "../../Images/add_photo_alternate-24px.svg";
import DeleteAPhoto from "../../Images/delete_forever-24px.svg";
import "./join_us.css";

class ConnectedJoin_us extends Component {
  state = {
    email: "",
    userName: "",
    image_url: "",
    pass: "",
    redirectToReferrer: false,
    image: []
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
    

    // this.setState({ uploading: true })




    // axios({
    //   method: 'post',
    //   url: 'upload_image',
    //   data: formData,
    //   headers: {'Content-Type': 'multipart/form-data' }
    //   })
    // .then(res => console.log(res))
    // .then(images => {

    //   console.log('images:');
    //   console.log(images);
    //   this.setState({ 
    //     uploading: false,
    //     images
    //   })
    // })
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
            Join US
          </div>
          
          {/* <img src={DeleteAPhoto} alt='' color='#3B5998' size='10x' 
              onClick= {() => console.log(this.state)}/> */}
          
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
          <TextField
            value={this.state.email}
            placeholder="Email"
            onChange={e => {
              this.setState({ email: e.target.value });
              if(isEmail(e.target.value))
                this.setState({ invalidEmail: false });

              //the mail is crap so we show this error
              else
                this.setState({ invalidEmail: true });
            }}
          />
          {this.state.invalidEmail && (
            <div style={{ color: "red" }}>Wrong email format</div>
          )}
          <Button
            style={{ marginTop: 10 }}
            disabled={!this.state.email}
            variant="outlined"
            color="primary"
            onClick={() => {
              // check if pws or name are just spaces
              // if (this.state.invalidEmail
              //   || !this.state.userName.replace(/\s/g, '').length 
              //   || !this.state.pass.replace(/\s/g, '').length ) {
              //   alert('your name and/or pass only contains whitespace (ie. spaces, tabs or line breaks)');
              //   return;
              // }

              // Authenticate the user using entered credentials.
              
              const formData = new FormData()

              // fill foemData with the image
              for (var key of this.state.image.entries()){
                formData.append('file',key[1])
              }

              var data = {}
              data['name']=this.state.userName
              data['password']=this.state.pass
              data['email']=this.state.email
              data['image_url']=this.state.image_url
              //in server i will verify this data, if you are not logged in you can only subscribe
              //and if you are logged in i will ceck whether you are subscriber, worker or manager.
              data['status']='active'
              data['role']='subscriber'
              
              Auth.register(data, formData , user => {
                user = user.data
                // registeration failed.
                if (!user.isRegisteredSuccesfully) {
                  if (user.becauseImage) {
                    //good but without photo
                    alert(user.error)
                } else {
                    alert(user.error)
                    this.setState({ wrongCred: true });
                    return;
                  }
                }
                else alert(user.error)
              });
            }}
          >
            join
          </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>Wrong username and/or password</div>
          )}
          <input type='file' style={{ visibility : "hidden" }} id='single' onChange={this.my_upload}/> 
        </div>
      </div>
    );
  }
}
const Join_us = withRouter(connect()(ConnectedJoin_us));

export default Join_us;
