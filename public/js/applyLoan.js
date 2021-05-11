firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;

        document.getElementById('btnx').onclick = function () {
            let period = document.getElementById('slider').value;
            let loanAmount = document.getElementById('loan').value;
            let applicationDate =firebase.firestore.Timestamp.fromDate(new Date());

            // Add a new document in collection "cities"
            db.collection("Loans").doc().set({
                    period: period,
                    loanAmount: loanAmount,
                    userid : user.uid,
                    applicationDate: applicationDate,
                    visited: false,
                    LoanStatus:false
                })
                .then(() => {
                    console.log("Document successfully written!");
                    window.location.href='dashboard.html';
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        }

    } else {
        window.location.href = 'login.html'
    }
});