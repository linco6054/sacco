firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;


        let firstName = document.getElementById('firstName');
        let lastName = document.getElementById('lastName');
        let email1 = document.getElementById('email');
        let userNamePlace = document.getElementById('userNamePlace');
        let SaccoName = document.getElementById('SaccoName');
        var docRef = db.collection("usersDetails").doc(loggedInUserId);
        // change password 


        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());

                userNamePlace.innerHTML = doc.data().username;
                SaccoName.innerHTML = doc.data().saccoName;

                firstName.value = doc.data().firstName;
                lastName.value = doc.data().lastName;
                email1.value = doc.data().email;


            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });


        document.getElementById('update').onclick = () => {

            firebase.firestore().collection("usersDetails").doc(loggedInUserId).update({

                    firstName: firstName.value,
                    lastName: lastName.value,
                    email: email.value,

                })
                .then(() => {
                    //         console.log("Document successfully written!");

                    //change user password
                    let oldPass = document.getElementById('oldPassword');
                    let newPassword0 = document.getElementById('newPassword');
                    let newPassword1 = document.getElementById('newPassword1');
                    if (newPassword0.value === newPassword1.value && newPassword0.value !==oldPass.value) {
                        var user = firebase.auth().currentUser;
                        var newPassword = newPassword0.value;

                        user.updatePassword(newPassword).then(function () {
                            // Update successful.

                            logeoutUser();
                        }).catch(function (error) {
                            // An error happened.
                        });

                    }else if(newPassword0.value===oldPass.value){
                        alert('you new password should not be same as the old password')
                    }else{
                        alert('you new password does not match')

                    }

                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });

        }









    } else {
        window.location.href = 'login.html'
    }
});