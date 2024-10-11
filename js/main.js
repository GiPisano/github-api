const query = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchType = document.getElementById("searchType");
const results = document.getElementById("results");
const loader = document.getElementById("loader");

// EventListener for the search btn
searchBtn.addEventListener("click", function () {
  const queryValue = searchInput.value.trim();
  const typeValue = searchType.value;

  if (queryValue.length < 3) {
    alert("Please enter at least 3 characters.");
    return;
  }

  searchGitHub(queryValue, typeValue);
});

// Function to search for type based on the input query
function searchGitHub(query, type) {
  let url = "";

  // Show loader while fetching data
  showLoader();

  if (type === "repositories") {
    url = `https://api.github.com/search/repositories?q=${query}`;
  } else if (type === "users") {
    url = `https://api.github.com/search/users?q=${query}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      hideLoader();

      if (type === "repositories") {
        if (data.items.length === 0) {
          results.innerHTML = `<p class="no-found-error">No repository found with the name "${query}".</p>`;
        } else {
          displayRepositories(data.items);
        }
      } else {
        if (data.items.length === 0) {
          results.innerHTML = `<p class="no-found-error">No user/organization found with the name "${query}".</p>`;
        } else {
          displayUsers(data.items);
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      results.innerHTML = `<p class="no-found-error">An error occurred during the search.</p>`;
    });
}

/// Function to show loader
function showLoader() {
  loader.style.display = "block";
}

// Function to hide loader
function hideLoader() {
  loader.style.display = "none";
}

// Display results for repositories
function displayRepositories(repositories) {
  results.innerHTML = "";

  const row = document.createElement("div");
  row.classList.add("row");

  repositories.forEach((repo) => {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-6", "col-lg-3", "mb-4");

    const card = `
      <div class="card h-100">
        <div class="card-header text-center bg-primary text-white">
          <h5 class="card-title">${repo.name}</h5>
        </div>
        <div class="card-body">
          <p class="card-text">${
            repo.description || "No description available."
          }</p>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between">
            <span><i class="fa-solid fa-star"></i> ${
              repo.stargazers_count
            }</span>
            <span><i class="fa-solid fa-code-fork"></i> ${
              repo.forks_count
            }</span>
          </div>
          <a href="${
            repo.html_url
          }" target="_blank" class="btn btn-link">Go to Repo</a>
        </div>
      </div>
    `;

    col.innerHTML = card;
    row.appendChild(col);
  });

  results.appendChild(row);
}

// Display results for users/organizations
function displayUsers(users) {
  results.innerHTML = "";

  const row = document.createElement("div");
  row.classList.add("row");

  users.forEach((user) => {
    const col = document.createElement("div");
    col.classList.add("col-12", "col-md-6", "col-lg-3", "mb-4");

    const card = `
      <div class="card">
        <div class="card-header text-center">
          <img src="${user.avatar_url}" alt="User Avatar" class="img-fluid rounded-circle mb-2" style="width: 80px; height: 80px;">
          <h5 class="card-title">${user.login}</h5>
        </div>
        <div class="card-body text-center">
          <a href="${user.html_url}" target="_blank" class="btn btn-primary">View Profile</a>
        </div>
      </div>
    `;

    col.innerHTML = card;
    row.appendChild(col);
  });

  results.appendChild(row);
}
