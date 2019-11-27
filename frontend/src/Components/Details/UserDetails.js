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
      lastOrders : []
    };
  }

  fetchProductUsingID(id) {
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    Api.getUserDataUsingID(id).then((res)=>{
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
    let id = this.props.match.params.id
    this.fetchProductUsingID(id);
    Api.getHisLastOrders(id).then(x => this.setState({lastOrders : x}))
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

    if (this.props.loggedInUserRole === 'admin') {
      return (<div className="details" style={{ padding: 10 }}>
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
          save <SaveAltIcon style={{ marginLeft: 5 }} />
        </Button>
        
        {/* delete button */}
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
        </Button>
        
        
        </div>
            
        {/* every that i will put down will be in right */}

        {this.state.lastOrders.data !== 'this budyy is not subscriber' && this.state.lastOrders.data ?
        (<Table style={{ width: 460 , marginLeft: 30}}>
          <TableHead>
            <TableRow>
              <TableCell>Item(s) name(s)</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log(this.state.lastOrders.data)}
            {this.state.lastOrders.data.map((item, index) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <TextField
                      disabled='true'
                      type="text"
                      style={{ width: 200 }}
                      multiline
                      value={item.description}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      disabled='true'
                      style={{ width: 60 }}
                      multiline
                      value={item.amount}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      disabled='true'
                      style={{ width: 200 }}
                      multiline
                      value={item.date}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            </TableBody>
        </Table>
        ):(null)}

        
      </div>
    </div>
    )}
    
    else if(this.props.loggedInUserRole === 'worker'){
      return (<div className="details" style={{ padding: 10 }}>
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

        {/*name,email is also Uneditable*/}
        <TextField
          disabled="true"
          label="name"
          type="text"
          value={this.state.name}
          style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
        />
        <TextField
          disabled="true"
          label="email"
          type="text"
          value={this.state.email}
          style={{ marginTop: 20 , marginBottom: 20 , width: '200px' }}
        />

      </div>
        
        {/* every that i will put down will be in right */}

        

      {this.state.lastOrders.data !== 'this budyy is not subscriber' && this.state.lastOrders.data ?
        (<Table style={{ width: 460 , marginLeft: 30}}>
          <TableHead>
            <TableRow>
              <TableCell>Item(s) name(s)</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.lastOrders.data.map((item, index) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <TextField
                      disabled='true'
                      type="text"
                      style={{ width: 200 }}
                      multiline
                      value={item.description}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      disabled='true'
                      style={{ width: 60 }}
                      multiline
                      value={item.amount}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      disabled='true'
                      style={{ width: 200 }}
                      multiline
                      value={item.date}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            </TableBody>
        </Table>
        ):(null)}
        
      </div>
    </div>
    )}
    
    else {
      alert(this.state.item)
      this.props.history.push("/");
      return null
    }
  }
}

export default withRouter(connect(mapStateToProps)(UserDetails));
