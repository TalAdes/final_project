import rsa from "node-rsa"
import axios from 'axios'

// Mock of an authentication service
const Auth = {

  authenticate(name, pass, cb) {
    
    var data = {name,'password' : pass}
    var key = new rsa()
    fetch('/get_PK_and_random')
    .then(response => response.json())
            .then(function(response) {
                var pk = response.pk;
                var rn = response.rn;


                //encrypting the pass before sending it to the server
                key.importKey(pk, ['public']);
                //data['password']+rn inorder to prevenr reply attack
                data.password = key.encrypt(data.password+rn,'base64')
                console.log("data:");
                console.log(data);
                console.log("data.password:");
                console.log(data.password);
                return data

                }).catch(err =>  
                    console.log("get_PK_and_random error: "+err))
                .then((data) => 
                  fetch('/login',{
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  })
                )
                // .then(res => res.text())
                // .then(res => console.log(res))
                .then(res => res.json())
                .then((res) => 
                  cb(res))
                .catch(err =>  
                  {console.log(err+';)')
                  cb({
                    'isAuthenticated':false,
                })})
    // this._isAuthenticated = true;
    // setTimeout(
    //   () =>
    //     cb({
    //       name: name
    //     }),
    //   100
    // );
  },

  resetPassword(name, cb) {
    
    return axios.post('forgotPassword',{
      name
    })
      .then(res => {
        cb(res.data)
      })
      .catch(err =>  
        {console.log(err)
        cb('Something went wrong, please try again')})
  },

  signout(cb) {


    return axios.get('logOut')
      .then(res => {
        cb(res.data)
      })
      .catch(err =>  
        {console.log(err)
        cb('Something went wrong, please try again')})
    // this._isAuthenticated = false;
    // setTimeout(cb, 100);
  }
};

export default Auth;
