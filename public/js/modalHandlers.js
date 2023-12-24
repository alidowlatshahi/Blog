import { createPost, updatePost, fetchPosts } from "./apiService.js";
import { initializeTinyMCE } from "./tinymceinit.js";

export function setupModalHandlers() {
  console.log("modalHandlers.js: Setting up modal handlers");
  const createModal = document.getElementById("createModal");
  const createPostBtn = document.getElementById("create-post-btn");
  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("edit-post-form");

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

      createPost(title, content, () => {
        createModal.style.display = "none";
        if (tinymce.get("create-post-content")) {
          tinymce.get("create-post-content").remove();
        }
        fetchPosts();
      });
    });

  // Close modal logic for create post modal
  document.getElementsByClassName("create-modal-close")[0].onclick =
    function () {
      createModal.style.display = "none";
      if (tinymce.get("create-post-content")) {
        tinymce.get("create-post-content").remove();
      }
    };

  // Event listener for the edit post form submission
  editForm.onsubmit = function (e) {
    e.preventDefault();
    const id = editForm.dataset.id;
    const title = document.getElementById("edit-post-title").value;
    const content = document.getElementById("edit-post-content").value;

    updatePost(id, title, content, () => {
      editModal.style.display = "none";
      fetchPosts();
    });
  };

  // Close modal logic for edit post modal
  document.getElementsByClassName("edit-modal-close")[0].onclick = function () {
    editModal.style.display = "none";
  };
}
