/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
  .component('todoList', {
    templateUrl: '/app/components/todo-list/view.html',
    bindings: {
      // Allow store to be passed as an argument using two-way binding
      store: '=',
    },
    controller: TodoListCtrl,
    controllerAs: 'ctrl',
  });

function TodoListCtrl($routeParams, $filter, $scope) {
  'use strict';

  var ctrl = this;

  var todos = ctrl.todos = ctrl.store.todos;

  $scope.$watch('ctrl.todos', function () {
    ctrl.remainingCount = $filter('filter')(todos, { completed: false }).length;
    ctrl.completedCount = todos.length - ctrl.remainingCount;
    ctrl.allChecked = !ctrl.remainingCount;
  }, true);

  // As we now have a parent controller in the router, we don't need to wait for it to be finished
  // anymore
  var status = ctrl.status = $routeParams.status || '';
  ctrl.statusFilter = (ctrl.status === 'active') ?
    { completed: false } : (ctrl.status === 'completed') ?
    { completed: true } : {};

  ctrl.addTodo = function () {
    var newTodo = {
      title: ctrl.newTodo.trim(),
      completed: false
    };

    if (!newTodo.title) {
      return;
    }

    ctrl.saving = true;
    ctrl.store.insert(newTodo)
      .then(function success() {
        ctrl.newTodo = '';
      })
      .finally(function () {
        ctrl.saving = false;
      });
  };

  ctrl.toggleCompleted = function (todo, completed) {
    if (angular.isDefined(completed)) {
      todo.completed = completed;
    }

    ctrl.store.put(todo)
      .then(function success() {}, function error() {
        todo.completed = !todo.completed;
      });
  };

  ctrl.clearCompletedTodos = function () {
    ctrl.store.clearCompleted();
  };

  ctrl.markAll = function (completed) {
    todos.forEach(function (todo) {
      if (todo.completed !== completed) {
        ctrl.toggleCompleted(todo, completed);
      }
    });
  };
}
