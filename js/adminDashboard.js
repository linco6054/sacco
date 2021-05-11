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

          // user can logout 
          document.getElementById('logoutUser').onclick = () => {
            logeoutUser(loggedInUserId)
          }
          loggedUserData(user.uid);







        } else if (userType === 'user') {
          window.location.href = 'dashboard.html';
        } else if (userType === 'accountant') {
          window.location.href = 'Accountant-dashboard.html';
        } else {
          logeoutUser(loggedInUserId)
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