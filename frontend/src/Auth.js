import rsa from "node-rsa"
import axios from 'axios'

const Auth = {
    register(data, formData, cb) {

    fetch('/get_PK_and_random')
    .then(response => response.json())
    .then(function(response) {
        var pk = response.pk;
        var rn = response.rn;
        
        var key = new rsa()
        //encrypting the pass before sending it to the server
        key.importKey(pk, ['public']);
        //data['password']+rn inorder to prevenr reply attack
        console.log('data.password');
        console.log(data.password);
        console.log('data[password]');
        console.log(data['password']);
        data.password = key.encrypt(data.password+rn,'base64')
        
        console.log('after we encrypted pass we are filling up form_data');
        for (key in data){
            formData.append(key, data[key]);
            console.log("data["+key+"]:")
            console.log(data[key])
        }
        return formData
    }).catch(err =>  
        console.log("get_PK_and_random error: "+err))
    .then((data) => 
        axios({
            method: 'post',
            url: 'users/create_user',
            data: data,
            headers: {'Content-Type': 'multipart/form-data' }
        })
    )
    .then((res) => cb(res))
    .catch(err =>  {
        console.log(err+';)')
        cb({
            'isRegisteredSuccesfully':false,
            'error' : err
        })
    })
    },

    addFlower(data, cb) {
    axios({
            method: 'post',
            url: 'flowers/upload_flower',
            data: data,
            headers: {'Content-Type': 'multipart/form-data' }
        })
    .then((res) => cb(res))
    .catch(err =>  {
        console.log(err+';)')
        cb({
            'isRegisteredSuccesfully':false,
            'error' : err
        })
    })
    },
    
    createChat(data, cb) {
        axios({
                method: 'post',
                url: '/chat_back/createNewChat',
                data: data,
            })
        .then((res) => cb(res))
        .catch(err =>  {
            console.log(err+';)')
            cb({
                'isRegisteredSuccesfully':false,
                'error' : 'there is problem in our servers please try later'
            })
        })

        
    },
            
    acceptChat(id, cb) {
        axios({
                method: 'post',
                url: '/chat_back/acceptChat',
                data: {id:id},
            })
        .then((res) => cb(res))
        .catch(err =>  {
            console.log(err)
            cb({data : {
                'isConfirmedSuccesfully':false,
                'message' : 'there is problem in our servers please try later'
            }})
        })
    },
    
    denyChat(id, cb) {
        axios({
            method: 'post',
            url: '/chat_back/denyChat',
            data: {id:id},
        })
        .then((res) => cb(res))
        .catch(err =>  {
            console.log(err)
            cb({data : {
                'isDenyedSuccesfully':false,
                'message' : 'there is problem in our servers please try later'
            }})
        })
    },
    
    deleteChat(id, cb) {
        axios({
            method: 'post',
            url: '/chat_back/deleteChat',
            data: {id:id},
        })
        .then((res) => cb(res))
        .catch(err =>  {
            console.log(err)
            cb({data : {
                'isDeletedSuccesfully':false,
                'message' : 'there is problem in our servers please try later'
            }})
        })
    },

    deleteUser(userName,chatID, cb) {
        axios({
            method: 'post',
            url: '/chat_back/deleteUser',
            data: {userName,chatID},
        })
        .then((res) => cb(res))
        .catch(err =>  {
            console.log(err)
            cb({data : {
                'isDeletedSuccesfully':false,
                'message' : 'there is problem in our servers please try later'
            }})
        })
    },

    leaveChat(id, cb) {
        axios({
            method: 'post',
            url: '/chat_back/leaveChat',
            data: {id:id},
        })
        .then((res) => cb(res))
        .catch(err =>  {
            console.log(err)
            cb({data : {
                'isLeavedSuccesfully':false,
                'message' : 'there is problem in our servers please try later'
            }})
        })
    },
    
    joinChat(id, cb) {
        axios({
            method: 'post',
            url: '/chat_back/joinChat',
            data: {id:id},
        })
        .then((res) => cb(res))
        .catch(err =>  {
            console.log(err)
            cb({data : {
                'isJoinedSuccesfully':false,
                'message' : 'there is problem in our servers please try later'
            }})
        })
    },
    
    joinToCloseChat(id, token, cb) {
        axios({
            method: 'post',
            url: '/chat_back/joinToCloseChat',
            data: {id,token},
        })
        .then((res) => cb(res))
        .catch(err =>  {
            console.log(err)
            cb({data : {
                'isJoinedSuccesfully':false,
                'message' : 'there is problem in our servers please try later'
            }})
        })
    },

    sendRequestToJoinChat(id, cb) {
        axios({
            method: 'post',
            url: '/chat_back/sendRequestToJoinChat',
            data: {id:id},
        })
        .then((res) => cb(res))
        .catch(err =>  {
            console.log(err)
            cb({data : {
                'isRequestSentSuccesfully':false,
                'message' : 'there is problem in our servers please try later'
            }})
        })
    },    

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
            .then(res => res.json())
            .then((res) => cb(res))
            .catch(err =>  {
                console.log(err+';)')
                cb({
                    'isAuthenticated':false,
                })
            })
    // this._isAuthenticated = true;
    // setTimeout(
    //   () =>
    //     cb({
    //       name: name
    //     }),
    //   100
    // );
    },

    forgotPassword(name, cb) {

    return axios.post('/forgotPassword',{
    name
    })
    .then(res => {
    cb(res.data)
    })
    .catch(err =>  
    {console.log(err)
    cb('Something went wrong, please try again')})
    },

    resetPassword(token, pass, cb) {

    var data = {}
    data['password'] = pass
    data['token'] = token

    console.log('if there is problem need to change axios to');
    console.log(`'return axios.get('/get_PK_and_random')'`);
    //has to encrypt before sending to server
    return axios.get('/get_PK_and_random')
        .then(response => {
            var	key = new rsa()
            var pk = response.data.pk;
            var rn = response.data.rn;
            //encrypting the pass before sending it to the server
            key.importKey(pk, ['public']);
            //data['password']+rn inorder to prevenr reply attack
            data['password'] = key.encrypt(data['password']+rn,'base64')
            return data
        })
        .catch(err =>{  
            console.log("get_PK_and_random error: "+err)
        })
        .then(data => {
            return axios.post('users/reset_user_password', data)
                .then(resp => {
                    console.log(resp);
                    if (resp.data==="הצליח לשנות לבחור את הסיסמא") {
                        return cb(true)
                    }
                    else if(resp.data==="your reset link was expired")
                    {
                        return cb(false)
                    }
                })
        })
    },

    signout(cb) {

    return axios.get('/logOut')
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
