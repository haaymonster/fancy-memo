const handleSubmit = async (e) => {
  e.preventDefault();
  const body = new FormData(form);

  body.set("passWord", sha256(body.get("passWord")));

  try {
    const res = await fetch("/login", {
      method: "POST",
      body,
    });
    const resJson = await res.json();
    console.log("token", resJson);
    if (res.status === 401) {
      alert("not authorized");
    } else if (res.status === 200) {
      window.localStorage.setItem("token", resJson.token);

      alert("login successful!");
      window.location.pathname = "/";
    }
  } catch (err) {
    alert(err);
  }
};

const form = document.querySelector("#login");
form.addEventListener("submit", handleSubmit);
