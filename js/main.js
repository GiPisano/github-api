const query = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

// EventListener for search btn
searchBtn.addEventListener("click", function () {
  const query = searchInput.value.trim();

  if (query.length === 0) {
    alert("Inserisci un nome per cercare i repository.");
    return;
  }

  searchRepositories(query);
});

// Function "search the repositoies" (input)
function searchRepositories(query) {
  const url = `https://api.github.com/search/repositories?q=${query}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayResults(data.items);
    })
    .catch((error) => {
      console.error("Errore:", error);
      results.innerHTML =
        "<p>Si è verificato un errore durante la ricerca.</p>";
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
