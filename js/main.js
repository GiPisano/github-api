const query = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

// EventListener for the search btn
searchBtn.addEventListener("click", function () {
  const query = searchInput.value.trim();

  if (query.length === 0) {
    alert("Please enter a name to search for repositories.");
    return;
  }

  searchRepositories(query);
});

// Function to search for repositories based on the input query
function searchRepositories(query) {
  const url = `https://api.github.com/search/repositories?q=${query}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayResults(data.items);
    })
    .catch((error) => {
      console.error("Errore:", error);
      results.innerHTML = "<p>An error occurred during the search.</p>";
    });
}

// Display Results
function displayResults(repositories) {
  results.innerHTML = "";

  repositories.forEach((repo) => {
    const repoElement = document.createElement("p");
    repoElement.textContent = repo.name;
    results.appendChild(repoElement);
  });
}
