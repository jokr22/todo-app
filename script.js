let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const reasonInput = document.getElementById("reasonInput");
  const dateInput = document.getElementById("dateInput");
  const timeInput = document.getElementById("timeInput");

  const taskText = taskInput.value.trim();
  const taskReason = reasonInput.value.trim();
  const taskDate = dateInput.value;
  const taskTime = timeInput.value;

  if (taskText) {
    tasks.push({
      id: Date.now(),
      text: taskText,
      reason: taskReason,
      date: taskDate,
      time: taskTime,
      completed: false,
    });

    // Sort tasks by date and time
    tasks.sort((a, b) => {
      const dateTimeA = new Date(a.date + " " + a.time);
      const dateTimeB = new Date(b.date + " " + b.time);
      return dateTimeA - dateTimeB;
    });

    saveTasks();
    renderTasks();

    // Clear all inputs
    taskInput.value = "";
    reasonInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
  }
}

document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  currentFilter = filter;
  document
    .querySelectorAll(".filters button")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .getElementById("filter" + filter.charAt(0).toUpperCase() + filter.slice(1))
    .classList.add("active");
  renderTasks();
}

function formatDateTime(date, time) {
  if (!date && !time) return "-";
  if (!time) return date || "-";
  if (!date) return time;
  return date + " " + time;
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const taskCount = document.getElementById("taskCount");

  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  const activeCount = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} left`;

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <p>${currentFilter === "all" ? "No tasks yet! Add one above ⬆️" : "No " + currentFilter + " tasks"}</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  taskList.innerHTML = filteredTasks
    .map(
      (task) => `
    <tr class="${task.completed ? "completed" : ""}">
      <td>
        <div class="task-checkbox" onclick="toggleTask(${task.id})"></div>
      </td>
      <td class="task-text">${escapeHtml(task.text)}</td>
      <td class="task-reason">${escapeHtml(task.reason) || "-"}</td>
      <td class="task-datetime">${formatDateTime(task.date, task.time)}</td>
      <td>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </td>
    </tr>
  `,
    )
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

renderTasks();
