<script>
  import { getDatabase, ref, set, push } from "firebase/database";
  import {
    getStorage,
    ref as refImg,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";
  import { user$ } from "../store";

  const storage = getStorage();
  let files;
  const uploadFile = async () => {
    const file = files[0];
    const name = file.name;
    const imgRef = refImg(storage, name);
    await uploadBytes(imgRef, file);
    imgUrl = await getDownloadURL(imgRef);
    console.log(imgUrl);
  };
  let bio;
  let username = "hay";
  let imgUrl;
  async function writeUserData() {
    await uploadFile();
    const db = getDatabase();
    push(ref(db, "users/"), {
      username,
      bio,
      avatar: imgUrl,
      createTime: new Date().getTime(),
    });

    window.location.hash = "/";
  }

  const logout = () => {
    localStorage.removeItem("token");
    user$.set(null);
  };
</script>

<div class="wrapper">
  <form id="profile" on:submit|preventDefault={writeUserData} class="wrapper">
    <label for="avatar">upload my avatar</label>
    <input type="file" id="avatar" name="image" required bind:files />
    <input
      type="text"
      placeholder="type your description"
      name="bio"
      required
      bind:value={bio}
    />
    <button type="submit">Save</button>
  </form>
  <button on:click={logout}>Log Out</button>
</div>

<style>
  .wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
