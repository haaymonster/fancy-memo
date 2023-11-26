<script>
  import Route from "svelte-spa-router";
  import Main from "./pages/Main.svelte";
  import Login from "./pages/Login.svelte";
  import SignUp from "./pages/SignUp.svelte";
  import AddProfile from "./pages/AddProfile.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import "./css/index.css";
  import {
    GoogleAuthProvider,
    getAuth,
    signInWithCredential,
  } from "firebase/auth";
  import { user$ } from "./store";
  import { onMount } from "svelte";

  const auth = getAuth();
  let isLoading = true;
  const checkLogin = () => {
    const token = localStorage.getItem("token");
    if (!token) return (isLoading = false);
    const credential = GoogleAuthProvider.credential(null, token);
    signInWithCredential(auth, credential)
      .then((res) => {
        user$.set(res.user);
        isLoading = false;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The credential that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const routes = {
    "/": Main,
    // "/login": Login,
    "/signUp": SignUp,
    "/addProfile": AddProfile,
    "*": NotFound,
  };

  onMount(() => {
    checkLogin();
  });
</script>

{#if isLoading}
  <div>Loading...</div>
{:else if !$user$}
  <Login></Login>
{:else}
  <Route {routes}></Route>
{/if}

<main></main>

<style>
</style>
