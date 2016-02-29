/*global angular */
'use strict'

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */

class TodoListCtrl {

  constructor($routeParams, $filter, $scope) {
    const cleanup = $scope.$watch('ctrl.store', () => {
      this.todos = this.store.todos;
      // We only need to know when the ctrl.store is first set, so clean up the watcher as soon
      // as possible.
      cleanup();
    });

    $scope.$watch('ctrl.todos', () => {
      this.remainingCount = $filter('filter')(this.todos, { completed: false }).length;
      this.completedCount = this.todos.length - this.remainingCount;
      this.allChecked = !this.remainingCount;
    }, true);

    this.status = $routeParams.status || '';

    this.statusFilter = (this.status === 'active') ?
      { completed: false } : (this.status === 'completed') ?
      { completed: true } : {};
  }

	addTodo() {
		const newTodo = {
			title: this.newTodo.trim(),
			completed: false
		};

		if (!newTodo.title) {
			return;
		}

		this.saving = true;
		this.store.insert(newTodo)
			.then(() => {
        // As we use an arrow function we can safely use this in here.
				this.newTodo = '';
			})
			.finally(() => {
				this.saving = false;
			});
	}

	toggleCompleted(todo, completed) {
		if (angular.isDefined(completed)) {
			todo.completed = completed;
		}

		this.store.put(todo)
			.catch(() => {
				todo.completed = !todo.completed;
			});
	}

	clearCompletedTodos() {
		this.store.clearCompleted();
	}

	markAll(completed) {
		this.todos.forEach(todo => {
			if (todo.completed !== completed) {
				this.toggleCompleted(todo, completed);
			}
		});
	}
}

// Since classes are blocked scoped we need reference it after it has been declared.
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
