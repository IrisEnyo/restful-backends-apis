const remove = document.getElementById("remove");
const addForm = document.getElementById("add-form");
const inputTodo = document.getElementById("input-todo");
const todoList = document.getElementById("todo-list");
const filterSection = document.getElementById("filter-section");

// Load state from API
let todos = [];

if (todos.length === 0) {
  todos.push({ id: 1, description: "Set your priority!", done: false });
}

// Load Todo from API
function loadTodoFromApi() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((apiTodos) => {
      console.log(apiTodos);
      todos = apiTodos;
      renderTodos();
    });
}

loadTodoFromApi();

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

  const newTodo = {
    description: newTodoText,
    done: false,
  };

  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((response) => response.json())
    .then((apiTodos) => {
      todos.push(apiTodos);
      renderTodos();

      inputTodo.value = "";
    });
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

  fetch(`http://localhost:4730/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ done: checkbox.checked }),
  })
    .then((response) => response.json())
    .then((updatedTodoFromApi) => {
      console.log(updatedTodoFromApi);
    });
  // Update local storage and render todos
  renderTodos();
});

// Remove done todos
remove.addEventListener("click", function () {
  todos = todos.filter((todo) => !todo.done);

  fetch(`http://localhost:4730/todos`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ done: true }),
  }).then((response) => {
    if (!response.ok) {
      // Handle error if needed
      console.error("Error removing done todos from the server");
    }

    // Update local storage and render todos
    renderTodos();
  });
});
