firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        let loggedInUserId = user.uid;
        // get admin sacco
        db.collection("usersDetails").where("userId", "==", loggedInUserId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc1) => {
                    // doc.data() is never undefined for query doc snapshots


                    let saccoId = doc1.data().saccoId;

                    db.collection("usersDetails").where("saccoId", "==", saccoId)
                        .get()
                        .then((querySnapshot) => {
                            var content = '';
                            querySnapshot.forEach((doc) => {
                                // doc.data() is never undefined for query doc snapshots
                                
                                let userId = doc.id;
                                let action = 'chats.html' + "?" + userId



                                // db.collection("Chats").where("sender", "==", userId)
                                // .get()
                                // .then((querySnapshot) => {

                                //     querySnapshot.forEach((doc1) => {
                                //         // doc.data() is never undefined for query doc snapshots
                                //         if(doc1.data().receiver===loggedInUserId && doc1.data().sender===userId &&doc1.data().read===false){
                                            
                                //                 // console.log(doc.id, " => ", doc.data());

                                //                 alert(querySnapshot.size)
                                            
                                            
                                //         }
                                        
                                //     });

                                    
                                // })
                                // .catch((error) => {
                                //     console.log("Error getting documents: ", error);
                                // });





                                content += ' <a href="' + action + '" class="media">';
                                content += '  <div class="media-img-wrap">';
                                content += '    <div class="avatar">';
                                content += '         <img src="dist/img/avatar1.jpg" alt="user"';
                                content += '           class="avatar-img rounded-circle">';
                                content += '     </div>';
                                content += '     <span class="badge badge-warning badge-indicator"></span>';
                                content += '  </div>';
                                content += '  <div class="media-body">';
                                content += '    <div>';
                                content += '        <div class="user-name">' + doc.data().username + '</div>';
                                content += '        <div class="user-last-chat">No one saves us but ourselves.</div>';
                                content += '    </div>';
                                content += '    <div>';
                                content += '        <div class="last-chat-time block">5 min</div>';
                                content += '        <div class="badge badge-success badge-pill">5</div>';
                                content += '     </div>';
                                content += ' </div>';
                                content += ' </a>';
                                content += ' <div class="chat-hr-wrap">';
                                content += '    <hr>';
                                content += ' </div>';








                            });
                            $('#Saccomembers').append(content);
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });

                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
// count unread chats










        // pick user Id for chat
        var receivedPostId = decodeURIComponent(window.location.search);
        var queryString = receivedPostId.substring(1);
        readNotification(queryString, loggedInUserId);

        function readNotification(receiverId, loggedInUserId) {
            // Add a new document in collection "cities"

            db.collection("usersDetails").where("userId", "==", receiverId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        

                        document.getElementById('userNames').innerHTML = doc.data().username;
                        let onlineOfline = doc.data().OnlineOflineStatus;
                        if (onlineOfline === true) {
                            document.getElementById('status').innerHTML = 'online';
                        } else {
                            document.getElementById('status').innerHTML = 'offline';
                        }
                        



                        // send text
                        document.getElementById('sendChat').onclick = function () {
                            let sendText = document.getElementById('sendText').value;
                            let chatTime = firebase.firestore.Timestamp.fromDate(new Date());
                            // Add a new document in collection "cities"
                            db.collection("Chats").doc().set({
                                    sender: loggedInUserId,
                                    receiver: receiverId,
                                    read: false,
                                    text: sendText,
                                    chatTime: chatTime

                                })
                                .then(() => {
                                    window.location.href = '';
                                    console.log("Document successfully written!");

                                })
                                .catch((error) => {
                                    console.error("Error writing document: ", error);
                                });
                        }
                        // read the text now                       
                        db.collection("Chats").where('chatTime','<',new Date()).orderBy('chatTime')
                            .get()
                            .then((querySnapshot) => {
                                var content = '';
                                querySnapshot.forEach((doc) => {
                                    // doc.data() is never undefined for query doc snapshots
                                   
                                    if(doc.data().sender===loggedInUserId && doc.data().receiver===receiverId){
                                        console.log(doc.data());



                                        content += ' <li class="media sent">';
                                        content += ' <div class="media-body">';
                                        content += '   <div class="msg-box">';
                                        content += '       <div>';
                                        content += '           <p>'+ doc.data().text+'</p>';
                                        content += '           <span class="chat-time">'+ doc.data().chatTime.toDate().toTimeString()+'</span>';
                                        content += '            <div class="arrow-triangle-wrap">';
                                        content += '                <div class="arrow-triangle left"></div>';
                                        content += '           </div>';
                                        content += '       </div>';
                                        content += '    </div>';
                                        content += '</div>';
                                        content += '</li>'; 
                                    
                                                                              

                                    }
                                    else if(doc.data().sender===receiverId && doc.data().receiver===loggedInUserId){


                                        
                                        content += ' <li class="media received">';
                                        content += '<div class="media-body">';
                                        content += '  <div class="msg-box">';
                                        content += '       <div>'
                                        content += '         <p>'+ doc.data().text+'</p>';
                                        content += '            <span class="chat-time">'+ doc.data().chatTime.toDate().toTimeString()+'</span>';
                                        content += '            <div class="arrow-triangle-wrap">';
                                        content += '                <div class="arrow-triangle right"></div>';
                                        content += '           </div>';
                                        content += '        </div>';
                                        content += '    </div>';
                                        content += '</div>';
                                        content += ' </li>';




                                    }


                                });

                                $('#chatshere').append(content);
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                            });

                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        }

    } else {
        window.location.href = 'login.html'
    }
});