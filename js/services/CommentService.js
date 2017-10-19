GoperApp.factory('CommentService', ['$http', 'URL_TRAIN_API', function($http, URL_TRAIN_API) {

	var url_api = URL_TRAIN_API.URL_API;
	var factory = {};

	factory.saveNewComment = function(newComment) {
		console.log('newComment : ', newComment);
		var data = {
			// Envoyer les données nécessaires
			idTask: newComment.idTask,
			author: newComment.author,
			content: newComment.content
		};

		return $http({
	        method : "POST",
	        url : url_api + "saveNewComment",
	        data : data
	    });
	}

	return factory;
}]);