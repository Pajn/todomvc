/*global angular */
'use strict';
/**
 * A simple controller for just a single todo. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

class TodoCtrl {

  constructor() {
    this.newTodo = '';
    this.editedTodo = null;
  }

  editTodo() {
    this.editedTodo = this.todo;
    // Clone the original todo to restore it on demand.
    this.originalTodo = angular.extend({}, this.todo);
  }

  saveEdits(event) {
    const todo = this.todo;

    // Blur events are automatically triggered after the form submit event.
    // This does some unfortunate logic handling to prevent saving twice.
    if (event === 'blur' && this.saveEvent === 'submit') {
      this.saveEvent = null;
      return;
    }

    this.saveEvent = event;

    if (this.reverted) {
      // Todo edits were reverted-- don't save.
      this.reverted = null;
      return;
    }

    todo.title = todo.title.trim();

    if (todo.title === this.originalTodo.title) {
      this.editedTodo = null;
      return;
    }

    this.store[todo.title ? 'put' : 'delete'](todo)
      .catch(() => {
        todo.title = this.originalTodo.title;
      })
      .finally(() => {
        this.editedTodo = null;
      });
  }

  revertEdits() {
    this.todo = this.originalTodo;
    this.editedTodo = null;
    this.originalTodo = null;
    this.reverted = true;
  };

  removeTodo() {
    this.store.delete(this.todo);
  }

  saveTodo() {
    this.store.put(this.todo);
  }

  toggleCompleted(completed) {
    this.store.put(this.todo)
      .catch(() => {
        this.todo.completed = !this.todo.completed;
      });
  }
}

// Since classes are blocked scoped we need reference it after it has been declared.
angular.module('todomvc')
  .component('todoItem', {
    templateUrl: '/app/components/todo-item/view.html',
    bindings: {
      // Allow store, editedTodo and todo to be passed as an argument using two-way binding
      todo: '=',
      store: '=',
    },
    controller: TodoCtrl,
    controllerAs: 'ctrl',
  });
