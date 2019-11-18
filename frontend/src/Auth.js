import rsa from "node-rsa"
import axios from 'axios'

// Mock of an authentication service
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
            for (var key in data){
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


        // console.log('********************************************');
        // axios({
        //     method: 'post',
        //     url: 'users/create_user',
        //     data: formData,
        //     headers: {'Content-Type': 'multipart/form-data' }
        // })

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

	resetPassword(token, pass, cb) {
    
    var data = {}
    data['password'] = pass
    data['token'] = token
        
    //has to encrypt before sending to server
    return axios.get('./get_PK_and_random')
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
