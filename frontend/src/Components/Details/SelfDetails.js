import React, { Component } from "react";
import "./Details.css";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../../Api";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DeleteIcon from '@material-ui/icons/Delete';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import isEmail from 'validator/lib/isEmail';
import { withRouter } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { setLoggedInUserEmail } from "../../Redux/Actions";

const mapStateToProps = state => {
  return {   
    loggedInUserRole : state.loggedInUserRole
  }}


class UserDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: undefined,
      unfinishedTasks: 0,
      role : "",
      invalidEmail: false,
      name :"",
      email : "",
      lastOrders : null
    };
  }

  fetchProductUsingID(id) {
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    Api.getUserData().then((res)=>{
      res = res.data;
      this.setState(ps => ({
            item: res,
            unfinishedTasks: ps.unfinishedTasks - 1,
            name : res.name,
            email : res.email
        }));
    })
  }

  componentDidMount() {
    this.fetchProductUsingID(this.props.match.params.id);
    Api.getMyLastOrders().then(x => this.setState({lastOrders : x}))
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
      <div className="details" style={{ padding: 10 }}>
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

        {/* id,role,status is Uneditable */}
        <TextField
          disabled="true"
          type="text"
          value={this.state.item.id}
          style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
          label="id"
        />
        <TextField
          disabled="true"
          type="text"
          value={this.state.item.role}
          style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
          label="role"
        />
        <TextField
          disabled="true"
          type="text"
          value={this.state.item.status}
          style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
          label="status"
        />

        {/*name,email is Editable*/}
        <TextField
          label="name"
          type="text"
          value={this.state.name}
          style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
          
          onChange={e => {
            this.setState({ name : e.target.value});
          }}
        />
        <TextField
          label="email"
          type="text"
          value={this.state.email}
          style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}

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

        {/* save button */}
        <Button
          style={{ width: 200, marginTop: 5 }}
          disabled={this.state.invalidEmail 
            || !this.state.email.replace(/\s/g, '').length
            || !this.state.name.replace(/\s/g, '').length}
          color="primary"
          variant="contained"
          onClick={() => {
            this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));
            var temp = this.state.item
            temp.name = this.state.name
            temp.email = this.state.email
            Api.updateUsersDataToDB(temp).then((res)=>{
              res = res.data;
              this.setState(ps => ({
                item: res,
                unfinishedTasks: ps.unfinishedTasks - 1,
              }));
              this.props.dispatch(setLoggedInUserEmail(this.state.email));
            })
          }}
        >
          save <SaveAltIcon style={{ marginLeft: 5 }} />
        </Button>
        
        {/* delete button
        <Button
          style={{ width: 200, marginTop: 5 }}
          color="primary"
          variant="contained"
          onClick={() => {
            this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));
            Api.deleteUserData(this.state.item).then((res)=>{
              if (res.data) {
                alert(res.data)
                this.props.history.push("/user_CRUD");
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
        </Button> */}
        
        
        </div>

        {/* every that i will put down will be in right */}
        
        {
          this.state.lastOrders === null?
          (
            <CircularProgress className="circular" />
          )
          :
          (
            this.state.lastOrders.data !== 'i am not subscriber' && this.state.lastOrders.data ?
        (<table className="table table-striped table-hover">
        <thead>
          <tr>
            <td>Item(s) name(s)</td>
            <td>Price</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          {this.state.lastOrders.data.map((item) => (
            <tr key={item.id} >
              <td>{item.description}</td>
              <td>{item.amount/100}</td>
              <td>{item.date.substring(11, 19) + "," + item.date.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
        ):(null)
          )
        }

      </div>
    </div>
    )
    
  }
}

export default withRouter(connect(mapStateToProps)(UserDetails));
