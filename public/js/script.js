document.addEventListener("DOMContentLoaded", function () {
  // Get the modal elements and the forms inside them
  var modal = document.getElementById("editModal");
  var editForm = document.getElementById("edit-post-form");
  var createModal = document.getElementById("createModal");
  var createPostBtn = document.getElementById("create-post-btn");

  // Function to fetch and display posts
  function fetchPosts() {
    fetch("/api/posts")
      .then((response) => response.json())
      .then((posts) => {
        const postsContainer = document.getElementById("blog-posts");
        postsContainer.innerHTML = ""; // Clear existing posts
        posts.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.innerHTML = `
              <h3>${post.title}</h3>
              <p>${post.content}</p>
              <button onclick="editPost('${post._id}')">Edit</button>
              <button onclick="deletePost('${post._id}')">Delete</button>
            `;
          postsContainer.appendChild(postElement);
        });
      })
      .catch((error) => console.error("Error fetching posts:", error));

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post-card";
      postElement.innerHTML = `
          <div class="post-image"></div> <!-- Placeholder for post image if you want to add one -->
          <div class="post-content">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-body">${post.content.substring(
              0,
              200
            )}...</p> <!-- Display a snippet -->
            <button onclick="editPost('${post._id}')">Edit</button>
            <button onclick="deletePost('${post._id}')">Delete</button>
          </div>
        `;
      postsContainer.appendChild(postElement);
    });
  }

  // Function to open the modal for editing a post
  window.editPost = function (id) {
    fetch(`/api/posts/${id}`)
      .then((response) => response.json())
      .then((post) => {
        document.getElementById("edit-post-title").value = post.title;
        document.getElementById("edit-post-content").value = post.content;
        editForm.dataset.id = id;
        modal.style.display = "block";
      })
      .catch((error) => console.error("Error fetching post:", error));
  };

  // Attach event listeners
  createPostBtn.onclick = function () {
    createModal.style.display = "block";
  };

  document.getElementsByClassName("create-modal-close")[0].onclick =
    function () {
      createModal.style.display = "none";
    };

  editForm.onsubmit = function (e) {
    e.preventDefault();
    const id = editForm.dataset.id;
    const title = document.getElementById("edit-post-title").value;
    const content = document.getElementById("edit-post-content").value;

    fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => response.json())
      .then(() => {
        modal.style.display = "none";
        fetchPosts();
      })
      .catch((error) => console.error("Error updating post:", error));
  };

  document
    .getElementById("create-post-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const title = document.getElementById("create-post-title").value;
      const content = document.getElementById("create-post-content").value;

      fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      })
        .then((response) => response.json())
        .then(() => {
          createModal.style.display = "none";
          fetchPosts();
        })
        .catch((error) => console.error("Error creating post:", error));
    });

  document.getElementsByClassName("close")[0].onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == createModal) {
      createModal.style.display = "none";
    }
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Function to delete a post
  window.deletePost = function (id) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    fetch(`/api/posts/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchPosts();
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  // Function to create a new post
  function createPost() {
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;

    fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchPosts();
      })
      .catch((error) => console.error("Error creating post:", error));
  }

  // Initially fetch and display all posts
  fetchPosts();
});
