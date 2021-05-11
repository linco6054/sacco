document.getElementById('login').onclick = () => {
    document.getElementById('login').style.display = 'none';
    document.getElementById('replacer').classList.remove('d-none');
    let email = document.getElementById('email'),
        password = document.getElementById('password'),
       // messages action
        messageDiv = document.getElementById('message'),
        theMessageContent = document.getElementById('theMessageContent');

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in

            var docRef = db.collection("usersDetails").doc(userCredential.user.uid);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    let userType = doc.data().userType;
                    if (userType === 'admin') {
                        upadteUserStatus(userCredential.user.uid)
                        
                    } else if (userType === 'user') {
                        upadteUserStatus(userCredential.user.uid)
                    } else if (userType === 'accountant') {
                        upadteUserStatus(userCredential.user.uid)
                    } else {
                        logeoutUser(userCredential.user.uid)
                    }


                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    // ..report error
                    messageDiv.classList.remove('d-none');
                    theMessageContent.innerHTML = 'user does not exist';
                    document.getElementById('login').style.display = 'block';
                    document.getElementById('replacer').classList.add('d-none');

                    refreshPage(5);
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
                // ..report error
                messageDiv.classList.remove('d-none');
                theMessageContent.innerHTML = 'Error getting document';
                document.getElementById('login').style.display = 'block';
                document.getElementById('replacer').classList.add('d-none');
                refreshPage(5);
            });
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..report error
            messageDiv.classList.remove('d-none');
            theMessageContent.innerHTML = 'user does not exist';
            document.getElementById('login').style.display = 'block';
            document.getElementById('replacer').classList.add('d-none');
            refreshPage(5);
        });
}

// onclick show value