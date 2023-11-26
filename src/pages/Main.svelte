<script>
  import { getDatabase, ref, onValue } from "firebase/database";
  import { onMount } from "svelte";

  const db = getDatabase();
  const usersRef = ref(db, "users/");
  $: myData = { bio: "", avatar: "" };

  onMount(() => {
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      const key = Object.keys(data)[Object.keys(data).length - 1];
      myData = data[key];
      console.log(myData);
    });
  });
</script>

<h1>FancyMemo</h1>
<a href="/#/addProfile" class="setting">Setting</a>

<div id="my-profile">
  <!-- svelte-ignore a11y-missing-attribute -->
  <img id="my-avatar" src={myData.avatar} />
  <div id="my-bio">{myData.bio}</div>
</div>

<form id="memo-form">
  <input type="text" placeholder="input please..." required id="memo-input" />
  <button type="submit">Add Memo!</button>
</form>

<form id="memo-sort">
  <select id="sort-type">
    <option value="">unsorted</option>
    <option>createTime</option>
    <option>name</option>
  </select>
  <button type="submit">sort</button>
</form>

<ul id="memo-list"></ul>
