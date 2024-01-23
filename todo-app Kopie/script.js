const remove = document.getElementById("remove");
const addForm = document.getElementById("add-form");
const inputTodo = document.getElementById("input-todo");
const todoList = document.getElementById("todo-list");
const filterSection = document.getElementById("filter-section");

// Load state from local storage
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Add a default todo to the app state
if (todos.length === 0) {
  todos.push({ id: 1, description: "Set your priority!", done: false });
}

// Function to render todos
function renderTodos() {
  const selectedFilter = document.querySelector(
    'input[name="filter"]:checked'
  ).value;

  todoList.innerHTML = "";

  for (const todo of todos) {
    if (
      (selectedFilter === "done" && todo.done) ||
      (selectedFilter === "open" && !todo.done) ||
      selectedFilter === "all"
    ) {
      const newTodoLi = document.createElement("li");
      newTodoLi.dataset.id = todo.id;
      newTodoLi.innerText = todo.description;

      const checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");
      checkBox.checked = todo.done;
      newTodoLi.appendChild(checkBox);

      if (todo.done) {
        newTodoLi.style.textDecoration = "line-through";
      }

      todoList.appendChild(newTodoLi);
    }
  }
}

// Add Todos to the List
function addTodo() {
  const newTodoText = inputTodo.value.trim().toLowerCase();

  // Duplicate check
  if (todos.some((todo) => todo.description.toLowerCase() === newTodoText)) {
    swal({
      title: "Todo already exists! \uD83D\uDE00",
      icon: "success",
    });
    return;
  }

  if (newTodoText.length < 2) {
    return;
  }

  // Generate unique ID
  const newTodoId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;

  const newTodo = { id: newTodoId, description: newTodoText, done: false };
  todos.push(newTodo);

  // Update local storage and render todos
  updateLocalStorage();
  renderTodos();

  inputTodo.value = "";
}

// Function to update local storage
function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

addForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addTodo();
});

// Event listener for filter buttons
filterSection.addEventListener("click", function (event) {
  if (event.target.type === "radio") {
    renderTodos();
  }
});

// Event listener for checkbox changes
todoList.addEventListener("change", function (e) {
  const checkbox = e.target;
  const li = checkbox.parentElement;
  const todoId = parseInt(li.dataset.id);

  // Update the state when the checkbox is changed
  todos = todos.map((todo) =>
    todo.id === todoId ? { ...todo, done: checkbox.checked } : todo
  );

  // Update local storage and render todos
  updateLocalStorage();
  renderTodos();
});

// Remove done todos
remove.addEventListener("click", function () {
  todos = todos.filter((todo) => !todo.done);

  // Update local storage and render todos
  updateLocalStorage();
  renderTodos();
});

// Initial render
renderTodos();
