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
                let saccoid= doc.data().saccoId;
                if (userType === 'admin') {




                    db.collection("Loans").where("visited", "==", false)
                        .get()
                        .then((querySnapshot) => {
                            
                            querySnapshot.forEach((doc) => {
                                // doc.data() is never undefined for query doc snapshots
                                console.log(doc.id, " => ", doc.data());

                                let loanid= doc.id;
                            
                                let applicantId = doc.data().userid;
                                
                                


                                // querry user data based on what is above
                                db.collection("usersDetails").where("userId", "==", applicantId)
                                    .get()
                                    .then((querySnapshot) => {
                                        var content = '';
                                        querySnapshot.forEach((document) => {
                                            // doc.data() is never undefined for query doc snapshots
                                            let applicantSacco= document.data().saccoId;

                                            let loanDetails= 'loandetails.html'+'?'+loanid;



                                            if(applicantSacco===saccoid){
                                            console.log(document.id, " => ", document.data());

                                            content += '<tr>';
                                            content += '<td><a id="newapplicatData" href='+loanDetails+' >' + document.data().firstName + '</a></td>';
                                            content += '<td><a id="newapplicatData" href='+loanDetails+' >' + document.data().lastName + '</a></td>';
                                            content += '<td><a id="newapplicatData" href='+loanDetails+' >' + doc.data().loanAmount + '</a></td>';
                                            content += '<td><a id="newapplicatData" href='+loanDetails+' >' + document.data().email + '</a></td>';
                                            content += '<td><a id="newapplicatData" href='+loanDetails+' >' + doc.data().applicationDate.toDate().toDateString() + '</a></td>';
                                            if(doc.data().visited){
                                            content += '<td><button href='+loanDetails+' class="btn btn-gradient-success">Active</button> </td>';
                                            }else{
                                                content += '<td><a href='+loanDetails+' class="btn btn-gradient-danger">Pending</a> </td>';
                                            }
                                            content += '</tr>';
                                        }

                                        });
                                        $('#applicants').append(content);
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