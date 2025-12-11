
const firebaseConfig = {
      apiKey: "AIzaSyAqGStTer6ihsCW-SO7WJ1-X2eMPPhscAs",
      authDomain: "td3-cloud.firebaseapp.com",
      projectId: "td3-cloud",
      storageBucket: "td3-cloud.firebasestorage.app",
      messagingSenderId: "1080271679044",
      appId: "1:1080271679044:web:e002cd9d613ebeb66b1611",
      measurementId: "G-1ZXZV2M0VG"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    const authArea = document.getElementById('auth-area');
    const feedArea = document.getElementById('feed-area');
    const usernameDiv = document.getElementById('username');
    const logoutBtn = document.getElementById('logout-btn');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesList = document.getElementById('messages-list');

    auth.onAuthStateChanged(user => {
      if (user) {
        authArea.style.display = 'none';
        feedArea.style.display = 'block';
        usernameDiv.textContent = `Hello ${user.email} !`;
        loadMessages();
      } else {
        authArea.style.display = 'flex';
        feedArea.style.display = 'none';
      }
    });

    //register
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      try {
        await auth.createUserWithEmailAndPassword(email, password);
        signupForm.reset();
      } catch (error) {
        alert(error.message);
      }
    });

    //login
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      try {
        await auth.signInWithEmailAndPassword(email, password);
        loginForm.reset();
      } catch (error) {
        alert(error.message);
      }
    });

    //logout
    logoutBtn.addEventListener('click', () => {
      auth.signOut();
    });

    //post a message
    messageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = auth.currentUser;
      const text = messageInput.value.trim();
      if (user && text) {
        try {
          await db.collection('messages').add({
            text,
            userId: user.uid,
            userEmail: user.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
          messageInput.value = '';
        } catch (error) {
          alert(error.message);
        }
      }
    });

    //list messages
    function loadMessages() {
      db.collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          messagesList.innerHTML = '';
          snapshot.forEach(doc => {
            const msg = doc.data();
            const div = document.createElement('div');
            div.classList.add('message');
            const time = msg.timestamp ? msg.timestamp.toDate().toLocaleString() : '';
            div.innerHTML = `<strong>${msg.userEmail}</strong>: ${msg.text}<br><span>${time}</span>`;
            messagesList.appendChild(div);
          });
        });
    }