function login_with_passport(data) {
    return fetch('./get_PK_and_random')
        .then(response => response.json())
        .then(function (response) {
            var pk = response.pk;
            var rn = response.rn;
            //encrypting the pass before sending it to the server
            key = new rsa();
            key.importKey(pk, ['public']);
            //data['password']+rn inorder to prevenr reply attack
            data['password'] = key.encrypt(data['password'] + rn, 'base64');
            return data;
        }).catch(err => { console.log("get_PK_and_random error: " + err); })
        .then(function (data) {
            return fetch('./login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        })
        .then(response => response.text())
        .then(function (res) { return res; });
}
