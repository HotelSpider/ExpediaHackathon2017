'use strict';

/* App Module */

var ExpediaHackathonAPP = angular.module('ExpediaHackathon', [
    'ui.bootstrap',
    'angularFileUpload',
    'base64',
    'MediaTaggingService',
    'ReviewAnalysisService',
    'DescriptionGeneratorService',
    'AmenitiesMappingService'
]);

ExpediaHackathonAPP

    .run(function ($rootScope, $location, $http, $uibModal, $interval, $timeout, ImageTagging, ReviewAnalyser, DescriptionGenerator, AmenitiesMapper) {

        $rootScope.featuredAmenityEnum = featuredAmenitiesFullList;
        $rootScope.roomAmenitiesList = roomAmenitiesFullList;

        $rootScope.viewEnum = viewsFullList;
        
        $rootScope.startAnalysis = true;
        
        $rootScope.step = 1;

        var autocomplete;

        $rootScope.HotelName = '';

        $rootScope.PhysicalContact = {
            Addresses : {
                Address :[
                    {}
                ]
            }
        };

        var map = null;
        var mapOptions = null;
        var marker = null;

        $rootScope.neighborhood = 'aaa';

        $rootScope.activitiesFound = [];

        $rootScope.foundPOI = [];

        $rootScope.fillInAddress = function(type){
        
            $('.physicalautocompleteresult').hide();
            var place = autocomplete.getPlace();
            var address = place.address_components;
            $rootScope.PhysicalContact.Addresses.Address[0].Latitude = place.geometry.location.lat().toString();
            $rootScope.PhysicalContact.Addresses.Address[0].Longitude = place.geometry.location.lng().toString();
            $rootScope.setMarker(place.geometry.location.lat().toString(), place.geometry.location.lng().toString());

        
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

            $timeout( function(){ $('.physicalautocompleteresult').show() }, 300);

        };

        $rootScope.initializeMap = function(lat, lng) {
            mapOptions = {
                center: { lat: !lat?46.3832683:parseFloat(lat),
                          lng: !lng?6.234785200000033:parseFloat(lng) },
                zoom: !lat?1:16,
                draggable:true
            };
            map = new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions);
        };
            
        $rootScope.initializePhysicalAutoComplete = function() {
            autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('physicalautocomplete')),
                { types: ['geocode'] }
            );
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                $rootScope.fillInAddress('Physical');

                $rootScope.getNearByAirport();           
                $rootScope.getTCSInformation();
                $rootScope.getGooglePOI();

                $rootScope.getNearByTrainStation();
                $rootScope.processPOI();

                var geoLocationData = $rootScope.neighborhood.name;
                console.info('geoLocationData', geoLocationData);

                var POI = $rootScope.classifiedPOI;
                console.info('geoLocationData', POI);

            });

            $timeout( function() {
                $rootScope.initializeMap(false, false);
                $('#physicalautocomplete').attr('autocomplete', 'false');
                
            }, 1000);
        };

        $rootScope.getNearByAirport = function(){
            var airports = [
                {
                    "location" : {
                       "lat" : 49.0096906,
                       "lng" : 2.547924499999999
                    },
                    "name" : "Paris-Charles De Gaulle"
                },
                {
                    "location" : {
                       "lat" : 48.9614725,
                       "lng" : 2.437202
                    },
                    "name" : "Aeroport de Paris - Le Bourget",
                },
                {
                    "location" : {
                       "lat" : 48.7262433,
                       "lng" : 2.3652472
                    },
                    "name" : "Aeroport de Paris-Orly",
                }
            ];

            var directionsService = new google.maps.DirectionsService();


            var latitude1 = $rootScope.PhysicalContact.Addresses.Address[0].Latitude;
            var longitude1 =  $rootScope.PhysicalContact.Addresses.Address[0].Longitude;

            var airportFound = null;
            var currentDistance = -1;

            angular.forEach(airports, function(airport, indexAirport){


                var latitude2 = airport.location.lat;
                var longitude2 = airport.location.lng;
                var request = {
                       origin: new google.maps.LatLng(latitude1, longitude1), 
                       destination:new google.maps.LatLng(latitude2, longitude2),
                       travelMode: google.maps.DirectionsTravelMode.DRIVING
                   };

                   directionsService.route(request, function(response, status) {
                        var distance = response.routes[0].legs[0].distance.value;
                        
                        if(currentDistance < 0 || distance < currentDistance){
                            currentDistance = distance;
                            airportFound = {
                                name:airport.name,
                                distance:distance / 1000
                            };
                        }
                    });
            });

            $timeout(function(){
                $rootScope.nearByAiport = airportFound;

                console.info('nearest airport', airportFound.name + ' ' + airportFound.distance);
            }, 2000);
        };

        $rootScope.getNearByPublicTransportation = function(){

        };

        $rootScope.setMarker = function(lat, lng) {
            var myLatlng = new google.maps.LatLng(lat, lng);
            if( marker == null ){
                marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    draggable: false
                });
            }
            marker.setPosition(myLatlng);
            $timeout( function(){ map.setCenter(marker.getPosition()); }, 1000 );
            map.setZoom(16);//zoom to marker
        };

        $rootScope.getNearByTrainStation = function(){

             var request = {
                location: new google.maps.LatLng($rootScope.PhysicalContact.Addresses.Address[0].Latitude, $rootScope.PhysicalContact.Addresses.Address[0].Longitude),
                radius: '500',
                type : 'train_station',
                //rankBy :'prominence'
            };


            var service = new google.maps.places.PlacesService(map);
            
                service.nearbySearch(request, function(trainstations){
                $rootScope.nearByTrainStation = trainstations;
            });
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
            var regionId = 178293;
            var minDistance = -1;
            var Address = $rootScope.PhysicalContact.Addresses.Address[0];

            angular.forEach(neighborhoodMadrid, function(neighborhood, indexNeighborhood){
                var currentDistance = distanceInKmBetweenEarthCoordinates(parseFloat(Address.Latitude), parseFloat(Address.Longitude), parseFloat(neighborhood.lat), parseFloat(neighborhood.lng));
                if(minDistance < 0 || minDistance > currentDistance){
                    minDistance = currentDistance;
                    neighborhoodFound = neighborhood;
                    city = 'Madrid';
                    regionId = 178293;
                }
            });


            angular.forEach(neighborhoodParis, function(neighborhood, indexNeighborhood){
                var currentDistance = distanceInKmBetweenEarthCoordinates(parseFloat(Address.Latitude), parseFloat(Address.Longitude), parseFloat(neighborhood.lat), parseFloat(neighborhood.lng));
                if(minDistance < 0 || minDistance > currentDistance){
                    minDistance = currentDistance;
                    neighborhoodFound = neighborhood;
                    city = 'Paris';
                    regionId = 179898;
                }
            });

            angular.forEach(neighborhoodNewYork, function(neighborhood, indexNeighborhood){
                var currentDistance = distanceInKmBetweenEarthCoordinates(parseFloat(Address.Latitude), parseFloat(Address.Longitude), parseFloat(neighborhood.lat), parseFloat(neighborhood.lng));
                if(minDistance < 0 || minDistance > currentDistance){
                    minDistance = currentDistance;
                    neighborhoodFound = neighborhood;
                    city = 'New York';
                    regionId = 178293;
                }
            });

            $rootScope.neighborhood = neighborhoodFound;

            var cityActivities = [];
          
            //Get the TCS Activities for the city and split the content per region
            $http({
                method:'GET',
                url:'https://services.expediapartnercentral.com/travel-content/service/travel/regionId/' + regionId + '?langId=EN&sections=ACTIVITY&version=2&useCache=true'
            }).then(function(activities, status){

                 //Load the activities for the particular neighboorhood
                var activitiesDb;

                if(city == 'Madrid'){
                    activitiesDb = activitiesMadrid;
                }else if (city == 'Paris'){
                    activitiesDb = activitiesParis;
                }else if(city == 'New York'){          
                    activitiesDb = activitiesNewYork;
                }


                //array id => activity
                var cityActivities = {};
                var activitiesFound = [];
                angular.forEach(activitiesDb, function(activity, indexActivity){
                    cityActivities[activity.id] = activity;
                });

                angular.forEach(activities.data.sections.data, function(activity, indexActivity){
                    if(typeof data.activity_id != 'undefined' && distanceInKmBetweenEarthCoordinates(activity.destination.geo.latitude, activity.destination.geo.longitude, parseFloat(Address.Latitude), parseFloat(Address.Longitude))<= 0.5){
                        activitiesFound.push(cityActivities[activity.sections.activity.id]);
                    }                
                });

                $rootScope.activitiesFound = activitiesFound;
            });
            

        };

        $rootScope.getGooglePOI = function(){

            var blacklistTypes = ['political'];
            var blacklistName = ['Hotel', 'hotel', 'hôtel', 'Hôtel'];
            var foundPOI = [];
 
             var request = {
                location: new google.maps.LatLng($rootScope.PhysicalContact.Addresses.Address[0].Latitude, $rootScope.PhysicalContact.Addresses.Address[0].Longitude),
                radius: '500'
            };

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function(places){
                angular.forEach(places, function(place, placeId){

                    var correct = true;

                    angular.forEach(blacklistName, function(name, indexName){
                        if(place.name.indexOf(name) !== -1) {
                          correct = false;
                        }
                    });
      
                     angular.forEach(place.types, function(type, indexType){
                        if(blacklistTypes.indexOf(type) !== -1) {

                          correct = false;
                        }
                    });

                    if(correct){
                        foundPOI.push(place);
                    }
                });

                $rootScope.foundPOI = foundPOI;
            });

        };

        $rootScope.classifiedPOI = {};
        $rootScope.processPOI = function(){


            //GOOGLE POI
            angular.forEach($rootScope.foundPOI, function (POI, indexPOI){
                angular.forEach(POI.types, function(type, indexType){
                    if(typeof $rootScope.classifiedPOI[type] === 'undefined'){
                         $rootScope.classifiedPOI[type.toLowerCase()] = []
                    }  
                    $rootScope.classifiedPOI[type.toLowerCase()].push(POI);
                });
            });

            //TCS
            angular.forEach($rootScope.activitiesFound, function (activity, indexActivity){
                angular.forEach(activity.categories, function(category, indexCategory){
                    if(typeof $rootScope.classifiedPOI[type] === 'undefined'){
                     $rootScope.classifiedPOI[category.toLowerCase()] = []
                    }  
                    $rootScope.classifiedPOI[category.toLowerCase()].push(POI);
                });
               
            });

        };

        $timeout( function(){
            $rootScope.initializePhysicalAutoComplete();
        }, 1000);

        var mediaTags2 = ImageTagging.getMediaTags('2280482_01.jpg');
        console.info('mediaTags', mediaTags2);

        var amenities = ImageTagging.getAmenities('2280482');
        console.info('amenities', amenities);

        var reviewKeywords = ReviewAnalyser.analyseReviews('2280482');
        console.info('reviewKeywords', reviewKeywords);

        var propertyType = ReviewAnalyser.getPropertyType(reviewKeywords);
        console.info('propertyType', propertyType);

        var propertyAmenities = AmenitiesMapper.getPropertyAmenities(amenities, reviewKeywords);
        console.info('propertyAmenities', propertyAmenities);

        var roomAmenities = AmenitiesMapper.getRoomAmenities(amenities, reviewKeywords);
        console.info('roomAmenities', roomAmenities);

        var geoLocationData = {};

        var propertyDescription = DescriptionGenerator.getPropertyDescription($rootScope.HotelName, propertyType, propertyAmenities, roomAmenities, reviewKeywords, geoLocationData);
        console.info('propertyDescription', propertyDescription);

        $rootScope.airbnburl = 'https://www.airbnb.fr/rooms/1984135?location=Paris&s=3PCC-baj';

        $rootScope.mediaTags = [];
        //$rootScope.mediaTags.push(mediaTags2);
        $rootScope.propertyAmenities = propertyAmenities;
    })
    .config(function($httpProvider, $base64) {
        var auth = $base64.encode("EQCtest12933870:ew67nk33");
        $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;
    }) 
    .controller('exampleController', ['$scope', '$location', '$uibModal', '$http', '$window', '$timeout', '$rootScope', 'FileUploader', 'ImageTagging', 'ReviewAnalyser', 'DescriptionGenerator', 'AmenitiesMapper',
        function ($scope, $location, $uibModal, $http, $window, $timeout, $rootScope, FileUploader, ImageTagging, ReviewAnalyser, DescriptionGenerator, AmenitiesMapper) {
            
            
        
        }
    ])
    .controller('uploadController', ['$scope', '$location', '$uibModal', '$http', '$window', '$timeout', '$rootScope', 'FileUploader', 'ImageTagging', 'ReviewAnalyser', 'DescriptionGenerator', 'AmenitiesMapper',
        function ($scope, $location, $uibModal, $http, $window, $timeout, $rootScope, FileUploader, ImageTagging, ReviewAnalyser, DescriptionGenerator, AmenitiesMapper) {
        
        var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });
<<<<<<< b65a787bb384c90d9dff065b9a72b16fcf4bfd95
            
            
        
=======
>>>>>>> Expose property amenities to the view

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
            $rootScope.EngagingAnalysis = true;
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            
            $rootScope.mediaTags.push(ImageTagging.getMediaTags(fileItem.file.name));
            
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

            // call Media Tagging Service
            var mediaTags = ImageTagging.getMediaTags(fileItem.file.name);
            console.info('mediaTags for ' + fileItem.file.name, mediaTags);

            // place image on the right
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            
            $timeout( function(){ $rootScope.EngagingAnalysis = false; }, 10000 );
            
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

