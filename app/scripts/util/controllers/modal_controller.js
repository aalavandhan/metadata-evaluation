angular.module('c.util.controllers')
.controller('c.util.controllers.modal.Controller', function ($scope, $uibModalInstance, data) {

  $scope.data = data;

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
