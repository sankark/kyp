angular.module('storage', ['angularFileUpload'])

.factory('storage', ['FileUploader','$q', 'Profiles', 'Consti', 'Comments', function(FileUploader,q, Profiles, Consti, Comments) {
            return {
                initImageUploader: function(scope) {
                    var uploader = getImageUploader(scope, FileUploader);
                    uploader.filters.push(getFilter(uploader,'imageFilter', '|jpg|png|jpeg|bmp|gif|'));
                    uploader.filters.push(singleFileFIlter(uploader));

                    uploadCallbacks(scope,uploader);
                }
            }
            }])
      .directive('ngThumb', ['$window', function($window) {
            var helper = {
                support: !!($window.FileReader && $window.CanvasRenderingContext2D),
                isFile: function(item) {
                    return angular.isObject(item) && item instanceof $window.File;
                },
                isImage: function(file) {
                    var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            };

            return {
                restrict: 'A',
                template: '<canvas/>',
                link: function(scope, element, attributes) {
                    if (!helper.support) return;

                    var params = scope.$eval(attributes.ngThumb);

                    if (!helper.isFile(params.file)) return;
                    if (!helper.isImage(params.file)) return;

                    var canvas = element.find('canvas');
                    var reader = new FileReader();

                    reader.onload = onLoadFile;
                    reader.readAsDataURL(params.file);

                    function onLoadFile(event) {
                        var img = new Image();
                        img.onload = onLoadImage;
                        img.src = event.target.result;
                    }

                    function onLoadImage() {
                        var width = params.width || this.width / this.height * params.height;
                        var height = params.height || this.height / this.width * params.width;
                        canvas.attr({
                            width: width,
                            height: height
                        });
                        canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                    }
                }
            };
        }]);


  
        function getImageUploader(scope,FileUploader) {
            var uploader = scope.uploader = new FileUploader({
                url: '/admin/upload',
                removeAfterUpload: true
            });
            return uploader;
        }

        function getFilter(uploader, filter, mime) {
          return {
                name: filter,
                fn: function(item /*{File|FileLikeObject}*/ , options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return mime.indexOf(type) !== -1;
                }
            }
        }

        function singleFileFIlter(uploader){
            return {
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            if (uploader.queue.length == 1)
                uploader.queue.splice(0);
            return true;
        }
    };
        }
        function uploadCallbacks(scope, uploader) {
            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                console.info('onAfterAddingFile', fileItem);
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
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
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
        }
