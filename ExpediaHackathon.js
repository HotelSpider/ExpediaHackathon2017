'use strict';

/* App Module */

var ExpediaHackathonAPP = angular.module('ExpediaHackathon', [
    'ui.bootstrap'
]);

ExpediaHackathonAPP
    .run(function ($rootScope, $location, $http, $uibModal, $interval) { 
    })
    .controller('testController', ['$scope', '$location', '$uibModal', '$http', '$window', '$timeout', '$rootScope',
        function ($scope, $location, $uibModal, $http, $window, $timeout, $rootScope) {
            $scope.myName2 = 'test';
    }]);

