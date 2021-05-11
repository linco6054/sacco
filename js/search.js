firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;

        let usearch = document.getElementById('search');

        if (usearch.value === "") {
            usearch.onchange = () => {
                db.collection("usersDetails").where('firstName', '==', usearch.value || lastName, '==', usearch.value).get()
                    .then((querySnapshot) => {
                        var content = '';
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            console.log(doc.id, " => ", doc.data());

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
                        $('#applicants').append(content);
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
            }





        }



    } else {
        window.location.href = 'login.html'
    }
});