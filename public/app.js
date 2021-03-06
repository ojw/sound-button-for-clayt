(function(){

    var userId;

    const config = {
        apiKey: "AIzaSyArEBBO5Z9cLkyQ4GMoXnnWUnZPdxzSDb0",
        authDomain: "sound-button-c5683.firebaseapp.com",
        databaseURL: "https://sound-button-c5683.firebaseio.com",
        projectId: "sound-button-c5683",
        storageBucket: "sound-button-c5683.appspot.com",
        messagingSenderId: "144324006971"
    };
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }



    const textEmail = document.getElementById('email');
    const textPassword = document.getElementById('password');

    const btnLogin = document.getElementById('login');
    const btnSignup = document.getElementById('signup');
    const btnLogout = document.getElementById('logout');

    const welcome = document.getElementById("welcome");

    btnLogin.addEventListener('click', e => {
        const email = textEmail.value;
        const password = textPassword.value;
        const auth = firebase.auth();
        auth.signInWithEmailAndPassword(email, password).then(console.log).catch(console.log);
    });

    btnSignup.addEventListener('click', e => {
        const email = textEmail.value;
        const password = textPassword.value;
        const auth = firebase.auth();
        auth.createUserWithEmailAndPassword(email, password).then(console.log).catch(console.log)
            .then(console.log)
            .catch(console.log);
    });

    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut();
    });

    firebase.auth().onAuthStateChanged(user => {
        if(user){
            console.log(user);
            userId = user.uid;
            document.getElementById('fields').style.visibility="hidden";
            btnLogout.style.visibility="visible";
            btnLogin.style.visibility="hidden";
            btnSignup.style.visibility="hidden";
            welcome.innerHTML = "Welcome, " + user.email + ".";

            // log the user's buttons

            var db = firebase.firestore();
            var docRef = db.collection("users").doc(userId).collection("buttons");
            docRef.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.id, "=>", doc.data());
                    var dl = document.getElementById("download");
                    dl.value = "download " + doc.data().name;
                    dl.addEventListener('click', e => {
                        var storage = firebase.storage();
                        var pathRef = storage.ref(doc.data().location);
                        pathRef.getDownloadURL()
                            .then(function(url) {
                                // See:
                                // https://firebase.google.com/docs/storage/web/download-files
                                // note, the dl doesn't work because of cors, see the above

                                // You could do this but probably don't want to:
                                var xhr = new XMLHttpRequest();
                                xhr.responseType = 'blob';
                                xhr.onload = function(event) {
                                    var blob = xhr.response;
                                };
                                xhr.open('GET', url);
                                xhr.send();

                                // you probably want this one though:
                                // (except with a sound button, but you get the idea)
                                // var img = document.getElementById('myimg');
                                // img.src = url;
                            })
                            .catch(function(error) {
                                console.log(error);
                            });
                    });
                })})
        } else {
            console.log("not logged in");
            document.getElementById('fields').style.visibility="visible";
            btnLogout.style.visibility="hidden";
            btnLogin.style.visibility="visible";
            btnSignup.style.visibility="visible";
            welcome.innerHTML = "Log In";
        }
    });

    const btnUpload = document.getElementById("upload");

    btnUpload.addEventListener('click', e => {
        const fileInput = document.getElementById('file');
        const file = fileInput.files[0]
        const tags = document.getElementById('tags').value;

        // gotta create a ref
        console.log(file.name)
        buttonFolder = firebase.storage().ref("buttons/");
        userButtons = buttonFolder.child(userId);
        uploadRef = userButtons.child(file.name);
        console.log(uploadRef);
        console.log(uploadRef.location.u);
        // then upload the file there
        uploadRef.put(file);
        // ok also gotta create a db record, for tags etc
        var db = firebase.firestore();
        db.collection("users").doc(userId).collection("buttons").add({name: file.name,
                                                                      location: uploadRef.location.u,
                                                                      tags: tags});
    });

})();
