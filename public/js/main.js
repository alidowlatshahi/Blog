import { setupModalHandlers } from "./modalHandlers.js";
import { fetchPosts } from "./apiService.js";
fetchPosts();
document.addEventListener("DOMContentLoaded", function () {
  console.log("main.js: DOMContentLoaded event triggered");
  setupModalHandlers();
});
