firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;

        let Udata =getUserSacco(loggedInUserId);
         
        




    } else {
        window.location.href = 'login.html'
    }
});

// get users admin sacco
function getUserSacco(loggerId) {
    db.collection("usersDetails").where("userId", "==", loggerId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                
                function udata(){
                    console.log(doc.id);
                }

            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        
}