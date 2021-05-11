firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;

        // check user type before proceeding
        var docRef = db.collection("usersDetails").doc(loggedInUserId);

        docRef.get().then((doc1) => {
            if (doc1.exists) {
                // console.log("Document data:", doc.data());
                let userType = doc1.data().userType;
                let saccoId = doc1.data().saccoId;
                if (userType === 'admin') {

                    // decode url component
                    var receivedPostId = decodeURIComponent(window.location.search);
                    var queryString = receivedPostId.substring(1);

                    // now collect loans details
                    var docRef = db.collection("Loans").doc(queryString);

                    docRef.get().then((doc2) => {
                        if (doc2.exists) {
                            console.log("Document data:", doc2.data());
                            let applicantsID = doc2.data().userid;

                            // now collcet applicants details
                            var docRef = db.collection("usersDetails").doc(applicantsID);

                            docRef.get().then((doc3) => {
                                if (doc3.exists) {
                                    let aoolicantId = doc3.data().saccoId;
                                    if (saccoId === aoolicantId) {
                                        console.log("Document data:", doc3.data());

                                        // now pass this information to html doc
                                        document.getElementById('firstName').innerHTML = `First Name:  ${doc3.data().firstName}`;
                                        document.getElementById('lastName').innerHTML = `Last Name: ${doc3.data().lastName}`;
                                        document.getElementById('email').innerHTML = `Email Address: ${doc3.data().email}`;
                                        document.getElementById('userName').innerHTML = `User Name : ${doc3.data().username}`;
                                        document.getElementById('userType').innerHTML = `User Type: ${doc3.data().userType}`;
                                        document.getElementById('saccoName').innerHTML = `${doc3.data().saccoName}`;
                                        document.getElementById('amount').innerHTML = `Amount applied : ${doc2.data().loanAmount}`;
                                        document.getElementById('period').innerHTML = `Period : ${doc2.data().period} Months`;
                                        if (doc2.data().visited === false) {
                                            document.getElementById('visited').innerHTML = `Visited Status: Not Visited`;
                                        } else {
                                            document.getElementById('visited').innerHTML = `Visited Status: Visited`;
                                        } //

                                        if (doc2.data().visited === false && doc2.data().LoanStatus === false) {
                                            document.getElementById('status').innerHTML = `Status: Pending`;
                                        } else if (doc2.data().visited === true && doc2.data().LoanStatus === false) {
                                            document.getElementById('status').innerHTML = `Status: rejected`;
                                        } else if (doc2.data().visited === true && doc2.data().LoanStatus === true) {
                                            document.getElementById('status').innerHTML = `Status: Approved`;
                                        } else {
                                            document.getElementById('status').innerHTML = `Status: Error with this document`;
                                        }


                                        document.getElementById('applicationDate').innerHTML = doc2.data().applicationDate.toDate().toDateString();
                                        document.getElementById('dates').innerHTML = doc2.data().applicationDate.toDate().toDateString();
                                        if (doc2.data().reviewDate !== undefined) {
                                            document.getElementById('reviewDate').innerHTML = "Date reviewed " + doc2.data().reviewDate.toDate().toDateString();
                                        } else {
                                            document.getElementById('reviewDate').style.display = 'none';
                                        }




                                        // check if loan has been visited

                                        let approve = document.getElementById('approve');
                                        let reject = document.getElementById('reject');
                                        if (doc2.data().visited === false) {

                                            let applicationDate = firebase.firestore.Timestamp.fromDate(new Date());

                                            approve.onclick = () => {

                                                var washingtonRef = db.collection("Loans").doc(queryString);

                                                // Set the "capital" field of the city 'DC'
                                                return washingtonRef.update({
                                                        visited: true,
                                                        LoanStatus: true,
                                                        reviewDate: applicationDate,
                                                        Approver: loggedInUserId

                                                    })
                                                    .then(() => {
                                                        console.log("Document successfully updated!");
                                                        window.location.href = '';
                                                        let userId = doc3.data().userId;
                                                        let loanid = doc2.id;
                                                        let Tital = "Approved";
                                                        let message = `Hi ${doc3.data().username} Your Loan of ${doc2.data().loanAmount} has been Approved!`;
                                                        let loanStatus = true;
                                                        let read = false;
                                                        loanNotifications(userId, loanid, Tital, message, loanStatus, read);
                                                    })
                                                    .catch((error) => {
                                                        // The document probably doesn't exist.
                                                        console.error("Error updating document: ", error);
                                                        window.location.href = '';
                                                    });

                                            }

                                            reject.onclick = () => {
                                                var washingtonRef = db.collection("Loans").doc(queryString);

                                                // Set the "capital" field of the city 'DC'
                                                return washingtonRef.update({
                                                        visited: true,
                                                        LoanStatus: false,
                                                        reviewDate: applicationDate

                                                    })
                                                    .then(() => {
                                                        console.log("Document successfully updated!");
                                                        let userId = doc3.data().userId;
                                                        let loanid = doc2.id;
                                                        let Tital = "Rejected";
                                                        let message = `Hi ${doc3.data().username} Your Loan of ${doc2.data().loanAmount} has been Rejected!`;
                                                        let loanStatus = false;
                                                        let read = false;
                                                        loanNotifications(userId, loanid, Tital, message, loanStatus, read);
                                                        // read
                                                        window.location.href = '';
                                                    })
                                                    .catch((error) => {
                                                        // The document probably doesn't exist.
                                                        console.error("Error updating document: ", error);
                                                        window.location.href = '';
                                                    });

                                            }

                                        } else {
                                            approve.style.display = 'none';
                                            reject.style.display = 'none';
                                        }
                                    }

                                } else {
                                    // doc.data() will be undefined in this case
                                    console.log("No such document!");
                                }
                            }).catch((error) => {
                                console.log("Error getting document:", error);
                            });

                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
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
                // messageDiv.classList.remove('d-none');
                // theMessageContent.innerHTML = 'user does not exist';
                // refreshPage(5);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            // ..report error
            // messageDiv.classList.remove('d-none');
            // theMessageContent.innerHTML = 'Error getting document';
            // refreshPage(5);
        });


    } else {
        window.location.href = 'login.html'
    }
});