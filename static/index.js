const onDelete = async (e) => {
  const target = e.target;

  const res = await fetch("/deleteMemo", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: target.dataset.id,
      content: "sss",
    }),
  });
  console.log("res", res);
  if (res.status === 200) {
    readMemo();
  }
};
const onEdit = async (e) => {
  const target = e.target;

  const newMemo = prompt("edit please...");
  const res = await fetch("/updateMemo", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: target.dataset.id,
      content: newMemo,
    }),
  });
  console.log("res", res);
  if (res.status === 200) {
    readMemo();
  }
};
const displayMemo = (memo) => {
  const ul = document.querySelector("#memo-list");
  const li = document.createElement("li");
  const btnEdit = document.createElement("button");
  const btnDel = document.createElement("button");
  console.log("mmmm", memo.content);
  li.innerText = memo.content;
  btnEdit.innerText = "Edit";
  btnEdit.addEventListener("click", onEdit);
  btnEdit.dataset.id = memo.id;
  btnDel.innerText = "Delete";
  btnDel.dataset.id = memo.id;
  btnDel.addEventListener("click", onDelete);
  li.appendChild(btnEdit);
  li.appendChild(btnDel);
  ul.appendChild(li);
};

const readMemo = async () => {
  const res = await fetch("/getMemo");
  const ul = document.querySelector("#memo-list");
  const resJson = await res.json();
  console.log("memos", resJson);
  ul.innerHTML = "";
  resJson.forEach(displayMemo);
};

const createMemo = async (memo) => {
  const res = await fetch("/createMemo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: Date.now(),
      content: memo,
    }),
  });

  res && readMemo();
};

const submitMemo = (e) => {
  e.preventDefault();
  const content = document.querySelector("#memo-input");
  createMemo(content.value);
  content.value = "";
};

const onSort = async (e) => {
  e.preventDefault();
  const sortType = document.querySelector("#sort-type");
  console.log("sortType", sortType.value);
  const res = await fetch(`/getMemo?sortBy=${sortType.value}`);
  const resJson = await res.json();
  console.log("nnn", resJson);
  const ul = document.querySelector("#memo-list");
  ul.innerHTML = "";
  resJson.forEach(displayMemo);
};

const form = document.querySelector("#memo-form");

form.addEventListener("submit", submitMemo);

const sortForm = document.querySelector("#memo-sort");
sortForm.addEventListener("submit", onSort);

readMemo();

function hexToBinary(hex) {
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}

const renderProfile = (value) => {
  const avatar = document.querySelector("#my-avatar");
  const bio = document.querySelector("#my-bio");
  bio.innerText = value.description;

  const binaryImageData = hexToBinary(value.avatar);
  const blob = new Blob([new Uint8Array(binaryImageData)], {
    type: "image/jpeg",
  });
  // console.log("uri", value.avatar);
  avatar.src = URL.createObjectURL(blob);
};

const getProfile = async () => {
  const token = window.localStorage.getItem("token");
  const res = await fetch("/getProfile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const resJson = await res.json();
  console.log(resJson);
  renderProfile(resJson[0]);
};
getProfile();
