'use strict';

/* App Module */

var ExpediaHackathonAPP = angular.module('ExpediaHackathon', [
    'ui.bootstrap',
    'angularFileUpload',
    'base64'
]);

ExpediaHackathonAPP
    .run(function ($rootScope, $location, $http, $uibModal, $interval) { 
    })
    .config(function($httpProvider, $base64) {
        var auth = $base64.encode("foo:bar");
        $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
    })
    .controller('uploadController', ['$scope', '$location', '$uibModal', '$http', '$window', '$timeout', '$rootScope', 'FileUploader',
        function ($scope, $location, $uibModal, $http, $window, $timeout, $rootScope, FileUploader) {
            var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
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

        var autocomplete;

        $scope.PhysicalContact = {
            Addresses : {
                Address :[
                    {}
                ]
            }
        };

        console.info('uploader', uploader);

        $scope.fillInAddress = function(type){
        
            $('.physicalautocompleteresult').hide();
            var place = autocomplete.getPlace();
            var address = place.address_components;
            $scope.PhysicalContact.Addresses.Address[0].Latitude = place.geometry.location.lat().toString();
            $scope.PhysicalContact.Addresses.Address[0].Longitude = place.geometry.location.lng().toString();
        
            $scope.PhysicalContact.Addresses.Address[0].AddressLine = '';
            $scope.PhysicalContact.Addresses.Address[0].StreetNmbr = '';
            $scope.PhysicalContact.Addresses.Address[0].County = '';
            $scope.PhysicalContact.Addresses.Address[0].CityName = '';
            $scope.PhysicalContact.Addresses.Address[0].StateProv  = '';
            $scope.PhysicalContact.Addresses.Address[0].CountryCode  = '';
            $scope.PhysicalContact.Addresses.Address[0].PostalCode  = '';

            angular.forEach( address, function(item, key){
                if( item.types[0] == 'route' )
                    $scope.PhysicalContact.Addresses.Address[0].AddressLine = item.long_name;
                else if( item.types[0] == 'street_number' )
                    $scope.PhysicalContact.Addresses.Address[0].StreetNmbr = item.long_name;
                else if( item.types[0] == 'administrative_area_level_2' ) {
                    $scope.displayWarningCountyPhysical = item.long_name.length > 32;
                    $scope.PhysicalContact.Addresses.Address[0].County = item.long_name.substr(0, 32);
                }
                else if( item.types[0] == 'locality' )
                    $scope.PhysicalContact.Addresses.Address[0].CityName = item.long_name;
                else if( item.types[0] == 'administrative_area_level_1' )
                    $scope.PhysicalContact.Addresses.Address[0].StateProv = item.long_name;
                else if( item.types[0] == 'country' ){
                    $scope.PhysicalContact.Addresses.Address[0].CountryCode = item.short_name;
                }else if( item.types[0] == 'postal_code' )
                    $scope.PhysicalContact.Addresses.Address[0].PostalCode = item.long_name;
            });
           
           console.log($scope.PhysicalContact);
            $timeout( function(){ $('.physicalautocompleteresult').show() }, 300);

        };
            
        $scope.initializePhysicalAutoComplete = function() {
            autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('physicalautocomplete')),
                { types: ['geocode'] }
            );
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                $scope.fillInAddress('Physical');
            });

            $timeout( function() {
                $('#physicalautocomplete').attr('autocomplete', 'false');
            }, 1000);
        };

        $timeout( function(){
            $scope.initializePhysicalAutoComplete();
        }, 1000);
            
            
    }])
    .directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
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
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);

