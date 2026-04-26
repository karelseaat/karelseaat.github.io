function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function colorizeCards(selector) {
  document.querySelectorAll(selector).forEach((card) => {
    const hue = Math.floor(Math.random() * 360);
    const color = `hsl(${hue}, 80%, 70%)`;
    const shadowColor = `hsla(${hue}, 80%, 70%, 0.25)`;
    card.style.setProperty("--card-hover-color", color);
    card.style.setProperty("--card-shadow-color", shadowColor);
  });
}

function renderHub(groups, mount) {
  mount.innerHTML = `
    <div class="nav-grid">
      ${groups
        .map(
          (group) => `
            <a class="nav-card" href="${group.slug}.html">
              <h2>${escapeHtml(group.title)}</h2>
              <p>${escapeHtml(group.blurb)}</p>
              <div class="nav-meta">${group.repos.length} entries</div>
            </a>
          `
        )
        .join("")}
    </div>
  `;
  colorizeCards(".nav-card");
}

function renderGroup(group, projects, mount) {
  const byRepo = new Map(projects.map((project) => [project.repo, project]));
  const cards = group.repos
    .map((repo) => byRepo.get(repo))
    .filter(Boolean)
    .map(
      (project) => `
        <div class="card">
          <i class="${escapeHtml(project.iconClass)}"></i>
          <h2>${escapeHtml(project.title)}</h2>
          <p>${escapeHtml(project.description)}</p>
          <a href="${escapeHtml(project.href)}" target="_blank" rel="noopener noreferrer">View Details</a>
        </div>
      `
    )
    .join("");
  mount.innerHTML = `<div class="grid">${cards}</div>`;
  colorizeCards(".card");
}

document.addEventListener("DOMContentLoaded", () => {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const groups = window.PORTFOLIO_GROUPS || [];
  const page = document.body.dataset.page;
  const mount = document.getElementById("content");
  if (!mount) {
    return;
  }

  if (page === "index") {
    renderHub(groups, mount);
    return;
  }

  const group = groups.find((item) => item.slug === page);
  if (!group) {
    mount.innerHTML = "<p>Nothing to show here.</p>";
    return;
  }

  renderGroup(group, projects, mount);
});
