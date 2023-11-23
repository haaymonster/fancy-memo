const handleSubmit = async (e) => {
  e.preventDefault();
  const body = new FormData(form);
  console.log("body", sha256("sss"));

  body.set("passWord", sha256(body.get("passWord")));

  try {
    const res = await fetch("/signUp", {
      method: "POST",
      body,
    });
    const resJson = await res.json();
    alert(resJson);
    window.location.pathname = "/login.html";
  } catch (err) {
    alert(err);
  }
};

const form = document.querySelector("#sign-up");
form.addEventListener("submit", handleSubmit);
