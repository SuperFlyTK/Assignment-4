// UI elements
const taskForm = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const statusInput = document.getElementById("status");
const dueDateInput = document.getElementById("dueDate");
const taskTable = document.getElementById("taskTable");
const clearBtn = document.getElementById("clearBtn");
const createBtn = document.getElementById("createBtn");

const methodSelect = document.getElementById("method");
const endpointInput = document.getElementById("endpoint");
const bodyInput = document.getElementById("body");
const sendBtn = document.getElementById("sendBtn");
const responsePre = document.getElementById("response");
const clearResponseBtn = document.getElementById("clearResponseBtn");

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const logoutBtn = document.getElementById("logoutBtn");
const userStatus = document.getElementById("userStatus");
const regBtn = document.getElementById("regBtn");

// helper - show response
function showResponse(obj) {
  if (typeof obj === "string") {
    responsePre.textContent = obj;
    return;
  }
  try {
    responsePre.textContent = JSON.stringify(obj, null, 2);
  } catch (e) {
    responsePre.textContent = String(obj);
  }
}

// fetch wrapper that includes credentials (cookies)
async function apiFetch(url, options = {}) {
  const opts = {
    credentials: 'include', // important for session cookies
    headers: { 'Content-Type': 'application/json' },
    ...options
  };
  if (opts.body && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(url, opts);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = await res.text();
  }
  return { status: res.status, ok: res.ok, data };
}

// ========== Postman-like console ==========

sendBtn.addEventListener("click", async () => {
  const method = methodSelect.value;
  const endpoint = endpointInput.value.trim();
  const rawBody = bodyInput.value.trim();

  let body = undefined;
  if (rawBody) {
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      showResponse("Invalid JSON body");
      return;
    }
  }

  showResponse({ status: "sending", method, endpoint, body });

  try {
    const res = await apiFetch(endpoint, { method, body });
    showResponse({ status: res.status, ok: res.ok, data: res.data });
    await checkAuthState(); // session state may change (login/logout)
    if (endpoint.startsWith("/api/tasks")) {
      loadTasks(); // refresh list if we changed tasks
    }
  } catch (e) {
    showResponse(String(e));
  }
});

clearResponseBtn.addEventListener("click", () => { responsePre.textContent = ""; });

// ========== Tasks: load/create/update/delete ==========

async function loadTasks() {
  try {
    const res = await apiFetch("/api/tasks", { method: "GET" });
    if (!res.ok) {
      showResponse({ status: res.status, data: res.data });
      taskTable.innerHTML = "";
      return;
    }
    const tasks = res.data || [];
    taskTable.innerHTML = tasks.map(t => renderTaskRow(t)).join("");
  } catch (e) {
    showResponse(String(e));
  }
}

function renderTaskRow(t) {
  const due = t.dueDate ? t.dueDate.substring(0,10) : "-";
  return `
    <tr>
      <td>${escapeHtml(t.title)}</td>
      <td>${escapeHtml(t.category || "-")}</td>
      <td class="priority-${t.priority}">${t.priority}</td>
      <td class="status-${t.status}">${t.status}</td>
      <td>${due}</td>
      <td>
        <button class="small" onclick="editTask('${t._id}')">Edit</button>
        <button class="small muted" onclick="deleteTask('${t._id}')">Delete</button>
        <button class="small muted" onclick="getTask('${t._id}')">GET</button>
      </td>
    </tr>
  `;
}

window.editTask = async function(id) {
  try {
    const res = await apiFetch(`/api/tasks/${id}`, { method: "GET" });
    if (!res.ok) {
      showResponse(res.data);
      return;
    }
    const t = res.data;
    taskIdInput.value = t._id;
    titleInput.value = t.title || "";
    descriptionInput.value = t.description || "";
    categoryInput.value = t.category || "";
    priorityInput.value = t.priority || "Medium";
    statusInput.value = t.status || "Pending";
    dueDateInput.value = t.dueDate ? t.dueDate.substring(0,10) : "";
    // scroll to form
    taskForm.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    showResponse(String(e));
  }
};

window.getTask = async function(id) {
  try {
    const res = await apiFetch(`/api/tasks/${id}`, { method: "GET" });
    showResponse({ status: res.status, data: res.data });
  } catch (e) {
    showResponse(String(e));
  }
};

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = taskIdInput.value;
  const payload = {
    title: titleInput.value,
    description: descriptionInput.value,
    category: categoryInput.value,
    priority: priorityInput.value,
    status: statusInput.value,
    dueDate: dueDateInput.value || null
  };

  try {
    if (id) {
      // update
      const res = await apiFetch(`/api/tasks/${id}`, { method: "PUT", body: payload });
      showResponse({ action: "update", status: res.status, data: res.data });
    } else {
      const res = await apiFetch("/api/tasks", { method: "POST", body: payload });
      showResponse({ action: "create", status: res.status, data: res.data });
    }
    clearForm();
    await loadTasks();
  } catch (e) {
    showResponse(String(e));
  }
});

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  clearForm();
});

async function deleteTask(id) {
  if (!confirm("Удалить задачу?")) return;
  try {
    const res = await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
    showResponse({ action: "delete", status: res.status, data: res.data });
    await loadTasks();
  } catch (e) {
    showResponse(String(e));
  }
}

function clearForm() {
  taskIdInput.value = "";
  titleInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";
  priorityInput.value = "Medium";
  statusInput.value = "Pending";
  dueDateInput.value = "";
}

// ========== Auth: login / register (dev) / logout ==========

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showResponse("Email and password required");
    return;
  }

  try {
    const res = await apiFetch("/api/auth/login", { method: "POST", body: { email, password } });
    showResponse({ login: res.status, data: res.data });
    await checkAuthState();
    await loadTasks();
  } catch (e) {
    showResponse(String(e));
  }
});

// Simple register for development/demo; on real project you might disable create-users via UI
regBtn.addEventListener("click", async () => {
  const email = prompt("Enter email for new user (dev):");
  const password = prompt("Enter password:");
  if (!email || !password) return;

  try {
    const res = await apiFetch("/api/auth/register", { method: "POST", body: { email, password } });
    showResponse({ register: res.status, data: res.data });
  } catch (e) {
    showResponse(String(e));
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    const res = await apiFetch("/api/auth/logout", { method: "POST" });
    showResponse({ logout: res.status, data: res.data });
    await checkAuthState();
  } catch (e) {
    showResponse(String(e));
  }
});

// check session state, adjust UI
async function checkAuthState() {
  try {
    // We'll call a small endpoint that returns current user or status.
    const res = await apiFetch("/api/auth/me", { method: "GET" });
    if (res.ok && res.data && res.data.email) {
      userStatus.textContent = `User: ${res.data.email}`;
      logoutBtn.style.display = "inline-block";
      loginForm.style.display = "none";
    } else {
      userStatus.textContent = "Неавторизован";
      logoutBtn.style.display = "none";
      loginForm.style.display = "block";
    }
  } catch (e) {
    userStatus.textContent = "Неавторизован";
    logoutBtn.style.display = "none";
    loginForm.style.display = "block";
  }
}

// ========== small helpers ==========

function escapeHtml(s) {
  if (!s && s !== 0) return "";
  return String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

// init
(async function init() {
  await checkAuthState();
  await loadTasks();
})();
