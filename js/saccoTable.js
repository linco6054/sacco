firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;



        var docRef = db.collection("usersDetails").doc(user.uid);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());


                let saccoID = doc.data().saccoId;





                db.collection("usersDetails").where("saccoId", "==", saccoID)
                    .get()
                    .then((querySnapshot) => {
                        var content = '';
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            console.log(doc.id, " => ", doc.data());
                            // caunt the number of users
                            // alert(querySnapshot.size)

                            //


                            content += '<tr>';
                            content += '<td>' + doc.data().username + '</td>';
                            content += '<td>' + doc.data().firstName + '</td>';
                            content += '<td>' + doc.data().lastName + '</td>';
                            content += '<td>' + doc.data().email + '</td>';
                            content += '<td>' + doc.data().userType + '</td>';
                            content += '<td>' + doc.data().saccoName + '</td>';
                            content += '<td><button class="btn btn-gradient-info" > Print </button></td>';
                            content += '</tr>';


                        });
                        $('#usersofTheSacco').append(content);
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });







            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });












    } else {
        window.location.href = 'login.html'
    }
});