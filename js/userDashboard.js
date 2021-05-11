firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    let loggedInUserId = user.uid;


    // on click log out user
    document.getElementById('logoutUser').onclick = () => {
      logeoutUser(loggedInUserId)
    }


    loggedUserData(user.uid);

    // get all notifications with the user id
    db.collection("Notifications").where("userId", "==", loggedInUserId)
      .get()
      .then((querySnapshot) => {
        var content = '';
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());

          let notificationId = doc.id;
          // when you click notofication
         

          let action = 'dashboard.html'+'?'+notificationId;

          content += ' <div class="dropdown-divider"></div>';
          content += ' <a href="'+action+'" class="dropdown-item"> ';
          content += '  <div class="media">';
          content += '  <div class="media-img-wrap">';
          content += '    <div class="avatar avatar-sm">';
          content += '               <span class="avatar-text avatar-text-primary rounded-circle">';
          content += ' <span class="initial-wrap"><span><i class="zmdi zmdi-account font-18"></i></span></span>';
          content += '              </span>';
          content += '       </div>';
          content += '       </div>';
          content += '      <div class="media-body">';
          content += '            <div>';

          content += '                 <div class="notifications-text"><h5>' + doc.data().Tital + '</h5><span class="text-dark text-capitalize"> ' + doc.data().message + '</span><br> <span class="text-dark text-capitalize">' + doc.data().notificationDate.toDate().toDateString() + '</span> at <span class="text-dark">' + doc.data().notificationDate.toDate().toTimeString() + '</span></div>';
          if (doc.data().read === false) {
            content += '                 <div class="notifications-time"><span><p id="unread"  >unread</p></span></div>';
          } else {
            content += '                 <div class="notifications-time"><span></span></div>';
          }
          content += '              </div>';
          content += '         </div>';
          content += '      </div>';
          content += '  </a>';






        });
        $('#Notifications').append(content);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });



    // when you click notofication
    function readNotification(notificationId) {
      // Add a new document in collection "cities"
      db.collection("Notifications").doc(notificationId).update({
          read: true
        })
        .then(() => {
          console.log("Document successfully written!");
          //window.location.href ='';
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }


   


  } else {
    window.location.href = 'login.html'
  }
});


var receivedPostId = decodeURIComponent(window.location.search);
var queryString = receivedPostId.substring(1);
readNotification(queryString);

function readNotification(queryString) {
  // Add a new document in collection "cities"
  db.collection("Notifications").doc(queryString).update({
      read: true
    })
    .then(() => {
      console.log("Document successfully written!");
      window.location.href ='dashboard.html';
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}