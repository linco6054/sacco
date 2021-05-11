firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;

       // let usearch = document.getElementById('search');

        document.addEventListener('DOMContentLoaded', async () => {


            const searchByName = async ({
                usearch = '',
                limit = 50,
                lastName = ""
            }, () => {
                const snapshot = await db.collection('usersDetails')
                    .where('firstName', 'array-contains', usearch.toLowerCase())
                    .orderBy("firstName")
                   // .startAfter(firstName)
                    .get();


                return snapshot.doc.data().firstName;
                const name = doc.data().firstName;
                return acc.concat `
                <tr>
                <td>${firstName}</td>
                </tr>
                `
            })

            const textBox= document.querySelector("#search");
            const rowUsers =document.querySelector('#applicants');
            rowUsers.innerHTML=await searchByName();

            textBox.addEventListener('keyup', async (e)=> rowUsers.innerHTML =await searchByName({search:e.target.value}));



        })


    } else {
        window.location.href = 'login.html'
    }
});