import React, { Component } from "react";
import { withRouter} from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AddAPhoto from "../../../Images/add_photo_alternate-24px.svg";
import DeleteAPhoto from "../../../Images/delete_forever-24px.svg";
import "./CreateNewChat.css";
import isEmail from 'validator/lib/isEmail';


const mapStateToProps = state => {
  return {
    numberOfItemsInCart: state.cartItems.length,
    loggedInUser: state.loggedInUser,
    loggedInUserRole: state.loggedInUserRole
  };
};

class CreateNewChat extends Component {
  state = {
    chatName          : "",
    adminName          : "",
    adminPhone          : "",
    adminEmail          : "",
    chatType          : "",
    
    image         : [],
    image_url     : "",
    
    invalidPhoneNumber   : "",
    invalidEmail   : ""
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
          {/* Create new chat channel */}
          <div
            style={{
              color: "#504F5A",
              marginBottom: 50,
              fontSize: 26,
              textAlign: "center"
            }}
          >
            Create new chat channel
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
          
          {/*price,description,quantity is Editable*/}
          
          <TextField
            label="Chat name"
            type="text"
            value={this.state.chatName}
            
            onChange={e => {
              this.setState({ chatName : e.target.value});
            }}
          />
          <TextField
            label="Admin name"
            type="text"
            value={this.state.adminName}
            //style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
            
            onChange={e => {
              this.setState({ adminName : e.target.value});
            }}
          />
          <TextField
            label="Admin email"
            value={this.state.adminEmail}
            onChange={e => {
              this.setState({ adminEmail: e.target.value });
              if(isEmail(e.target.value)){
                this.setState({ invalidEmail: false });
              }

              //the mail is crap so we show this error
              else{
                this.setState({ invalidEmail: true });}
            }}
          />
          <TextField
            label="Admin phone number"
            value={this.state.adminPhone}
            onChange={e => {
              this.setState({ adminPhone: e.target.value });
              if((e.target.value).length === 10 || (e.target.value).length === 9){
                this.setState({ invalidPhoneNumber: false });
              }

              //the mail is crap so we show this error
              else{
                this.setState({ invalidPhoneNumber: true });
              }
            }}
          />

          <TextField
            label="Chat Type(open/close/private)"
            value={this.state.chatType}
            onChange={e => {
              this.setState({ chatType: e.target.value });
            }}
          />

          <Button
            disabled={
              this.state.invalidEmail ||
              this.state.invalidPhoneNumber ||
              !this.state.chatName.toString().replace(/\s/g, '').length ||
              !this.state.adminEmail.toString().replace(/\s/g, '').length ||
              !this.state.chatType.toString().replace(/\s/g, '').length ||
              (this.state.chatType!== 'open' &&
              this.state.chatType!== 'close' &&
              this.state.chatType!== 'private' ) ||
              !this.state.adminName.toString().replace(/\s/g, '').length ||
              !this.state.adminPhone.toString().replace(/\s/g, '').length
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

              if(this.state.chatType === 'open'){
                data['isOpen']='yes' 
                data['isPrivate']='no' 
              }
              if(this.state.chatType === 'close'){
                data['isOpen']='no' 
                data['isPrivate']='no' 
              }
              if(this.state.chatType === 'private'){
                data['isOpen']='no' 
                data['isPrivate']='yes' 
              }

              data['chatName']=this.state.chatName       
              data['adminEmail']=this.state.adminEmail      
              data['adminPhone']=this.state.adminPhone      
              data['adminName']=this.state.adminName   
              data['image_url']=this.state.image_url
              if(this.props.loggedInUserRole !== 'admin'){
                data['status']="unconfirmed"
              }
              else data['status']="confirmed"

              // לזכור שתריך לשנות לפורם דאטה משום שרק כך אפשר לקלוח תמונה
              Auth.createChat(data , chat => {
                chat = chat.data
                // registeration failed.
                if (chat.isRegisteredSuccesfully) {
                    alert(chat.error)
                    this.props.history.push("/chat");
                } else {
                    alert(chat.error)
                  }
              });
            }}
          >
            Create
          </Button>
          
          <input type='file' style={{ visibility : "hidden" }} id='single' accept="image/*" onChange={this.my_upload}/> 
        </div>
      </div>
    );
  }
}
export default withRouter(connect(mapStateToProps)(CreateNewChat));

