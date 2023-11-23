const onSaveProfile = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/updateProfile", {
      method: "POST",
      body: new FormData(form),
    });
    const resJson = await res.json();
    if (resJson) {
      window.location.pathname = "/";
    }
    console.log("saved", res);
  } catch (e) {
    console.log(e);
  }
};

const form = document.querySelector("#profile");
form.addEventListener("submit", onSaveProfile);
