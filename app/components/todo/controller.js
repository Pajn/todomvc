/*global angular */

/**
 * A simple controller for just a single todo. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
  .directive('todo', () => ({
    templateUrl: '/app/components/todo/view.html',
    // Only allow the directuve to be used as a HTML Element
    restrict: 'E',
    scope: {
      // Specify attributes where parents can pass and receive data here
      // Syntax name: 'FLAG'
      // FLAGS:
      // = Two way data binding
      // @ One way incoming expression (like placeholder)
      // & One way outgoing behaviour (like ng-click)
      todo: '=',
      store: '=',
    },
    bindToController: true,
    controller: TodoCtrl,
    controllerAs: 'ctrl',
  }));

function TodoCtrl() {
	'use strict';

	this.newTodo = '';
	this.editedTodo = null;

	this.editTodo = function () {
		this.editedTodo = this.todo;
		// Clone the original todo to restore it on demand.
		this.originalTodo = angular.extend({}, this.todo);
	};

	this.saveEdits = function (event) {
    var todo = this.todo;

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
			.then(function success() {}, function error() {
				todo.title = this.originalTodo.title;
			})
			.finally(function () {
				this.editedTodo = null;
			});
	};

	this.revertEdits = function () {
		todos[todos.indexOf(todo)] = this.originalTodo;
		this.editedTodo = null;
		this.originalTodo = null;
		this.reverted = true;
	};

	this.removeTodo = function () {
		this.store.delete(this.todo);
	};

	this.saveTodo = function () {
		this.store.put(this.todo);
	};

	this.toggleThisTodoCompleted = function (completed) {
		if (angular.isDefined(completed)) {
			this.todo.completed = completed;
		}
    this.toggleCompleted(todo)
	};
}
