firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    let loggedInUserId = user.uid;

    // check user type before proceeding
    var docRef = db.collection("usersDetails").doc(loggedInUserId);

    docRef
      .get()
      .then((doc1) => {
        if (doc1.exists) {
          console.log("Document data:", doc1.data());
          let userType = doc1.data().userType;
          let saccoid = doc1.data().saccoId;
          if (userType === "admin") {
            // check all user where they share the same sacco as the admin

            db.collection("usersDetails")
              .where("saccoId", "==", saccoid)
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc2) => {
                  // doc.data() is never undefined for query doc snapshots
                  console.log(doc2.id, " => ", doc2.data());
                  let applicantsID = doc2.data().userId;
                  // now collect all loans with the said id
                  let userSearch = document.getElementById("search");
                  

                  db.collection("Loans").where("userid", "==", applicantsID)
                    .get()
                    .then((querySnapshot) => {
                      var content = "";
                      querySnapshot.forEach((doc3) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc3.id, " => ", doc3.data());

                        let loanid = doc3.id;
                        let loanDetails = "loandetails.html" + "?" + loanid;

                        userSearch.onchange =()=>{
                          let thesearch = userSearch.value;
                          


                        }

                        content += "<tr>";
                        content += '<td><a id="newapplicatData" href=' + loanDetails + " >" + doc2.data().firstName + "</a></td>";
                        content += '<td><a id="newapplicatData" href=' + loanDetails + " >" + doc2.data().lastName + "</a></td>";
                        content += '<td><a id="newapplicatData" href=' + loanDetails + " >" + doc3.data().loanAmount + "</a></td>";
                        content +='<td><a id="newapplicatData" href=' + loanDetails + " >" +doc2.data().email +"</a></td>";
                        content +='<td><a id="newapplicatData" href=' +loanDetails + " >" + doc2.data().saccoName +"</a></td>";
                        content += '<td><a id="newapplicatData" href=' +loanDetails + " >" +doc3.data().applicationDate.toDate().toDateString() + "</a></td>";

                        if (doc3.data().reviewDate !== undefined) {
                          content += '<td><a id="newapplicatData" href=' +loanDetails + " >" +doc3.data().reviewDate.toDate().toDateString() +"</a></td>";
                        } else {
                          content +='<td><a id="newapplicatData" href=' +loanDetails +" >Not reviewed</a></td>";
                        }

                        if ( doc3.data().LoanStatus === true && doc3.data().visited === true) {
                          content += "<td><button href=" +loanDetails +' class="btn btn-gradient-success">Approved</button> </td>';
                        } else if (
                          doc3.data().LoanStatus === false &&
                          doc3.data().visited === true
                        ) {
                          content += "<td><a href=" + loanDetails +' class="btn btn-gradient-warning">Rejected</a> </td>';
                        } else if ( doc3.data().LoanStatus === true && doc3.data().visited === false ) {
                          content += "<td><a href=" +loanDetails +' class="btn btn-gradient-danger">Error</a> </td>';
                        } else if (doc3.data().LoanStatus === false && doc3.data().visited === false ) {
                          content +="<td><a href=" + loanDetails +' class="btn btn-gradient-info">pending</a> </td>';
                        }
                        content += "</tr>";
                      });
                      $("#applicants").append(content);
                    })
                    .catch((error) => {
                      console.log("Error getting documents: ", error);
                    });
                });
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
          } else if (userType === "user") {
            window.location.href = "dashboard.html";
          } else if (userType === "accountant") {
            window.location.href = "Accountant-dashboard.html";
          } else {
            logeoutUser();
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          // ..report error
          messageDiv.classList.remove("d-none");
          theMessageContent.innerHTML = "user does not exist";
          refreshPage(5);
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        // ..report error
        messageDiv.classList.remove("d-none");
        theMessageContent.innerHTML = "Error getting document";
        refreshPage(5);
      });

    // on click log out user
  } else {
    window.location.href = "login.html";
  }
});