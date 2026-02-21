<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD2YFvsvmqOZTUaLPvq3twI6gtbKwkPgkc",
    authDomain: "dayscore-f4d10.firebaseapp.com",
    databaseURL: "https://dayscore-f4d10-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dayscore-f4d10",
    storageBucket: "dayscore-f4d10.firebasestorage.app",
    messagingSenderId: "565452164282",
    appId: "1:565452164282:web:3e3ff887fb0893e591c683",
    measurementId: "G-ZX0G0X4KQS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
