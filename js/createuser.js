firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;

        // check user type before proceeding
        var docRef = db.collection("usersDetails").doc(loggedInUserId);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let userType = doc.data().userType;
                if (userType === 'admin') {
                    let authWorkerApp = firebase.initializeApp(firebase.app().options, 'auth-worker');
                    let authWorkerAuth = firebase.auth(authWorkerApp);
                    authWorkerAuth.setPersistence(firebase.auth.Auth.Persistence.NONE); //

                    // on click log out user
                    document.getElementById('logoutUser').onclick = () => {
                        logeoutUser()
                    }
                    //load user data
                    // loggedUserData(user.uid);
                    document.getElementById('create').onclick = function () {

                        let username = document.getElementById('username');
                        let firstName = document.getElementById('firstName');
                        let lastName = document.getElementById('lastName');
                        let email = document.getElementById('email');
                        let password = document.getElementById('password');
                        let password1 = document.getElementById('password1');
                        let utype = document.getElementById('utype');

                        // if (password.value === password1.value) {

                        authWorkerAuth.createUserWithEmailAndPassword(email.value, password.value)
                            .then((userCredential) => {
                                // Signed in 
                                var user = userCredential.user;
                                var newUserId = user.uid;

                                firebase.firestore().collection("sacco").where("AdminId", "==", loggedInUserId)
                                    .get()
                                    .then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {
                                                // doc.data() is never undefined for query doc snapshots
                                                console.log(doc.id, " => ", doc.data());

                                                let saccoId = doc.id;
                                                let saccoName = doc.data().saccoName;

                                                // Add a new document in collection "cities"
                                                firebase.firestore().collection("usersDetails").doc(newUserId).set({
                                                        username: username.value,
                                                        firstName: firstName.value,
                                                        lastName: lastName.value,
                                                        email: email.value,
                                                        userType: utype.value,
                                                        saccoName: saccoName,
                                                        saccoId: saccoId,
                                                        userId: newUserId
                                                    })
                                                    .then(() => {
                                                        console.log("Document successfully written!");

                                                        window.location.href = 'createuser.html';
                                                    })
                                                    .catch((error) => {
                                                        console.error("Error writing document: ", error);
                                                    });
                                            })
                                            .then(() => {
                                                console.log("Document successfully written!");
                                                // Add a new sacco information
                                                // alert('halleluiya')
                                            })
                                            .catch((error) => {
                                                console.error("Error writing document: ", error);
                                                // ..report error
                                                // messageDiv.classList.remove('d-none');
                                                // theMessageContent.innerHTML = 'Failed to add Admin Information';
                                                // refreshPage(5);
                                            });
                                        // ...
                                    })
                                    .catch((error) => {
                                        var errorCode = error.code;
                                        var errorMessage = error.message;

                                        // ..report error
                                        // messageDiv.classList.remove('d-none');
                                        // theMessageContent.innerHTML = 'Failed to register user';
                                        // refreshPage(5);
                                    });






                                // 

                            });





                        // } else {
                        //     alert('password does not match')

                        // }




                    }



                } else if (userType === 'user') {
                    window.location.href = 'dashboard.html';
                } else if (userType === 'accountant') {
                    window.location.href = 'Accountant-dashboard.html';
                } else {
                    logeoutUser()
                }




























            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                // ..report error
                messageDiv.classList.remove('d-none');
                theMessageContent.innerHTML = 'user does not exist';
                refreshPage(5);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            // ..report error
            messageDiv.classList.remove('d-none');
            theMessageContent.innerHTML = 'Error getting document';
            refreshPage(5);
        });


    } else {
        window.location.href = 'login.html'
    }
});