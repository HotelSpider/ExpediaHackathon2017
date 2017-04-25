'use strict';

/* App Module */

var ExpediaHackathonAPP = angular.module('ExpediaHackathon', [
    'ui.bootstrap',
    'angularFileUpload',
    'base64',
    'MediaTaggingService'
]);

ExpediaHackathonAPP

    .run(function ($rootScope, $location, $http, $uibModal, $interval, $timeout) { 
        
        
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

        var autocomplete;

        $rootScope.PhysicalContact = {
            Addresses : {
                Address :[
                    {}
                ]
            }
        };

        $rootScope.neighborhood = 'aaa';

        $rootScope.activitiesFound = [];

        $rootScope.POIFound = [];
        $rootScope.fillInAddress = function(type){
        
            $('.physicalautocompleteresult').hide();
            var place = autocomplete.getPlace();
            var address = place.address_components;
            $rootScope.PhysicalContact.Addresses.Address[0].Latitude = place.geometry.location.lat().toString();
            $rootScope.PhysicalContact.Addresses.Address[0].Longitude = place.geometry.location.lng().toString();
        
            $rootScope.PhysicalContact.Addresses.Address[0].AddressLine = '';
            $rootScope.PhysicalContact.Addresses.Address[0].StreetNmbr = '';
            $rootScope.PhysicalContact.Addresses.Address[0].County = '';
            $rootScope.PhysicalContact.Addresses.Address[0].CityName = '';
            $rootScope.PhysicalContact.Addresses.Address[0].StateProv  = '';
            $rootScope.PhysicalContact.Addresses.Address[0].CountryCode  = '';
            $rootScope.PhysicalContact.Addresses.Address[0].PostalCode  = '';

            angular.forEach( address, function(item, key){
                if( item.types[0] == 'route' )
                    $rootScope.PhysicalContact.Addresses.Address[0].AddressLine = item.long_name;
                else if( item.types[0] == 'street_number' )
                    $rootScope.PhysicalContact.Addresses.Address[0].StreetNmbr = item.long_name;
                else if( item.types[0] == 'administrative_area_level_2' ) {
                    $rootScope.displayWarningCountyPhysical = item.long_name.length > 32;
                    $rootScope.PhysicalContact.Addresses.Address[0].County = item.long_name.substr(0, 32);
                }
                else if( item.types[0] == 'locality' )
                    $rootScope.PhysicalContact.Addresses.Address[0].CityName = item.long_name;
                else if( item.types[0] == 'administrative_area_level_1' )
                    $rootScope.PhysicalContact.Addresses.Address[0].StateProv = item.long_name;
                else if( item.types[0] == 'country' ){
                    $rootScope.PhysicalContact.Addresses.Address[0].CountryCode = item.short_name;
                }else if( item.types[0] == 'postal_code' )
                    $rootScope.PhysicalContact.Addresses.Address[0].PostalCode = item.long_name;
            });
           
            $rootScope.getTCSInformation();
            $rootScope.getGooglePOI();

            console.log($rootScope.activitiesFound);

            console.log($rootScope.POIFound);

            $timeout( function(){ $('.physicalautocompleteresult').show() }, 300);

        };
            
        $rootScope.initializePhysicalAutoComplete = function() {
            autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('physicalautocomplete')),
                { types: ['geocode'] }
            );
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                $rootScope.fillInAddress('Physical');
            });

            $timeout( function() {
                $('#physicalautocomplete').attr('autocomplete', 'false');
            }, 1000);
        };

        $rootScope.getTCSInformation = function(){

            //Utils (source http://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates)
            function degreesToRadians(degrees) {
                return degrees * Math.PI / 180;
            }

            function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
                var earthRadiusKm = 6371;

                var dLat = degreesToRadians(lat2-lat1);
                var dLon = degreesToRadians(lon2-lon1);

                lat1 = degreesToRadians(lat1);
                lat2 = degreesToRadians(lat2);

                var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                return earthRadiusKm * c;
            }
            //First identify the correct neighboorhood
            //Classify
            
            var neighboorhoodsParis = [],
                neighboorhoodsMadrid = [],
                neighboorhoodsNewYork = [];

            var neighborhoodFound = null;
            var city = 'Madrid';
            var minDistance = -1;
            var Address = $rootScope.PhysicalContact.Addresses.Address[0];

            angular.forEach(neighborhoodMadrid, function(neighborhood, indexNeighborhood){
                var currentDistance = distanceInKmBetweenEarthCoordinates(parseFloat(Address.Latitude), parseFloat(Address.Longitude), parseFloat(neighborhood.lat), parseFloat(neighborhood.lng));
                if(minDistance < 0 || minDistance > currentDistance){
                    minDistance = currentDistance;
                    neighborhoodFound = neighborhood;
                    city = 'Madrid';
                }
            });


            angular.forEach(neighborhoodParis, function(neighborhood, indexNeighborhood){
                var currentDistance = distanceInKmBetweenEarthCoordinates(parseFloat(Address.Latitude), parseFloat(Address.Longitude), parseFloat(neighborhood.lat), parseFloat(neighborhood.lng));
                if(minDistance < 0 || minDistance > currentDistance){
                    minDistance = currentDistance;
                    neighborhoodFound = neighborhood;
                    city = 'Paris';
                }
            });

            angular.forEach(neighborhoodNewYork, function(neighborhood, indexNeighborhood){
                var currentDistance = distanceInKmBetweenEarthCoordinates(parseFloat(Address.Latitude), parseFloat(Address.Longitude), parseFloat(neighborhood.lat), parseFloat(neighborhood.lng));
                if(minDistance < 0 || minDistance > currentDistance){
                    minDistance = currentDistance;
                    neighborhoodFound = neighborhood;
                    city = 'NewYork';
                }
            });

            $rootScope.neighborhood = neighborhoodFound;

            //Get the TCS Activities
            $http({
                method:'GET',
                url:'https://services.expediapartnercentral.com/travel-content/service/travel/id/'+$rootScope.neighborhood.id+'?section=ACTIVITY&langId=EN&version=2&useCache=true'
            }).then(function(activities, status){

                 //Load the activities for the particular neighboorhood
                var activitiesDb;

                if(city == 'Madrid'){
                    activitiesDb = activitiesMadrid;
                }else if (city == 'Paris'){
                    activitiesDb = activitiesMadrid;
                }else if(city == 'NewYork'){          
                    activitiesDb = activitiesNewYork;
                }

                //array id => activity
                var cityActivities = {};
                var activitiesFound = [];
                angular.forEach(activitiesDb, function(activity, indexActivity){
                    cityActivities[activity.id] = activity;
                });

                angular.forEach(activities.data.sections.data, function(activity, indexActivity){
                    if(typeof data.activity_id != 'undefined'){
                        activitiesFound.push(cityActivities[activity.sections.activity.id]);
                    }                
                });

                $rootScope.activitiesFound = activitiesFound;
            });

           


        };

        $rootScope.getGooglePOI = function(){

            $http({
                method:'GET',
                url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+$rootScope.PhysicalContact.Addresses.Address[0].Latitude+','+$rootScope.PhysicalContact.Addresses.Address[0].Longitude+'&radius=500&key=AIzaSyCUVSq6ZVL0LIYuRGkGcmCI0Fyv4BlvHwU',
                 headers: {
                    'Authorization': null
                }
            }).then(function(response, status){
                console.log(response);
            });

        };

        $timeout( function(){
            $rootScope.initializePhysicalAutoComplete();
        }, 1000);
    })
    .config(function($httpProvider, $base64) {
        var auth = $base64.encode("EQCtest12933870:ew67nk33");
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

        console.info('uploader', uploader);
        
        
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
            var hotelcode = '9917391';
            if ( hotelURL == 'https://www.airbnb.fr/rooms/1984135?location=Paris&s=3PCC-baj' ){ 
                //code
            }
            // call Media Tagging Service
            $http({
                method: 'GET', 
                url: 'http://35.158.79.41/ExpediaHackathon2017/getReviewsKeywords.php?HotelCode=' + hotelcode 
            }).then(function successCallback(response) {
                
                
                
                    
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

