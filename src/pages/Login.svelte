<!-- <form action="/login" id="login" method="post">
  <div>
    <label for="userName">User Name: </label>
    <input type="text" name="userName" id="user-name" />
  </div>
  <div>
    <label for="passWord">Password: </label>
    <input type="password" name="passWord" id="user-password" />
  </div>

  <button type="submit">Login</button>
</form>

<a href="#/signUp">Sign Up</a> -->

<script>
  import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
  import { user$ } from "../store";

  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        localStorage.setItem("token", token);
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(token, user);
        user$.set(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
</script>

<h1>Login</h1>
<button on:click={loginWithGoogle}>Login with Google</button>
