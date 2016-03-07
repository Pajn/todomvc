/*global angular */

/**
 * A simple controller for just a single todo. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
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

function TodoCtrl() {
  'use strict';

  var ctrl = this;

  ctrl.newTodo = '';
  ctrl.editedTodo = null;

  ctrl.editTodo = function () {
    ctrl.editedTodo = ctrl.todo;
    // Clone the original todo to restore it on demand.
    ctrl.originalTodo = angular.extend({}, ctrl.todo);
  };

  ctrl.saveEdits = function (event) {
    var todo = ctrl.todo;

    // Blur events are automatically triggered after the form submit event.
    // This does some unfortunate logic handling to prevent saving twice.
    if (event === 'blur' && ctrl.saveEvent === 'submit') {
      ctrl.saveEvent = null;
      return;
    }

    ctrl.saveEvent = event;

    if (ctrl.reverted) {
      // Todo edits were reverted-- don't save.
      ctrl.reverted = null;
      return;
    }

    todo.title = todo.title.trim();

    if (todo.title === ctrl.originalTodo.title) {
      ctrl.editedTodo = null;
      return;
    }

    ctrl.store[todo.title ? 'put' : 'delete'](todo)
      .then(function success() {}, function error() {
        todo.title = ctrl.originalTodo.title;
      })
      .finally(function () {
        ctrl.editedTodo = null;
      });
  };

  ctrl.revertEdits = function () {
    todos[todos.indexOf(todo)] = ctrl.originalTodo;
    ctrl.editedTodo = null;
    ctrl.originalTodo = null;
    ctrl.reverted = true;
  };

  ctrl.removeTodo = function () {
    ctrl.store.delete(ctrl.todo);
  };

  ctrl.saveTodo = function () {
    ctrl.store.put(ctrl.todo);
  };

  ctrl.toggleCompleted = function (completed) {
    ctrl.store.put(ctrl.todo)
      .then(function success() {}, function error() {
        ctrl.todo.completed = !ctrl.todo.completed;
      });
  };
}
