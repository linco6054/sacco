const db = firebase.firestore();




// refresh page 
function refreshPage(refreshTime) {
    // Refresh Rate is how often you want to refresh the page 
    // bassed off the user inactivity. 
    var refresh_rate = refreshTime; //<-- In seconds, change to your needs
    var last_user_action = 0;
    var has_focus = false;
    var lost_focus_count = 0;
    // If the user loses focus on the browser to many times 
    // we want to refresh anyway even if they are typing. 
    // This is so we don't get the browser locked into 
    // a state where the refresh never happens.    
    var focus_margin = 10;

    // Reset the Timer on users last action
    function reset() {
        last_user_action = 0;
        console.log("Reset");
    }

    function windowHasFocus() {
        has_focus = true;
    }

    function windowLostFocus() {
        has_focus = false;
        lost_focus_count++;
        console.log(lost_focus_count + " <~ Lost Focus");
    }

    // Count Down that executes ever second
    setInterval(function () {
        last_user_action++;
        refreshCheck();
    }, 1000);

    // The code that checks if the window needs to reload
    function refreshCheck() {
        var focus = window.onfocus;
        if ((last_user_action >= refresh_rate && !has_focus && document.readyState == "complete") || lost_focus_count > focus_margin) {
            window.location.reload(); // If this is called no reset is needed
            reset(); // We want to reset just to make sure the location reload is not called.
        }

    }
    window.addEventListener("focus", windowHasFocus, false);
    window.addEventListener("blur", windowLostFocus, false);
    window.addEventListener("click", reset, false);
    window.addEventListener("mousemove", reset, false);
    window.addEventListener("keypress", reset, false);
    window.addEventListener("scroll", reset, false);
    document.addEventListener("touchMove", reset, false);
    document.addEventListener("touchEnd", reset, false);
}



// get logged in user id
function loggedUserData(loggedIdofUser) {
    let userDetails = db.collection("usersDetails").doc(loggedIdofUser);

    userDetails.get().then((doc) => {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            let theId = doc.data().userId;
            let userName = doc.data().username;
            let email = doc.data().email;
            let userType = doc.data().userType;
            let saccoName = doc.data().saccoName;

            document.getElementById('userName').innerHTML = userName + "  (" + userType + ')';



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



}


// nitify users
function loanNotifications(userId, loanid, Tital, message, loanStatus, read) {
    let notificationDate = firebase.firestore.Timestamp.fromDate(new Date());
    // Add a new document in collection "cities"
    db.collection("Notifications").doc().set({
            userId: userId,
            loanid: loanid,
            Tital: Tital,
            message: message,
            loanStatus: loanStatus,
            read: read,
            notificationDate: notificationDate

        })
        .then(() => {
            console.log("Document successfully written!");
            window.location.href = '';
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

}



// when Loggin update user status
function upadteUserStatus(userId) {
    var washingtonRef = db.collection("usersDetails").doc(userId);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
            OnlineOflineStatus: true
        })
        .then(() => {
            console.log("Document successfully updated!");
            window.location.href = 'admin-dashboard.html';
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

// universal logout request

function logeoutUser(userId) {


    var washingtonRef = db.collection("usersDetails").doc(userId);

    // Set the "capital" field of the city 'DC'
    return washingtonRef.update({
            OnlineOflineStatus: false
        })
        .then(() => {
            console.log("Document successfully updated!");

            firebase.auth().signOut().then(() => {
                // Sign-out successful.
                window.location.href = "login.html";
            }).catch((error) => {

            });
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });


}