GoperApp.controller('DailyTrainTasksController', ['$scope', '$http', '$mdDialog', 'TaskService', 'CommentService', '$element', '$timeout', '$log', 'ToastService', 'URL_TRAIN_API',
	function ($scope, $http, $mdDialog, TaskService, CommentService, $element, $timeout, $log, ToastService, URL_TRAIN_API) {

	    // DATAS
	    $scope.addComment = addComment;
	    $scope.createComment = false;
	    $scope.date = new Date();
	    $scope.displayComments = displayComments;
	    $scope.getDailyTasks = getDailyTasks;
	    $scope.onFilterChanged = onFilterChanged;
	    $scope.openMenu = openMenu;
	    $scope.sortReverse = false;
	    $scope.sortType = 'Deadline';
	    $scope.updateTaskCheck = updateTaskCheck;
        var url_api = URL_TRAIN_API.URL_API;

   		// ag-grid data
	    var columnDefs = [
		   {headerName: "Done ?", field: "checked", width: 150, cellRenderer: checkedCellRendererFunc, suppressSizeToFit: true},
		   {headerName: "Deadline", field: "deadline"},
		   {headerName: "TrainId", field: "trainId"},
		   {headerName: "Task", field: "taskname"},
		   {headerName: "Comments", field: "comments", cellRenderer: commentsCellRendererFunc}
		];

		$scope.gridOptions = {
	    	enableFilter: true,
	        columnDefs: columnDefs,
	        rowData: null,
	        angularCompileRows: true,
	        enableColResize : true,
	        enableSorting : true,
		    rowClassRules: {
		        // row style function
		        'deadline-passed': function(params) {
		            return params.data.idTask === 4;
		       	},
		    },
		    onGridReady: function(params) {
		    	//using setTimeout because 
		    	//gridReady get's called before data is bound
	            setTimeout(function(){
	             	params.api.sizeColumnsToFit();
	            }, 1000);
		    }
	    };
	    // end ag-grid data

	    // METHODS
		function addComment() {
	      	$scope.createComment = !$scope.createComment;
	    }

	    /**
	    * Display all task comments
	    * @method displayComments
	    * @param {Object} task - task object	   	
	    * @param {Func} ev - event click
	    * @return {object} promise
	    */
		function displayComments(task, ev) {
			$mdDialog.show({
			  autoWrap: true,
			  controller : CommentsDialogController,
			  templateUrl: 'views/dialogs/CommentsDialog.html',
			  parent: angular.element(document.body),
			  targetEvent: ev,
			  clickOutsideToClose:true,
			  locals: {
			  	task: task
			  },
			  fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
			.then (function(answer) {
			  // Dialog validated
			}, function() {
			  // Dialog cancelled
			  $scope.getDailyTasks();
			});
		}

	    function getDailyTasks() {
	    	TaskService.getDailyTasks()
				.then(function mySuccess(response) {
					// We change the checked value from 1 to true and 0 to false
					// To be able to use md-checkbox
					response.data.map(function(obj){ 
						if(obj.checked === 1){
							obj.checked = true;
						}else{
							obj.checked = false;
						} 
					  	return obj;
					});

					$scope.gridOptions.api.setRowData(response.data);
			    }, function myError(response) {
			        $log.error("Get dailyTasks failed");
			    });
	    }

	    function openMenu ($mdOpenMenu, ev) {
	      	$mdOpenMenu(ev);	
	    }

		function updateTaskCheck(task) {
	    	TaskService.updateTaskCheck(task)
				.then(function mySuccess(response) {
					ToastService.displayToast("Enregistré !");
					$scope.getDailyTasks();
			    }, function myError(response) {
			        $log.error("updateTaskCheck failed when trying");
			    });
	    }

	    // ag-grid methods
		function checkedCellRendererFunc() {
			return '<md-checkbox class="mdCheckboxAgGrid" ng-model="data.checked" aria-label="Checkbox" ng-change="updateTaskCheck(data)"></md-checkbox>';
		}

		function commentsCellRendererFunc() {
			var commentCell = 	'<span ng-if="data.comments[0]">' +
									'{{ data.comments[0].content | characters : 10 }}' +
									'<md-button md-no-ink class="md-primary smallCommentsButton" ng-click="displayComments(data, $event)">' +
										'<i class="material-icons">visibility</i>'+ 
									'</md-button>' +
								'</span>' +
								'<span ng-if="!data.comments[0]">' + 
									'<md-button md-no-ink class="md-primary smallCommentsButton" ng-click="displayComments(data, $event)">' +
										'<i class="material-icons">add_circle</i>' +
									'</md-button>' +
								'</span>';

			return commentCell;
		}

	    function onFilterChanged(value) {
		    $scope.gridOptions.api.setQuickFilter(value);
		}
		// end ag-grid methods

		$scope.getDailyTasks();
		
		function CommentsDialogController($scope, $mdDialog, task, CommentService, TaskService) {
			$scope.createComment = false;
			$scope.task = task;
			$scope.newComment = {
				message : ""
			};

			/*$scope.answer = function(answer) {
			  $mdDialog.hide(answer);
			};*/

			$scope.cancel = function() {
			  $mdDialog.cancel();
			};

			$scope.hide = function() {
			  $mdDialog.hide();
			};

			$scope.refreshTask = function() {
				TaskService.getTask(task.id)
					.then(function mySuccess(response) {
						$scope.task = response.data[0];
						$scope.displayComment($scope.task.comments[0]);
				    }, function myError(response) {
				        $log.error("getTask failed");
				    });
			};

			$scope.showClickedComment = function(clickedComment) {
				$scope.clickedComment = clickedComment;
				for (var i = 0; i < $scope.task.comments.length; i++) {
					$scope.task.comments[i].isSelected = false;
				}
				clickedComment.isSelected = true;
			};

			$scope.displayComment = function(comment) {
				if(comment){
					$scope.showClickedComment(comment);
				}
			};

			$scope.displayComment($scope.task.comments[0]);

			$scope.saveNewComment = function(newComment) {
				var commentToCreate = {
					idTask : task.id,
					author : '1',
					content : newComment.message
				}
				
				CommentService.saveNewComment(commentToCreate)
					.then(function mySuccess(response) {
						$scope.newComment.message = "";
						ToastService.displayToast("Commentaire enregistré avec succès !");
						$scope.refreshTask();
				    }, function myError(response) {
				        $log.error("saveNewComment failed");
				    });
			};

			$scope.showCommentCreation = function() {
			  $scope.createComment = true;
			};
		}
   
}]);