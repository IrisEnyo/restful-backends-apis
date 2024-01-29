// Constants
const API_URL = "http://localhost:4730/todos";
const ERROR_MESSAGE = "Error communicating with the server.";

// DOM Elements
const removeButton = document.getElementById("remove");
const addForm = document.getElementById("add-form");
const inputTodo = document.getElementById("input-todo");
const todoList = document.getElementById("todo-list");
const filterSection = document.getElementById("filter-section");

// State
let todos = [];

// Initialization
initialize();

function initialize() {
  loadTodoFromApi();
  addForm.addEventListener("submit", handleAddTodo);
  filterSection.addEventListener("click", handleFilterChange);
  todoList.addEventListener("change", handleCheckboxChange);
  removeButton.addEventListener("click", handleRemoveDoneTodos);
}

// Load Todo from API
function loadTodoFromApi() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((apiTodos) => {
      todos = apiTodos;
      renderTodos();
    })
    .catch((error) => console.error(ERROR_MESSAGE, error));
}

// Render Todos
function renderTodos() {
  const selectedFilter = document.querySelector(
    'input[name="filter"]:checked'
  ).value;
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    if (
      (selectedFilter === "done" && todo.done) ||
      (selectedFilter === "open" && !todo.done) ||
      selectedFilter === "all"
    ) {
      const newTodoLi = createTodoElement(todo);
      todoList.appendChild(newTodoLi);
    }
  });
}

// Create Todo Element
function createTodoElement(todo) {
  const newTodoLi = document.createElement("li");
  newTodoLi.dataset.id = todo.id;
  newTodoLi.innerText = todo.description;

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.checked = todo.done;
  newTodoLi.appendChild(checkBox);

  if (todo.done) {
    newTodoLi.style.textDecoration = "line-through";
  }

  return newTodoLi;
}

// Add Todo
function handleAddTodo(event) {
  event.preventDefault();
  const newTodoText = inputTodo.value.trim().toLowerCase();

  if (todos.some((todo) => todo.description.toLowerCase() === newTodoText)) {
    swal({
      title: "Todo already exists! \uD83D\uDE00",
      icon: "success",
    });

    inputTodo.value = "";

    return;
  }

  const newTodo = {
    description: newTodoText,
    done: false,
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then((apiTodo) => {
      todos.push(apiTodo);
      renderTodos();
      inputTodo.value = "";
    })
    .catch((error) => console.error(ERROR_MESSAGE, error));
}

// Handle Filter Change
function handleFilterChange(event) {
  if (event.target.type === "radio") {
    renderTodos();
  }
}

// Handle Checkbox Change
function handleCheckboxChange(event) {
  const checkbox = event.target;
  const li = checkbox.parentElement;
  const todoId = parseInt(li.dataset.id);
  const todo = todos.find((todo) => todo.id === todoId);
  const description = todo.description;

  todos = todos.map((todo) =>
    todo.id === todoId ? { ...todo, done: checkbox.checked } : todo
  );

  updateTodoOnServer(todoId, {
    done: checkbox.checked,
    description: description,
  });
  renderTodos();
}

// Update Todo on Server
function updateTodoOnServer(todoId, data) {
  fetch(`${API_URL}/${todoId}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((apiTodo) => console.log(apiTodo))
    .catch((error) => console.error(ERROR_MESSAGE, error));
}

// Remove Done Todos
function handleRemoveDoneTodos() {
  todos = todos.filter((todo) => !todo.done);

  const checkedCheckboxes = todoList.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  checkedCheckboxes.forEach((checkbox) => {
    const li = checkbox.parentElement;
    const todoId = parseInt(li.dataset.id);

    fetch(`${API_URL}/${todoId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          const todoIndex = todos.findIndex((todo) => todo.id === todoId);
          if (todoIndex !== -1) {
            todos.splice(todoIndex, 1);
            li.remove();
          } else {
            console.error("Error removing done todos from the server");
          }
        }
      })
      .catch((error) => console.error(ERROR_MESSAGE, error));

    renderTodos();
  });
}
