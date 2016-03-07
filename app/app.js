/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
  .config($routeProvider => {
    'use strict';

    const routeConfig = {
      template: '<todo-list store="store" />',
      controller: function (store, $scope) {
        $scope.store = store;
      },
      resolve: {
        store: todoStorage => {
          // Get the correct module (API or localStorage).
          return todoStorage.then(module => {
            module.get(); // Fetch the todo records in the background.
            return module;
          });
        }
      }
    };

    $routeProvider
      .when('/', routeConfig)
      .when('/:status', routeConfig)
      .otherwise({
        redirectTo: '/'
      });
  });
