document.addEventListener("DOMContentLoaded", function () {
  var createModal = document.getElementById("createModal");
  var createPostBtn = document.getElementById("create-post-btn");
  var editModal = document.getElementById("editModal");
  var editForm = document.getElementById("edit-post-form");

  // Function to initialize TinyMCE
  function initializeTinyMCE() {
    if (!tinymce.get("create-post-content")) {
      console.log("Initializing TinyMCE");
      tinymce.init({
        selector: "#create-post-content",
        // ... TinyMCE configuration ...
      });
    } else {
      console.log("TinyMCE already initialized");
    }
  }

  // Event listener for opening the create post modal
  createPostBtn.onclick = function () {
    console.log("Create Post button clicked");
    createModal.style.display = "block";
    initializeTinyMCE();
  };

  // Event listener for the create post form submission
  document
    .getElementById("create-post-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const title = document.getElementById("create-post-title").value;
      const content = tinymce.get("create-post-content").getContent();

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
          if (tinymce.get("create-post-content")) {
            tinymce.get("create-post-content").remove();
          }
          fetchPosts();
        })
        .catch((error) => console.error("Error creating post:", error));
    });

  // Close modal logic
  document.getElementsByClassName("create-modal-close")[0].onclick =
    function () {
      createModal.style.display = "none";
      if (tinymce.get("create-post-content")) {
        tinymce.get("create-post-content").remove();
      }
    };

  // Function to fetch and display posts
  function fetchPosts() {
    fetch("/api/posts")
      .then((response) => response.json())
      .then((posts) => {
        const postsContainer = document.getElementById("blog-posts");
        postsContainer.innerHTML = "";
        posts.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.className = "post-card";
          postElement.innerHTML = `
                    <a href="/posts/${post._id}" class="post-link">
                        <div class="post-image" style="background-image: url('${
                          post.imageUrl || "/defaultblogpost.jpg"
                        }');"></div>
                        <h3 class="post-title">${post.title}</h3>
                    </a>
                `;
          postsContainer.appendChild(postElement);
        });
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }

  // Function to open the modal for editing a post
  window.editPost = function (id) {
    fetch(`/api/posts/${id}`)
      .then((response) => response.json())
      .then((post) => {
        document.getElementById("edit-post-title").value = post.title;
        document.getElementById("edit-post-content").value = post.content;
        editForm.dataset.id = id;
        editModal.style.display = "block";
      })
      .catch((error) => console.error("Error fetching post:", error));
  };

  // Event listener for the edit post form submission
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
        editModal.style.display = "none";
        fetchPosts();
      })
      .catch((error) => console.error("Error updating post:", error));
  };

  // Initially fetch and display all posts
  fetchPosts();
});
