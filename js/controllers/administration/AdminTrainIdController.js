GoperApp.controller('AdminTrainIdController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminTrainIdService', 'ToastService', 
	function ($rootScope, $scope, $log, $state, $mdDialog, AdminTrainIdService, ToastService){

	var vm = this;

	// Data
	vm.trainIds = [];
	vm.selectedTrainIds = [];

	// Methods
	vm.getTrainIds = getTrainIds;
	vm.dialogCreateTrainId = dialogCreateTrainId;
	vm.dialogEditTrainId = dialogEditTrainId;
	vm.dialogDeleteTrainId = dialogDeleteTrainId;
	vm.dialogAssociateTrainIdToTasks = dialogAssociateTrainIdToTasks;
	vm.removeItem = removeItem;
	vm.toggle = toggle;

	vm.getTrainIds();

	function getTrainIds() {
		AdminTrainIdService.getTrainIds()
			.then(function mySuccess(response) {
				vm.trainIds = response.data;
		    }, function myError(response) {
		        $log.log("Get trainIds failed");
		    });
	};

	function dialogCreateTrainId(ev) {
	    $mdDialog.show({
	      controller: modalTrainIdController,
	      templateUrl: 'views/dialogs/CreateTrainId.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	      	type: "Créer",
	      	trainId: null
	      },
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	vm.selectedTrainIds = [];
	      	vm.getTrainIds();
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogEditTrainId(ev) {
		trainId = vm.selectedTrainIds[0];
	    $mdDialog.show({
	      controller: modalTrainIdController,
	      templateUrl: 'views/dialogs/CreateTrainId.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	      	type: "Modifier",
	      	trainId: trainId
	      },
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	vm.selectedTrainIds = [];
	      	vm.getTrainIds();
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogDeleteTrainId(ev) {
		if(vm.selectedTrainIds.length === 1){
	         sentence = "Êtes vous sûr de vouloir supprimer ce trainId ?"
	    }else{
	         sentence = "Êtes vous sûr de vouloir supprimer " + vm.selectedTrainIds.length + " trainIds ?";
	    }
	    var confirm = $mdDialog.confirm()
	        .title(sentence)
	        .textContent('Attention cette action sera définitive.')
	        .ariaLabel('Delete trainId')
	        .targetEvent(ev)
	        .ok('Confirmer')
	        .cancel('Annuler');

	    $mdDialog.show(confirm).then(function(data) {
	       for (var i = vm.selectedTrainIds.length - 1; i >= 0; i--) {
	            AdminTrainIdService.deleteTrainId(vm.selectedTrainIds[i].id)
	               	.then(function(response){
	               		ToastServices.displayToast("TrainId deleted");
	                  	
	               	}, function(error){
	                  	$log.error("Error when trying to delete trainIds : ", error);
	            	});
	            removeItem(vm.selectedTrainIds[i]);
	        }
	        vm.selectedTrainIds = [];         
	    }, function() {
	       	//dialog closed
	    });
	};

    function removeItem(trainId) {
        var index = vm.trainIds.indexOf(trainId);
        if (index !== -1) {
            vm.trainIds.splice(index, 1);
        }
    };

    function toggle (item, list) {
	  	var idx = list.indexOf(item);
	  	if (idx > -1) {
			list.splice(idx, 1);
	  	}
	  	else {
			list.push(item);
	  	}
	}

    function dialogAssociateTrainIdToTasks(ev, trainId) {
	    $mdDialog.show({
	      controller: AssociateTasksToTrainIdController,
	      templateUrl: 'views/dialogs/GenericModalAssociate.html',
	      windowClass: 'large-Modal',
	      parent: angular.element(document.body),
	      locals: {
	      	trainId: trainId
	      },
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	      
	    }, function() {
	      // Dialog closed
	    });
	};

	//Modal controllers to associate trainIds to trainId
   	function AssociateTasksToTrainIdController($scope, $log, $mdToast, $mdDialog, AdminTasksServices, trainId) {

   		// Datas
   		$scope.trainId = trainId;
   		$scope.modal = {
   			filter: "utilisateurs",
   			title: "Utilisateurs pour "+trainId.name
   		}
   		$scope.rowCollection = [];
   		$scope.selectedList = [];
   		$scope.initializedSelectedList = [];

   		// Methods
   		$scope.toggle = toggle;
   		$scope.exists =  exists;
   		$scope.getTasks = getTasks;
   		$scope.getTasksInTrainId = getTasksInTrainId;
   		$scope.hide = hide;
   		$scope.cancel = cancel;
   		$scope.apply = apply;

   		function apply() {
   			var tmpDelete = $scope.initializedSelectedList;
   			var tmpAdd = $scope.selectedList;
   			var idx = -1;
	      	for (var i = tmpDelete.length - 1; i >= 0; i--) {
	      		notFound = true;
	      		for (var j = tmpAdd.length - 1; j >= 0 && notFound; j--) {
	    			if (tmpDelete[i].idTask == tmpAdd[j].idTask) {
	    				tmpDelete.splice(i, 1);
	    				tmpAdd.splice(j, 1);
	    				notFound = false;
	    			}
	    		}
	    	}
   			for (var i = tmpDelete.length - 1; i >= 0; i--) {
   				AdminTasksServices.deleteTaskTrainId(tmpDelete[i].idTask, trainId.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get trainIds by trainIds failed");
				    });
   			}
   			for (var i = tmpAdd.length - 1; i >= 0; i--) {
   				AdminTasksServices.associateTaskTrainId(tmpAdd[i].idTask, trainId.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get trainIds by trainIds failed");
				    });
   			}

   			$scope.hide();
   		}

	   	function toggle (item, list) {
	      	var idx = -1;
	      	for (var i = list.length - 1; i >= 0; i--) {
	    		if (list[i].idTask == item.id)
	    			idx = i;
	    	}
	      	if (idx > -1) {
				list.splice(idx, 1);
	      	}
	      	else {
	         	list.push({idTask: item.id});
	      	}
	    }

	    function exists (item, list) {
	    	for (var i = list.length - 1; i >= 0; i--) {
	    		if (list[i].idTask == item.id)
	    			return true;
	    	}
	    	return false;
	      	// return list.indexOf(item.id) > -1;
	   	}

   		function getTasks() {
			AdminTasksServices.getTasks()
				.then(function mySuccess(response) {
					$scope.rowCollection = response.data;
			    }, function myError(response) {
			        $log.log("Get tasks failed");
			    });
		}

		function getTasksInTrainId() {
			AdminTasksServices.getTasksInTrainId(trainId.id)
				.then(function mySuccess(response) {
					$scope.selectedList = angular.copy(response.data);
					$scope.initializedSelectedList = angular.copy(response.data);
			    }, function myError(response) {
			        $log.log("Get tasks in trainId failed");
			    });
		}

   		function hide() {
	       	$mdDialog.hide();
	    }

	    function cancel() {
	       	$mdDialog.cancel();
	    }

	    $scope.getTasks();
		$scope.getTasksInTrainId();
   	}

   	//Modal controllers to create trainId
   	function modalTrainIdController($scope, $log, $mdToast, $mdDialog, AdminTrainIdService, type, trainId) {

   		// Datas
   		$scope.newTrainId = angular.copy(trainId);
   		$scope.type = type;

   		// Methods
   		$scope.cancel = cancel;
   		$scope.save = save;

   		function cancel() {
	       	$mdDialog.cancel();
	    }

	    function save(newTrainId) {
	    	if (type == "Créer") {
		    	AdminTrainIdService.createTrainId(newTrainId)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Create trainId failed");
				    });
			}
			else {
				AdminTrainIdService.updateTrainId(newTrainId, trainId.id)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Create trainId failed");
				    });
			}
	    }
   	}
}]);