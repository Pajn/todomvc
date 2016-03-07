/*global angular */

/**
 * A simple controller for just a single todo. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
  .controller('TodoCtrl', function TodoCtrl($scope) {
    'use strict';

    $scope.newTodo = '';
    $scope.editedTodo = null;

    $scope.editTodo = function () {
      $scope.editedTodo = $scope.todo;
      // Clone the original todo to restore it on demand.
      $scope.originalTodo = angular.extend({}, $scope.todo);
    };

    $scope.saveEdits = function (event) {
      var todo = $scope.todo;

      // Blur events are automatically triggered after the form submit event.
      // This does some unfortunate logic handling to prevent saving twice.
      if (event === 'blur' && $scope.saveEvent === 'submit') {
        $scope.saveEvent = null;
        return;
      }

      $scope.saveEvent = event;

      if ($scope.reverted) {
        // Todo edits were reverted-- don't save.
        $scope.reverted = null;
        return;
      }

      todo.title = todo.title.trim();

      if (todo.title === $scope.originalTodo.title) {
        $scope.editedTodo = null;
        return;
      }

      $scope.store[todo.title ? 'put' : 'delete'](todo)
        .then(function success() {}, function error() {
          todo.title = $scope.originalTodo.title;
        })
        .finally(function () {
          $scope.editedTodo = null;
        });
    };

    $scope.revertEdits = function () {
      $scope.todo = $scope.originalTodo;
      $scope.editedTodo = null;
      $scope.originalTodo = null;
      $scope.reverted = true;
    };

    $scope.removeTodo = function () {
      $scope.store.delete($scope.todo);
    };

    $scope.saveTodo = function () {
      $scope.store.put($scope.todo);
    };
  });
