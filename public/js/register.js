// register funtion
document.getElementById('register').onclick = () => {
    // collect user information from register.html
    let adminUserName = document.getElementById('adminUserName'),
        saccoName = document.getElementById('saccoName'),
        email = document.getElementById('adminEmail'),
        saccoEmail = document.getElementById('saccoEmail'),
        password = document.getElementById('password'),
        password1 = document.getElementById('password1'),


        // messages action
        messageDiv = document.getElementById('message'),
        theMessageContent = document.getElementById('theMessageContent');


    if (password.value === password1.value) {



        // register user in firebase
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;


                // Add a new admin user"
                db.collection("usersDetails").doc(user.uid).set({
                        username: adminUserName.value,
                        email: email.value,
                        userId: user.uid,
                        saccoId: saccoEmail.value,
                        saccoName: saccoName.value,
                        userType: 'admin'
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        // Add a new sacco information
                        db.collection("sacco").doc(saccoEmail.value).set({
                                AdminId: user.uid,
                                saccoName: saccoName.value,
                                saccoEmail: saccoEmail.value,
                                saccoStatus: false
                            })
                            .then(() => {
                                console.log("Document successfully written!");
                                upadteUserStatus(userCredential.user.uid)
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                                // ..report error
                                messageDiv.classList.remove('d-none');
                                theMessageContent.innerHTML = 'Failed register the sacco';
                                refreshPage(5);
                            });
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                        // ..report error
                        messageDiv.classList.remove('d-none');
                        theMessageContent.innerHTML = 'Failed to add Admin Information';
                        refreshPage(5);
                    });
                // ...
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;

                // ..report error
                messageDiv.classList.remove('d-none');
                theMessageContent.innerHTML = 'Failed to register user';
                refreshPage(5);
            });


    } else {
        messageDiv.classList.remove('d-none');
        theMessageContent.innerHTML = 'Password does not Match';
        refreshPage(5);
    }
}