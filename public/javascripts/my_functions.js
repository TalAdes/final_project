//for accessing via typing specific hash in the url bar 
function load_page_by_hash()
{
  console.log("load_page_by_hash()")
  switch(location.hash)
  {
    case '#home':     home();
        break;
    case '#flowers':  flowers_catalog();
        break;
    case '#users':    read_list();
        break;
    case '#branches': branches_list();
        break;
    case '#about':    about();
        break;
    case '#contact':  contact();
        break;
    case '#underConstruction':  underConstruction();
        break;
    default:          location.hash = '#home';
        home();
  }
}

function logOut()
{
    $("#myNavbar").load('./reset_navbar')
    $('#changing_container').load('./logOut')
    location.hash = '#home';
}

function flowers_catalog(show_or_not = "dont")
{
    $(document).ready(function()//we neet this because it can be a race condition which the navbar will load before 'changing_container' *and* the user
                                //will make a quick click on this option
    {
        $('#changing_container').load('/flowers/flowers_catalog?show_or_not='+show_or_not);
    });
    location.hash = '#flowers';
}

function branches_list()
{
    $(document).ready(function()//we neet this because it can be a race condition which the navbar will load before 'changing_container' *and* the user
                                //will make a quick click on this option
    {
        $('#changing_container').load('/branches/branches_list?');
    });
    location.hash = '#branches';
}

function read_list()
{
    $('#changing_container').html('<center><img src="images/loading_gif.gif"/></center>')
    $('#changing_container').load('/users/read_list');
    location.hash = '#users';
}

function addUser(uname,psw)
{
    document.getElementById('changing_container')
        .innerHTML = '<center><img src="images/loading_gif.gif"/></center>';
    var data = {name : getCookieValue(document.cookie)[0],pwd : getCookieValue(document.cookie)[1]};
    var e = document.getElementById("addUserSelect");
    var role = e.options[e.selectedIndex].text;
    $(document).ready(function()
    {
        $('#changing_container').load('/users/create_user?name='+uname+'&pwd='+psw+'&role='+role+'&managerName='+data.name);
    });

}

function deleteUser(id){
    $(document).ready(function()
    {
      $('#changing_container').load('/users/delete_user?id='+id);
      location.hash = '#users'
    });
}

function deleteFlower(id){
    $(document).ready(function()
    {
        $('#changing_container').load('/flowers/deleteFlower?id='+id);
        location.hash = '#flowers'
    });
}

function deleteBranch(id){
    $(document).ready(function()
    {
      $('#changing_container').load('/branches/delete_branch?id='+id);
      location.hash = '#branches'
    });
}

function about()
{
    $("#changing_container").load("./restore_container")
    location.hash = '#about';
}

function home()
{
    $("#changing_container").load("./restore_container")
    location.hash = '#home';
}

function contact()
{
    $("#changing_container").load("./restore_container")
    location.hash = '#contact';
}

function underConstruction()
{
    document.getElementById("changing_container").innerHTML="under construction";
    location.hash = '#underConstruction';
}

function login_with_passport(data)
{    
    return fetch('./get_PK_and_random')
        .then(response => response.json())
            .then(function(response) {
                var pk = response.pk;
                var rn = response.rn;

                //encrypting the pass before sending it to the server
                key = new rsa()
                key.importKey(pk, ['public']);
                //data['password']+rn inorder to prevenr reply attack
                data['password'] = key.encrypt(data['password']+rn,'base64')
                return data

            }).catch(err =>  { console.log("get_PK_and_random error: "+err); })
            .then(function(data){
                return fetch('./login', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data), // body data type must match "Content-Type" header
                })
            })
            .then(response => response.text())
            .then(function(res){ return res }) 
}

function LEGACY__create_user(data)
{    
    return fetch('./get_PK_and_random')
        .then(response => response.json())
            .then(function(response) {
                var pk = response.pk;
                var rn = response.rn;
                console.log("pk:")
                console.log(pk)
                console.log("rn:")
                console.log(rn)

                //encrypting the pass before sending it to the server
                key = new rsa()
                key.importKey(pk, ['public']);
                //data['password']+rn inorder to prevenr reply attack
                data['password'] = key.encrypt(data['password']+rn,'base64')
                return data

            }).catch(err =>  
                console.log("get_PK_and_random error: "+err))
            .then(function(data){
                return fetch('./users/create_user', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data), // body data type must match "Content-Type" header
                })
            })
            .then(response =>   console.log(response)
                                )
}

function reset_password_button(){    

    if (data['first_password'] != data['second_password']) {
        alert('the passwords are unequal')
        return false
    }

    var data = {}
    data['password'] = $("#first_password").val() 
    data['token'] = $("#reset_pass_token").val() 
    
    console.log("data:")
    console.log(data)
    console.log("______________")

    fetch('./get_PK_and_random')
    .then(response => response.json())
        .then(function(response) {
            var pk = response.pk;
            var rn = response.rn;

            //encrypting the pass before sending it to the server
            key = new rsa()
            key.importKey(pk, ['public']);
            //data['password']+rn inorder to prevenr reply attack
            data['password'] = key.encrypt(data['password']+rn,'base64')
            return data

            }).catch(err =>  
                console.log("get_PK_and_random error: "+err))
            .then(function(data){
                return fetch('./reset_user_password', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data), // body data type must match "Content-Type" header
                // body: form_data, // body data type must match "Content-Type" header
                })
            })
            .then(response => response.text())
            .then(function(resp){
                if (resp=="הצליח לשנות לבחור את הסיסמא") {
                    home()
                }
                else alert(resp)
            })
}





function jquery_intials()
{
    $('[data-toggle="tooltip"]').tooltip();

    $("#user_update_submit").click(function(){      
        $('input[name=user_update_status_container]').val($('input[name=user_update_status]:checked').val()).change();
    });
    
    $("#user_edit_submit").click(function(){      
        $('input[name=user_edit_status_container]').val($('input[name=user_edit_status]:checked').val()).change();
    });
    
    $("#image_url").on("keyup",function(){      
        $("#files").val('');
    });
     
    $("#branch_update_submit").click(function(){      
        console.log("$('input[name=branch_update_status_container]).val()')"+":");
        console.log($('input[name=branch_update_status_container]).val()'));
        $('input[name=branch_update_status_container]').val($('input[name=branch_update_status]:checked').val()).change();
        console.log("$('input[name=branch_update_status_container]).val()')"+":");
        console.log($('input[name=branch_update_status_container]).val()'));
    });

    $("#Forgot_my_password").click(function(){      
        var userName=$("#login_modal_name").val()
        if (userName!="") {
            $('#loginModal').modal('hide');
            image = new Image();
            image.src = "images/loading_gif.gif";
            image.onload = function () {
                $('#changing_container').empty().append(image);
                //here i need to call to server to sent an email.
                // fetch('/forgotPassword')
                fetch('./forgotPassword', {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email:userName}), // body data type must match "Content-Type" header
                    })
                .then(response => response.text())
                    .then(function(response){
                        if (response == "recovery email sent") {
                            $("#myNavbar").load('./reset_navbar') `why? if he forgot his pass the navbar must be already reset`
                            $("#changing_container").load("./restore_container")
                            alert("email with an uniqe token was send to your email")
                        } else {
                            alert(response)
                            $("#changing_container").load("./restore_container")
                            $('#loginModal').modal('show');
                        }
                    })
            };
        }
        return false
    });
    
    $("#login_form").submit(function(e){     
        e.preventDefault()
        //in this way we will provide all the fields
        name = $("#login_modal_name").val()
        pass = $("#login_modal_password").val()
        var data = {}
        data['name'] = name 
        data['username'] = name 
        data['password'] = pass 
        console.log("data.name:")
        console.log(data.name)
        console.log("data.password:")
        console.log(data.password)
        console.log("lets fetch")
        
        var x = login_with_passport(data)
        x.then(function(res){
            if(res == "login sucessed"){
                $('#loginModal').modal('hide');
                $('#myNavbar').load('/the_right_navbar_passport');
            }
            else{
                alert("username or password is in correct")
            }
        })
    }); 

    $("#registerModal").submit(function(e){     
        e.preventDefault()

        var data = {}
        data['name'] = $("#register_name").val()
        data['username'] = data['name']
        data['password'] = $("#register_password").val() 
        data['role'] = $("#registerSelect").val()
        data['image_url'] = $("#register_image_url").val() 
        data['status'] = "active" 

        console.log("data:")
        console.log(data)
        console.log("______________")

        fetch('./get_PK_and_random')
        .then(response => response.json())
            .then(function(response) {
                var pk = response.pk;
                var rn = response.rn;

                //encrypting the pass before sending it to the server
                key = new rsa()
                key.importKey(pk, ['public']);
                //data['password']+rn inorder to prevenr reply attack
                data['password'] = key.encrypt(data['password']+rn,'base64')
                return data

                }).catch(err =>  
                    console.log("get_PK_and_random error: "+err))
                .then(function(data){

                    var file_data = $('#register_files').prop('files')[0];
                    var form_data = new FormData();
                    form_data.append('file', file_data);

                    console.log('filling up form_data');
                    for (key in data){
                        form_data.append(key, data[key]);
                        console.log("data["+key+"]:")
                        console.log(data[key])
                    }
                    console.log("______________")
                    console.log('review form_data');
                    for (var key of form_data.entries()){
                        console.log(key[0]+" "+key[1])
                    }
                    console.log("______________")

                    return fetch('./users/create_user', {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    // body: JSON.stringify(data), // body data type must match "Content-Type" header
                    body: form_data, // body data type must match "Content-Type" header
                    })
                })
                .then(response => response.text())
                .then(function(resp){
                    if (resp!="Error Occured! non of your data was saved" 
                    && resp!="try different username, this one was already taken") {
                        $('#registerModal').modal('hide');
                        alert(resp)
                        home()
                    }
                    else alert(resp)
                })
    }); 

    $("#addUserModal").submit(function(e){     
        e.preventDefault()

        var data = {}
        data['name'] = $("#addUser_name").val()
        data['username'] = data['name']
        data['password'] = $("#addUser_password").val() 
        data['role'] = $("#addUserSelect").val()
        data['image_url'] = $("#image_url").val() 
        data['status'] = "active" 

        console.log("data:")
        console.log(data)
        console.log("______________")

        fetch('./get_PK_and_random')
        .then(response => response.json())
            .then(function(response) {
                var pk = response.pk;
                var rn = response.rn;

                //encrypting the pass before sending it to the server
                key = new rsa()
                key.importKey(pk, ['public']);
                //data['password']+rn inorder to prevenr reply attack
                data['password'] = key.encrypt(data['password']+rn,'base64')
                return data

                }).catch(err =>  
                    console.log("get_PK_and_random error: "+err))
                .then(function(data){

                    var file_data = $('#files').prop('files')[0];
                    var form_data = new FormData();
                    form_data.append('file', file_data);

                    console.log('filling up form_data');
                    for (key in data){
                        form_data.append(key, data[key]);
                        console.log("data["+key+"]:")
                        console.log(data[key])
                    }
                    console.log("______________")
                    console.log('review form_data');
                    for (var key of form_data.entries()){
                        console.log(key[0]+" "+key[1])
                    }
                    console.log("______________")

                    return fetch('./users/create_user', {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    // body: JSON.stringify(data), // body data type must match "Content-Type" header
                    body: form_data, // body data type must match "Content-Type" header
                    })
                })
                .then(response => response.text())
                .then(function(resp){
                    if (resp!="Error Occured! non of your data was saved" 
                    && resp!="try different username, this one was already taken") {
                        $('#addUserModal').modal('hide');
                        read_list()
                    }
                    else alert(resp)
                })
    }); 

    $("#updateUserModal").submit(function(e){     
        e.preventDefault()

        var data = {}
        data['name'] = $("#updateUser_name").val()
        data['username'] = data['name']
        data['password'] = $("#updateUser_password").val() 
        data['role'] = $("#updateUserSelect").val()
        data['status'] = $('input[name=user_update_status]:checked').val()
        data['id'] = $("#user_update_id").val()
        
        console.log("data:")
        console.log(data)
        console.log("______________")

        fetch('./get_PK_and_random')
        .then(response => response.json())
            .then(function(response) {
                var pk = response.pk;
                var rn = response.rn;

                //encrypting the pass before sending it to the server
                key = new rsa()
                key.importKey(pk, ['public']);
                //data['password']+rn inorder to prevenr reply attack
                data['password'] = key.encrypt(data['password']+rn,'base64')
                return data

                }).catch(err =>  
                    console.log("get_PK_and_random error: "+err))
                .then(function(data){

                    var form_data = new FormData();

                    console.log('filling up form_data');
                    for (key in data){
                        form_data.append(key, data[key]);
                        console.log("data["+key+"]:")
                        console.log(data[key])
                    }
                    console.log("______________")
                    console.log('review form_data');
                    for (var key of form_data.entries()){
                        console.log(key[0]+" "+key[1])
                    }
                    console.log("______________")

                    return fetch('./users/update_user', {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    // body: JSON.stringify(data), // body data type must match "Content-Type" header
                    body: form_data, // body data type must match "Content-Type" header
                    })
                })
                .then(response => response.text())
                .then(function(resp){
                    if (resp=="הצליח לעדכן את הבחור עם אותו השם"||
                        resp=="הצליח לעדכן את הבחור עם שם חדש") {
                        $("#myNavbar").load('./the_right_navbar_passport')
                        $('#updateUserModal').modal('hide');
                        read_list()
                    }
                    else alert(resp)
                })
    }); 

    $("#editYourProfileButtonModal").submit(function(e){     
        e.preventDefault()

        var data = {}
        data['name'] = $("#editUser_name").val()
        data['username'] = data['name']
        data['status'] = $('input[name=user_edit_status]:checked').val()
        
        console.log("data:")
        console.log(data)
        console.log("______________")

        var form_data = new FormData();

        console.log('filling up form_data');
        for (key in data){
            form_data.append(key, data[key]);
            console.log("data["+key+"]:")
            console.log(data[key])
        }
        console.log("______________")
        console.log('review form_data');
        for (var key of form_data.entries()){
            console.log(key[0]+" "+key[1])
        }
        console.log("______________")

        fetch('./users/edit_user', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            // body: JSON.stringify(data), // body data type must match "Content-Type" header
            body: form_data, // body data type must match "Content-Type" header
        }).then(response => response.text())
            .then(function(resp){
                if (resp=="כל הכבוד הצלחת לשנות אתה פרטים שלך") {
                    $('#editYourProfileButtonModal').modal('hide');
                    $("#myNavbar").load('./the_right_navbar_passport')
                    alert(resp)
                    home()
                }
                else if (resp == 'redirect') {
                    $("#myNavbar").load('./reset_navbar')
                    home()
                }
                else alert(resp)
            })
    })

    $("#reset_password_form").submit(function(e){     
        e.preventDefault()
        let first = $("#first_password").val()
        let second = $("#second_password").val()
        if (!first.replace(/\s/g, '').length) {
            alert(`password mustn't contain only whitespace (ie. spaces, tabs or line breaks)`);
            return false
        }
        else if (first != second) {
            alert('the passwords are unequal')
            return false
        }
        var data = {}
        data['password'] = $("#first_password").val() 
        data['token'] = $("#reset_pass_token").val() 
        
        console.log("data:")
        console.log(data)
        console.log("______________")

        fetch('./get_PK_and_random')
        .then(response => response.json())
            .then(function(response) {
                var pk = response.pk;
                var rn = response.rn;

                //encrypting the pass before sending it to the server
                key = new rsa()
                key.importKey(pk, ['public']);
                //data['password']+rn inorder to prevenr reply attack
                data['password'] = key.encrypt(data['password']+rn,'base64')
                return data

                }).catch(err =>  
                    console.log("get_PK_and_random error: "+err))
                .then(function(data){
                    return fetch('./reset_user_password', {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data), // body data type must match "Content-Type" header
                    // body: form_data, // body data type must match "Content-Type" header
                    })
                })
                .then(response => response.text())
                .then(function(resp){
                    if (resp=="הצליח לשנות לבחור את הסיסמא") {
                        home()
                    }
                    else alert(resp)
                })
    });
    
    $('#edit_your_profile_button').on('click',function(e){
        fetch('./get_minimal_user_data')
            .then(response => response.json())
                .then(function(data) {
                if(data.status == 'not active'){
                    $('#edit_not_active').prop('checked',true);
                }
                else{
                    $('#edit_active').prop('checked',true);
                }
                $("#editUser_name").val(data.name).change();
                $("#user_edit_id").val(data.id).change();
            })
    })
}





{

    //function getCookieValue(str)
    {
        /*
            function getCookieValue(str)
            {
                var res = str.split(";");
                var list = [];
                for(i=0;i<res.length;i++)
                {
                    list.push(res[i].split('=')[1]);
                }
                return list;
            }
        */
    }

    {
        /*

        */
    }
}