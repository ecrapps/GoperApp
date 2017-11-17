GoperApp.controller('AdminTasksController' , ['$rootScope', '$scope', '$log', '$state', '$mdDialog', 'AdminTasksService', 'ToastService', 
	function ($rootScope, $scope, $log, $state, $mdDialog, AdminTasksService, ToastService){

	var vm = this;

	// Datas
	vm.getTasks = getTasks;
	vm.dialogCreateTask = dialogCreateTask;
	vm.dialogEditTask = dialogEditTask;
	vm.dialogDeleteTask = dialogDeleteTask;
	vm.dialogTaskAssociative = dialogTaskAssociative;
	vm.removeItem = removeItem;
	vm.selectedTasks = [];
    vm.setWidthAndHeight = setWidthAndHeight;
	vm.tasks = [];
	vm.toggle = toggle;

	var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var administrationContentElement = document.querySelector('#administrationContentElement');

    // METHODS
    function setWidthAndHeight(width, height, element) {
        if (width != '' && element !== null) {
            element.style.width = width;
        }
        if (height != '' && element !== null) {
            element.style.height = height;
        }
    }

    if (y > 870) {
        setWidthAndHeight('', '83%', administrationContentElement);
    } else {
        setWidthAndHeight('', '74%', administrationContentElement);
    }

	vm.getTasks();

	function getTasks() {
		AdminTasksService.getTasks()
			.then(function mySuccess(response) {
				vm.tasks = response.data;
		    }, function myError(response) {
		        $log.log("Get tasks failed");
		    });
	};

	function dialogCreateTask(ev) {
	    $mdDialog.show({
	      controller: modalTaskController,
	      templateUrl: 'views/dialogs/CreateTask.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	      	type: "Créer",
	      	task: null
	      },
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	vm.selectedTasks = [];
	      	vm.getTasks();
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogEditTask(ev) {
		task = vm.selectedTasks[0];
	    $mdDialog.show({
	      controller: modalTaskController,
	      templateUrl: 'views/dialogs/CreateTask.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      locals: {
	      	type: "Modifier",
	      	task: task
	      },
	      clickOutsideToClose:true,
	      fullscreen: false // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	    	vm.selectedTasks = [];
	      	vm.getTasks();
	    }, function() {
	      // Dialog closed
	    });
	};

	function dialogDeleteTask(ev) {
		if(vm.selectedTasks.length === 1){
	         sentence = "Êtes vous sûr de vouloir supprimer ce task ?"
	    }else{
	         sentence = "Êtes vous sûr de vouloir supprimer " + vm.selectedTasks.length + " tasks ?";
	    }
	    var confirm = $mdDialog.confirm()
	        .title(sentence)
	        .textContent('Attention cette action sera définitive.')
	        .ariaLabel('Delete task')
	        .targetEvent(ev)
	        .ok('Confirmer')
	        .cancel('Annuler');

	    $mdDialog.show(confirm).then(function(data) {
	       for (var i = vm.selectedTasks.length - 1; i >= 0; i--) {
	            AdminTasksService.deleteTask(vm.selectedTasks[i].id)
	               	.then(function(response){
	               		ToastServices.displayToast("Task deleted");
	                  	
	               	}, function(error){
	                  	$log.error("Error when trying to delete tasks : ", error);
	            	});
	            removeItem(vm.selectedTasks[i]);
	        }
	        vm.selectedTasks = [];         
	    }, function() {
	       	//dialog closed
	    });
	};

    function removeItem(task) {
        var index = vm.tasks.indexOf(task);
        if (index !== -1) {
            vm.tasks.splice(index, 1);
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

    function dialogTaskAssociative(ev, task) {
	    $mdDialog.show({
	      controller: AdminTaskAssociativeController,
	      templateUrl: 'views/dialogs/AdminTaskAssociativeModal.html',
	      parent: angular.element(document.body),
	      locals: {
	      	task: task
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

	//Modal controllers to associate tasks to task
   	function AdminTaskAssociativeController($scope, $log, $mdToast, $mdDialog, AdminTasksService, AdminClientsService, AdminTrainIdService, task) {

   		// Datas
   		$scope.task = task;
   		$scope.modal = {
   			filter: "trains",
   			title: "Trains pour "+task.name
   		}
   		$scope.rowCollection = [];
   		$scope.selectedList = [];
   		$scope.selectedTypeList = [];

   		//$scope.rowCollectionTrains = [];
   		//$scope.selectedTrains = [];
   		//$scope.initializedSelectedTrains = [];

   		$scope.rowCollectionClients = [];
   		$scope.selectedClients = [];
   		$scope.initializedSelectedClients = [];

   		$scope.tabTypes = {};
   		$scope.verifyTypesCompatibility = verifyTypesCompatibility;

   		// Methods
   		$scope.toggle = toggle;
   		$scope.exists =  exists;
   		//$scope.getTrainIds = getTrainIds;
   		//$scope.getTrainsInTask = getTrainsInTask;
   		$scope.getClients = getClients;
   		$scope.getClientsInTask = getClientsInTask;
   		$scope.getTaskTypes = getTaskTypes;
   		$scope.hide = hide;
   		$scope.cancel = cancel;
   		$scope.selectList = selectList;
   		//$scope.doInsertOrDeleteListTrains = doInsertOrDeleteListTrains;
   		$scope.doInsertOrDeleteListClients = doInsertOrDeleteListClients;
   		$scope.apply = apply;

   		//$scope.getTrainIds();
	    $scope.getClients();
	    $scope.getTaskTypes();
		//$scope.getTrainsInTask();
		$scope.getClientsInTask();

		function verifyTypesCompatibility(typeChecked) {
			// Si le typeChecked est sélectionné, alors déselectionner les autres
			// Si md est sélectionné et train ne l'est pas, sélectionner aussi train
			switch(typeChecked) {
			    case 'common':
			        if ($scope.tabTypes[0].common) {
			        	$scope.tabTypes[0].cancellation = false;
			        	$scope.tabTypes[0].train = false;
			        	$scope.tabTypes[0].md = false;
			        	$scope.tabTypes[0].client = false;
			        }
			        break;
			    case 'cancellation':
			        if ($scope.tabTypes[0].cancellation) {
			        	$scope.tabTypes[0].common = false;
			        	$scope.tabTypes[0].train = false;
			        	$scope.tabTypes[0].md = false;
			        	$scope.tabTypes[0].client = false;
			        }
			        break;
			    case 'train':
			        if ($scope.tabTypes[0].train) {
			        	$scope.tabTypes[0].common = false;
			        	$scope.tabTypes[0].cancellation = false;
			        	$scope.tabTypes[0].client = false;
			        }
			        break;
			    case 'md':
			        if ($scope.tabTypes[0].md) {
			        	$scope.tabTypes[0].common = false;
			        	$scope.tabTypes[0].cancellation = false;
			        	$scope.tabTypes[0].train = true;
			        	$scope.tabTypes[0].client = false;
			        }
			        break;
			    case 'client':
			        if ($scope.tabTypes[0].client) {
			        	$scope.tabTypes[0].common = false;
			        	$scope.tabTypes[0].cancellation = false;
			        	$scope.tabTypes[0].train = false;
			        	$scope.tabTypes[0].md = false;
			        }
			        break;
			    default:
			        /* ne rien faire */
			}
		}

   		function selectList(list, selectedListType) {
   			$scope.rowCollection = list;
   			$scope.selectedList = selectedListType;
   		}

   		function apply() {
   			if ($scope.tabTypes[0].common || $scope.tabTypes[0].cancellation || $scope.tabTypes[0].train || $scope.tabTypes[0].client) {
   				if (($scope.tabTypes[0].client && $scope.selectedClients.length > 0) || !$scope.tabTypes[0].client) {
   					if (!$scope.tabTypes[0].client && $scope.selectedClients.length > 0) {
	   					$scope.selectedClients = [];
	   				}   				
   					if ($scope.tabTypes[0].common) {
		   				AdminTasksService.associateCommonTask(task.id)
							.then(function mySuccess(response) {
						    }, function myError(response) {
						        $log.log("AdminTasksService.associateCommonTask failed");
						    });
		   			}
		   			else {
		   				AdminTasksService.deleteCommonTask(task.id)
							.then(function mySuccess(response) {
						    }, function myError(response) {
						        $log.log("AdminTasksService.deleteCommonTask failed");
						    });
		   			}
		   			if ($scope.tabTypes[0].cancellation) {
		   				AdminTasksService.associateCancellationTask(task.id)
							.then(function mySuccess(response) {
						    }, function myError(response) {
						        $log.log("AdminTasksService.associateCancellationTask failed");
						    });
		   			}
		   			else {
		   				AdminTasksService.deleteCancellationTask(task.id)
							.then(function mySuccess(response) {
						    }, function myError(response) {
						        $log.log("AdminTasksService.deleteCancellationTask failed");
						    });
		   			}
		   			if ($scope.tabTypes[0].md) {
		   				AdminTasksService.associateMdTask(task.id)
							.then(function mySuccess(response) {
						    }, function myError(response) {
						        $log.log("AdminTasksService.associateMdTask failed");
						    });
		   			}
		   			else {
		   				AdminTasksService.deleteMdTask(task.id)
							.then(function mySuccess(response) {
						    }, function myError(response) {
						        $log.log("AdminTasksService.deleteMdTask failed");
						    });
		   			}
		   			if ($scope.tabTypes[0].train) {
		   				AdminTasksService.associateTrainTask(task.id)
							.then(function mySuccess(response) {
						    }, function myError(response) {
						        $log.log("AdminTasksService.associateTrainTask failed");
						    });
		   			}
		   			else {
		   				AdminTasksService.deleteTrainTask(task.id)
							.then(function mySuccess(response) {
						    }, function myError(response) {
						        $log.log("AdminTasksService.deleteTrainTask failed");
						    });
		   			}
		   			//$scope.doInsertOrDeleteListTrains();
		   			$scope.doInsertOrDeleteListClients();
		   			$scope.hide();
   				} else {
   					alert("Vous devez choisir au moins un client à affecter à cette tâche.")
   				}
   			} else {
   				alert("Vous devez choisir au moins un type à affecter à cette tâche.")
   			}
   		}

   		/* Keep this function in case the processs changes and we need this again later */
   		/*function doInsertOrDeleteListTrains () {
   			var tmpDelete = $scope.initializedSelectedTrains;
   			var tmpAdd = $scope.selectedTrains;
   			var idx = -1;
	      	for (var i = tmpDelete.length - 1; i >= 0; i--) {
	      		notFound = true;
	      		for (var j = tmpAdd.length - 1; j >= 0 && notFound; j--) {
	    			if (tmpDelete[i].id == tmpAdd[j].id) {
	    				tmpDelete.splice(i, 1);
	    				tmpAdd.splice(j, 1);
	    				notFound = false;
	    			}
	    		}
	    	}
   			for (var i = tmpDelete.length - 1; i >= 0; i--) {
   				AdminTasksService.deleteTrainTask(tmpDelete[i].id, task.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get tasks by tasks failed");
				    });
   			}
   			for (var i = tmpAdd.length - 1; i >= 0; i--) {
   				AdminTasksService.associateTrainTask(tmpAdd[i].id, task.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get tasks by tasks failed");
				    });
   			}
   		}*/

   		function doInsertOrDeleteListClients () {
   			var tmpDelete = $scope.initializedSelectedClients;
   			var tmpAdd = $scope.selectedClients;
   			var idx = -1;
	      	for (var i = tmpDelete.length - 1; i >= 0; i--) {
	      		notFound = true;
	      		for (var j = tmpAdd.length - 1; j >= 0 && notFound; j--) {
	    			if (tmpDelete[i].id == tmpAdd[j].id) {
	    				tmpDelete.splice(i, 1);
	    				tmpAdd.splice(j, 1);
	    				notFound = false;
	    			}
	    		}
	    	}
   			for (var i = tmpDelete.length - 1; i >= 0; i--) {
   				AdminTasksService.deleteClientTask(tmpDelete[i].id, task.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get clients by tasks failed");
				    });
   			}
   			for (var i = tmpAdd.length - 1; i >= 0; i--) {
   				AdminTasksService.associateClientTask(tmpAdd[i].id, task.id)
					.then(function mySuccess(response) {
				    }, function myError(response) {
				        $log.log("Get clients by tasks failed");
				    });
   			}
   		}

	   	function toggle (item, list) {
	   		if (list) {
		      	var idx = -1;
		      	for (var i = list.length - 1; i >= 0; i--) {
		    		if (list[i].id == item.id)
		    			idx = i;
		    	}
		      	if (idx > -1) {
					list.splice(idx, 1);
		      	}
		      	else {
		         	list.push(item);
		      	}
		    }
	    }

	    function exists (item, list) {
	    	if (list) {
	    		for (var i = list.length - 1; i >= 0; i--) {
		    		if (list[i].id == item.id)
		    			return true;
		    	}
		    	return false;
	    	}
	   	}

	   	function getTaskTypes() {
			AdminTasksService.getTaskTypes(task.id)
				.then(function mySuccess(response) {
					$scope.tabTypes = response.data;
			    }, function myError(response) {
			        $log.log("getTaskTypes failed");
			    });
		}


   		/*function getTrainIds() {
			AdminTrainIdService.getTrainIds()
				.then(function mySuccess(response) {
					$scope.rowCollectionTrains = response.data;
			    }, function myError(response) {
			        $log.log("getTrainIds failed");
			    });
		}*/

		/*function getTrainsInTask() {
			AdminTasksService.getTrainsInTask(task.id)
				.then(function mySuccess(response) {
					$scope.selectedTrains = angular.copy(response.data);
					$scope.initializedSelectedTrains = angular.copy(response.data);
			    }, function myError(response) {
			        $log.log("Get trains in task failed");
			    });
		}*/

		function getClients() {
			AdminClientsService.getClients()
				.then(function mySuccess(response) {
					$scope.rowCollectionClients = response.data;
			    }, function myError(response) {
			        $log.log("Get clients failed");
			    });
		}

		function getClientsInTask() {
			AdminTasksService.getClientsInTask(task.id)
				.then(function mySuccess(response) {
					$scope.selectedClients = angular.copy(response.data);
					$scope.initializedSelectedClients = angular.copy(response.data);
			    }, function myError(response) {
			        $log.log("Get clients in task failed");
			    });
		}

   		function hide() {
	       	$mdDialog.hide();
	    }

	    function cancel() {
	       	$mdDialog.cancel();
	    }

   	}

   	//Modal controllers to create task
   	function modalTaskController($scope, $log, $mdToast, $mdDialog, AdminTasksService, type, task) {

   		// Datas
   		$scope.newTask = angular.copy(task);
   		$scope.type = type;

   		// Methods
   		$scope.cancel = cancel;
   		$scope.save = save;

   		function cancel() {
	       	$mdDialog.cancel();
	    }

	    function save(newTask) {
	    	if (type == "Créer") {
		    	AdminTasksService.createTask(newTask)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Create task failed");
				    });
			}
			else {
				AdminTasksService.updateTask(newTask, task.id)
					.then(function mySuccess(response) {
						$mdDialog.hide();
				    }, function myError(response) {
				        $log.log("Update task failed");
				    });
			}
	    }
   	}
}]);