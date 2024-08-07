document.addEventListener("DOMContentLoaded", () => {
  const projectForm = document.getElementById("projectForm");
  const projectIdInput = document.getElementById("projectId");
  const projectNameInput = document.getElementById("projectName");
  const projectTableBody = document.getElementById("projectTableBody");
  const errorMessage = document.getElementById("errorMessage");
  const saveButton = document.getElementById("saveButton");

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectId = projectIdInput.value.trim();
    const projectName = projectNameInput.value.trim();
    errorMessage.style.display = "none";

    if (!/^\d+$/.test(projectId)) {
      showError("Inserire solo numeri come ID");
      return;
    }

    const formattedProjectName = formatProjectName(projectName);

    if (projectId && formattedProjectName) {
      if (isDuplicateProject(projectId, formattedProjectName)) {
        showError("ID o nome del progetto già esistente");
        return;
      }
      addProject(projectId, formattedProjectName);
      projectIdInput.value = "";
      projectNameInput.value = "";
    }
  });

  saveButton.addEventListener("click", () => {
    saveProjectsToLocalStorage();
  });

  function formatProjectName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  function isDuplicateProject(id, name) {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    return projects.some(
      (project) =>
        project.id === id || project.name.toLowerCase() === name.toLowerCase()
    );
  }

  function addProject(id, name) {
    const row = document.createElement("tr");
    const idCell = document.createElement("td");
    const nameCell = document.createElement("td");
    const deleteBtn = document.createElement("button");

    idCell.textContent = id;
    nameCell.textContent = name;
    deleteBtn.textContent = "×";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
      row.remove();
      deleteProjectFromLocalStorage(id);
    });

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(deleteBtn);
    projectTableBody.appendChild(row);
  }

  function saveProjectsToLocalStorage() {
    const projects = [];
    const rows = projectTableBody.querySelectorAll("tr");
    rows.forEach(row => {
      const id = row.children[0].textContent;
      const name = row.children[1].textContent;
      projects.push({ id, name });
    });
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  function deleteProjectFromLocalStorage(id) {
    let projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects = projects.filter((project) => project.id !== id);
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  function loadProjectsFromLocalStorage() {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects.forEach((project) => {
      addProject(project.id, project.name);
    });
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  loadProjectsFromLocalStorage();
});
