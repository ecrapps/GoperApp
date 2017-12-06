GoperApp.controller('ImportController', ['$scope' , 'FileUploader', 'URL_TRAIN_API', 
        function ($scope, FileUploader, URL_TRAIN_API) {

    // DATAS
    $scope.fileSelected = false;
    $scope.setFileSelected = setFileSelected;
    $scope.setWidthAndHeight = setWidthAndHeight;

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var contentElement = document.querySelector('#contentElement');
    var messageElement = document.querySelector('#message');

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
        setWidthAndHeight('', '89%', contentElement);
    } else {
        setWidthAndHeight('', '83%', contentElement);
    }

    function setFileSelected() {
        $scope.fileSelected = true;
    }
    
    var uploader = $scope.uploader = new FileUploader({
                url: URL_TRAIN_API.URL_API+"import"
            });

    // FILTERS
    // a sync filter
    uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            console.log('syncFilter');
            return this.queue.length < 1;
        }
    });

    uploader.filters.push({
        name: 'csvFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            // var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var type = item.name.split(".").pop();
            console.log("type : ", type, " item : ", item);
            return "csv" === type;
        }
    });

    // an async filter
    uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
            console.log('asyncFilter');
            setTimeout(deferred.resolve, 1e3);
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
        setFileSelected();
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
        messageElement.innerHTML = "Import en cours. Veuillez patienter...";
        messageElement.classList.add("alert");
        messageElement.classList.add("alert-info");
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        messageElement.innerHTML = "Données importées avec succès.";
        messageElement.classList.remove("alert-info");
        messageElement.classList.add("alert-success");
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
        messageElement.innerHTML = "Une erreur est survenue.";
        messageElement.classList.remove("alert-info");
        messageElement.classList.add("alert-danger");
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);

}]);