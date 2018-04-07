(function(){

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
            document.getElementById('fields').style.visibility="hidden";
            btnLogout.style.visibility="visible";
            btnLogin.style.visibility="hidden";
            btnSignup.style.visibility="hidden";
            welcome.innerHTML = "Welcome, " + user.email + ".";
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

        // gotta create a ref
        console.log(file.name)
        uploadRef = firebase.storage().ref(file.name);
        // then upload the file there
        uploadRef.put(file);
    });

})();
