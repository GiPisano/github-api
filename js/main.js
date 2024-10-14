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

let currentPage = 1;
const perPage = 28;
const paginationElement = document.getElementById("pagination");

// Function to search for type based on the input query
function searchGitHub(query, type, page = 1) {
  const url = `https://api.github.com/search/${type}?q=${query}&per_page=${perPage}&page=${page}`;
  showLoader();

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      hideLoader();
      if (data.items.length) {
        type === "repositories"
          ? displayRepositories(data.items)
          : displayUsers(data.items);
        createPagination(Math.ceil(data.total_count / perPage), query, type);
      } else {
        results.innerHTML = `<p>No ${type} found.</p>`;
      }
    });
}

function createPagination(totalPages, query, type) {
  let paginationHTML = `
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#">&laquo;</a>
    </li>`;

  // Loop to generate the numbered pages
  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${currentPage === i ? "active" : ""}">
        <a class="page-link" href="#">${i}</a>
      </li>`;
  }

  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#">&raquo;</a>
    </li>
  `;

  paginationElement.innerHTML = paginationHTML;

  paginationElement.querySelectorAll(".page-link").forEach((link, i) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (i === 0 && currentPage > 1) currentPage--; // "Previous"
      else if (i === totalPages + 1 && currentPage < totalPages)
        currentPage++; // "Next"
      else if (i > 0 && i <= totalPages) currentPage = i; // numbers
      searchGitHub(query, type, currentPage);
    });
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
           <img src="${
             repo.owner.avatar_url
           }" alt="User Avatar" class="img-fluid rounded-circle mb-2" style="width: 80px; height: 80px;">
        </div>
        <div class="card-body">
        <h5 class="card-title">${repo.name}</h5>
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
