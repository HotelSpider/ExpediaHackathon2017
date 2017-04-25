'use strict';

/* App Module */

var ExpediaHackathonAPP = angular.module('ExpediaHackathon', [
    'ui.bootstrap',
    'angularFileUpload',
    'base64',
    'MediaTaggingService'
]);

ExpediaHackathonAPP
    .run(function ($rootScope, $location, $http, $uibModal, $interval) {
        
        
        $rootScope.featuredAmenityEnum = [
        '2 Bathrooms',
        'Allergy Friendly',
        'Balcony',
        'Bathtub',
        'Business Lounge Access',
        'Concierge Service',
        'Connecting Rooms',
        'Ensuite',
        'Fireplace',
        'Hot Tub',
        'Jetted Tub',
        'Kitchen',
        'Kitchenette',
        'Lanai',
        'Microwave',
        'No Windows',
        'Patio',
        'Pool Access',
        'Private Bathroom',
        'Private Pool',
        'Refrigerator',
        'Refrigerator & Microwave',
        'Sauna',
        'Shared Bathroom',
        'Terrace'];
        
        $rootScope.viewEnum = [
        'Bay View',
        'Beach View',
        'Canal View',
        'City View',
        'Courtyard View',
        'Garden View',
        'Golf View',
        'Harbor View',
        'Hill View',
        'Lagoon View',
        'Lake View',
        'Marina View',
        'Mountain View',
        'Multiple View',
        'No View',
        'Ocean View',
        'Park View',
        'Partial Lake View',
        'Partial Ocean View',
        'Partial Sea View',
        'Partial View',
        'Pool View',
        'Resort View',
        'River View',
        'Sea View',
        'Valley View',
        'View',
        'Vineyard View'];
        
        $rootScope.areaEnum = [
        'Attribute',
        'Annex Building',
        'Beachfront',
        'Beachside',
        'Corner',
        'Courtyard Area',
        'Executive Level',
        'Garden Area',
        'Ground Floor',
        'Lakeside',
        'Mezzanine',
        'Mountainside',
        'Oceanfront',
        'Overwater',
        'Poolside',
        'Sea Facing',
        'Slope side',
        'Tower' ];
        
    })
    .config(function($httpProvider, $base64) {
        var auth = $base64.encode("foo:bar");
        $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
    })
    .controller('uploadController', ['$scope', '$location', '$uibModal', '$http', '$window', '$timeout', '$rootScope', 'FileUploader', 'ImageTagging',
        function ($scope, $location, $uibModal, $http, $window, $timeout, $rootScope, FileUploader, ImageTagging) {
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
            
            // place image on the right
            
            // call Media Tagging Service
            var mediaTags = ImageTagging.getMediaTags(fileItem.file.name);
            console.log(mediaTags);
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
        
        
        
        
        $scope.Property = {
            "providerPropertyId": "1289472",
            "name": "Peach Inn",
            "latitude": "23.3752",
            "longitude": "-81.3261",
            "providerPropertyUrl": "http://example.org",
            "structureType": "Hotel",
            "currencyCode": "USD",
            "billingCurrencyCode": "USD",
            "timeZone": "America/Los_Angeles",
            "addresses": [
                {
                    "line1": "123 Main St.",
                    "city": "B. Hills",
                    "state": "CA",
                    "postalCode": "90210",
                    "countryCode": "USA"
                }
            ],
            "ratings": [
                {
                    "score": 4,
                    "maxScore": 5,
                    "source": "AAA",
                    "description": "STARS"
                }
            ],
            "contacts": {
                "Property": {
                    "phoneNumbers": [
                        {
                            "phoneNumberType": "Phone",
                            "countryAccessCode": "1",
                            "areaCode": "123",
                            "number": "1234567"
                        }
                    ]
                },
                "ReservationManager": {
                    "firstName": "First",
                    "lastName": "Last",
                    "emails": [
                        "abc@xyz.com"
                    ],
                    "phoneNumbers": [
                        {
                            "phoneNumberType": "Phone",
                            "countryAccessCode": "1",
                            "areaCode": "123",
                            "number": "4567890"
                        },
                        {
                            "phoneNumberType": "Fax",
                            "countryAccessCode": "1",
                            "areaCode": "123",
                            "number": "7890123"
                        }
                    ]
                },
                "AlternateReservationManager": {
                    "phoneNumbers": [
                        {
                            "phoneNumberType": "Phone",
                            "countryAccessCode": "1",
                            "areaCode": "123",
                            "number": "1234567"
                        }
                    ]
                },
                "GeneralManager": {
                    "firstName": "General",
                    "lastName": "Manager",
                    "emails": [
                        "abc123@xyz.com"
                    ]
                }
            },
            "contents": [
                {
                    "locale": "en-US",
                    "name": "Localized Property Name",
                    "providerPropertyUrl": null,
                    /*"images": [
                        {
                            "url": "http://images.xyz.com/mainImage.jpg",
                            "categoryCode": "FEATURED_IMAGE",
                            "caption": "Main Image"
                        }
                    ],
                    "amenities": [
                          {
                            "code": "WIFI_INTERNET",
                            "detailCode": "SURCHARGE_PER_STAY",
                            "value": 10.99
                        }
                    ],
                    "paragraphs": [
                        {
                            "code": "DESCRIPTION",
                            "value": "Property description."
                        },
                        {
                            "code": "SPECIAL_CHECKIN_INSTRUCTIONS",
                            "value": "Special check-in instructions."
                        }
                    ]*/
                }
            ],
            "propertyCollectedMandatoryFees": [
                {
                    "code": "RESORT_FEE",
                    "scope": "PER_PERSON",
                    "duration": "PER_NIGHT",
                    "value": 25.99,
                    "startDate": null,
                    "endDate": null
                }
            ],
            "taxes": [
                {
                    "code": "VAT",
                    "detailCode": "PERCENT_PER_STAY",
                    "value": 20
                }
            ],
            "policies": [
                {
                    "code": "MINIMUM_CHECKIN_AGE",
                    "value": "18"
                }
            ],
            "inventorySettings": {
                "rateAcquisitionType": "NET_RATE",
                "distributionModels": [
                    "EXPEDIA_COLLECT",
                    "HOTEL_COLLECT"
                ]
            },
            "attributes": [
                {
                    "code": "TOTAL_ROOMS",
                    "value": "15"
                }
            ]
        };
        
        $scope.PropertyRoom = {
            "partnerCode": "MyStringCode",
            "name": {
                "attributes": {
                    "typeOfRoom": "Penthouse",
                    "roomClass": "Executive",
                    "includeBedType": true,
                    "view": "City View",
                    "featuredAmenity": "Jetted Tub",
                    "customLabel": "Rooftop Terrace"
                }
            },
            "ageCategories": [
                {
                    "category": "Adult", 
                    "minAge": 18
                }, 
                {
                    "category": "ChildAgeA", 
                    "minAge": 6
                }, 
                {
                    "category": "Infant", 
                    "minAge": 0
                }
            ], 
            "maxOccupancy": {
                "adults": 2, 
                "children": 1, 
                "total": 3
            }, 
            "standardBedding": [
                {
                    "option": [
                        {
                            "quantity": 1,
                            "type": "King Bed"
                        }
                    ]
                }
            ], 
            "extraBedding": [
                {
                    "quantity": 1,
                    "type": "Rollaway Bed",
                    "size": "Full",
                    "surcharge": {
                        "type": "Per Day",
                        "amount": 20
                    }
                }
            ],
            "smokingPreferences": [
                "Non-Smoking"
            ],
            "roomSize": {
                "squareFeet": 300,
                "squareMeters": 14
            },
            "views": [
                "Beach View"
            ]
        };
        
        $scope.airbnburl = 'https://www.airbnb.fr/rooms/1984135?location=Paris&s=3PCC-baj';
        
        $scope.analyseComments = function(hotelURL){
            var hotelcode = '1984135';
            if ( hotelURL == 'https://www.airbnb.fr/rooms/1984135?location=Paris&s=3PCC-baj' ){ 
                //code
            }
            // call Media Tagging Service
            $http({
                method: 'GET', 
                url: 'http://35.158.79.41/ExpediaHackathon2017/resources/test_data/' + hotelcode + '/reviews.json' // 
            }).then(function successCallback(response) {
                
                angular.forEach(response, function(review, key){
                    $http({
                        method:'POST',
                        url:'https://services.expediapartnercentral.com/hotel-review/service/v1/analyze',
                        text: review.comments
                    }).then(function(activities, status){
                    });
                });
                
                    
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
        $scope.analyseComments();
    
            
            
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

