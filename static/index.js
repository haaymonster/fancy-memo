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

const form = document.querySelector("#memo-form");

form.addEventListener("submit", submitMemo);

readMemo();
