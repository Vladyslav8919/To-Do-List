"use strict";

// *Selecting*
const container = document.querySelector(".container");
const form = document.querySelector(".form");
const todoInput = document.querySelector(".todo-input");
const inputBtn = document.querySelector(".input-btn");
const list = document.querySelector(".todo-list");

let todoItems = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = todoInput.value.trim();
  if (text !== "") {
    addToDo(text);

    todoInput.value = "";
    todoInput.focus();
  }
});

const renderTodo = function (todo) {
  const item = document.querySelector(`[data-key="${todo.id}"]`);

  if (todo.deleted) {
    item.remove();

    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }

  const isChecked = todo.checked ? "done" : "";
  const node = document.createElement("li");
  node.setAttribute("class", `todo-item ${isChecked}`);
  node.setAttribute("data-key", `${todo.id}`);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox" class="todo-tick"/>

    <label for="${todo.id}" class="todo-item--label tick js-tick"><span class="todo-item--span">${todo.text}</span></label>
    
    <button class="todo-remove">✕</button>
  `;

  if (item) {
    list.replaceChild(node, item);
    document.querySelector('[type="checkbox"]').setAttribute("checked", "");
  } else {
    list.append(node);
  }

  localStorage.setItem("todoItemsRef", JSON.stringify(todoItems));
};

const addToDo = function (text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };
  todoItems.push(todo);
  renderTodo(todo);
};

list.addEventListener("click", function (e) {
  if (e.target.classList.contains("todo-tick")) {
    const itemKey = e.target.parentElement.dataset.key;
    toggleChecked(itemKey);
  }

  // if (e.target.classList.contains("todo-tick")) {

  // }

  if (e.target.classList.contains("todo-remove")) {
    const itemKey = e.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

const toggleChecked = function (key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
};

// Deleting todo
const deleteTodo = function (key) {
  const index = todoItems.findIndex((item) => item.id === Number(key));

  const todo = {
    deleted: true,
    ...todoItems[index],
  };

  todoItems = todoItems.filter((item) => item.id !== Number(key));
  renderTodo(todo);
};

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("todoItemsRef");
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach((t) => {
      renderTodo(t);
    });
  }
});
