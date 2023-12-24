console.log("apiService.js: Loaded");

export function fetchPosts() {
  console.log("apiService.js: Fetching posts");
  fetch("/api/posts")
    .then((response) => {
      console.log("apiService.js: Received response");
      return response.json(); // This line can be omitted if you prefer your original structure
    })
    .then((posts) => {
      console.log("apiService.js: Processing posts", posts);
      const postsContainer = document.getElementById("blog-posts");
      if (!postsContainer) {
        console.error("apiService.js: 'blog-posts' container not found");
        return;
      }
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
    .catch((error) =>
      console.error("apiService.js: Error fetching posts:", error)
    );
}

// Function to create a new post
export function createPost(title, content, callback) {
  fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  })
    .then((response) => response.json())
    .then(() => {
      if (callback) callback();
    })
    .catch((error) => console.error("Error creating post:", error));
}

// Function to update an existing post
export function updatePost(id, title, content, callback) {
  fetch(`/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  })
    .then((response) => response.json())
    .then(() => {
      if (callback) callback();
    })
    .catch((error) => console.error("Error updating post:", error));
}

// Function to delete a post
export function deletePost(id, callback) {
  fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      if (callback) callback();
    })
    .catch((error) => console.error("Error deleting post:", error));
}
