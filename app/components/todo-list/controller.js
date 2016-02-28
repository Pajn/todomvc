/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
  .directive('todoList', () => ({
    templateUrl: '/app/components/todo-list/view.html',
    // Only allow the directuve to be used as a HTML Element
    restrict: 'E',
    scope: {
      // Specify attributes where parents can pass and receive data here
      // Syntax name: 'FLAG'
      // FLAGS:
      // = Two way data binding
      // @ One way incoming expression (like placeholder)
      // & One way outgoing behaviour (like ng-click)
      store: '=',
    },
    bindToController: true,
    controller: TodoListCtrl,
    controllerAs: 'ctrl',
  }));

function TodoListCtrl($routeParams, $filter, $scope) {
  console.log('asdasd')
	'use strict';

	var todos = this.todos = this.store.todos;

	$scope.$watch('todos', function () {
		this.remainingCount = $filter('filter')(todos, { completed: false }).length;
		this.completedCount = todos.length - this.remainingCount;
		this.allChecked = !this.remainingCount;
	}, true);

	// Monitor the current route for changes and adjust the filter accordingly.
	$scope.$on('$routeChangeSuccess', function () {
		var status = this.status = $routeParams.status || '';
		this.statusFilter = (status === 'active') ?
			{ completed: false } : (status === 'completed') ?
			{ completed: true } : {};
	});

	this.addTodo = function () {
		var newTodo = {
			title: this.newTodo.trim(),
			completed: false
		};

		if (!newTodo.title) {
			return;
		}

		this.saving = true;
		this.store.insert(newTodo)
			.then(function success() {
				this.newTodo = '';
			})
			.finally(function () {
				this.saving = false;
			});
	};

	this.toggleCompleted = function (todo) {
		this.store.put(this.todo, todos.indexOf(this.todo))
			.then(function success() {}, function error() {
				this.todo.completed = !this.todo.completed;
			});
	};

	this.clearCompletedTodos = function () {
		this.store.clearCompleted();
	};

	this.markAll = function (completed) {
		todos.forEach(function (todo) {
			if (todo.completed !== completed) {
				this.toggleCompleted(todo, completed);
			}
		});
	};
}
