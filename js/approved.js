firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;

        // check user type before proceeding
        var docRef = db.collection("usersDetails").doc(loggedInUserId);

        docRef.get().then((doc1) => {
            if (doc1.exists) {
                // console.log("Document data:", doc1.data());
                let userType = doc1.data().userType;
                let adminSaccoId = doc1.data().saccoId;
                if (userType === 'admin') {

                    // query all users sharing admin sacco ID
                    db.collection("usersDetails").where("saccoId", "==", adminSaccoId)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc2) => {
                                // doc.data() is never undefined for query doc snapshots
                                // console.log(doc2.id, " => ", doc2.data());

                                let applicantsID = doc2.data().userId;

                                db.collection("Loans").where("userid", "==", applicantsID)
                                    .get()
                                    .then((querySnapshot) => {
                                        var content = '';
                                        querySnapshot.forEach((doc3) => {
                                            // doc.data() is never undefined for query doc snapshots
                                            // console.log(doc3.id, " => ", doc3.data());


                                            if (doc3.data().visited === true && doc3.data().LoanStatus === true) {



                                                content += ' <tr>';
                                                content += ' <td>'+ doc2.data().firstName+'</td>';
                                                content += ' <td>'+ doc2.data().lastName+'</td>';
                                                content += '  <td>'+ doc2.data().email+'</td>';
                                                content += '  <td>'+ doc3.data().loanAmount+'</td>';
                                                content += '  <td>'+ doc3.data().period+' Months</td>';
                                                content += '    <td>'+ doc3.data().applicationDate.toDate().toDateString()+'</td>';
                                                content += '    <td>'+ doc3.data().reviewDate.toDate().toDateString()+'</td>';
                                                content += '  </tr>';


                                            } else {
                                                
                                            }

                                        });
                                        $('#approvedUsers').append(content);
                                    })
                                    .catch((error) => {
                                        console.log("Error getting documents: ", error);
                                    });
                            });
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
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


        // on click log out user





    } else {
        window.location.href = 'login.html'
    }
});