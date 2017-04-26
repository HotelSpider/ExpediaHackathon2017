var DescriptionGeneratorService = angular.module('DescriptionGeneratorService', [])
    .service('DescriptionGenerator', function () {

        var removeFromArray = function (arr) {
            var what, a = arguments, L = a.length, ax;
            while (L > 1 && arr.length) {
                what = a[--L];
                while ((ax = arr.indexOf(what)) !== -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        }

        var getLocation = function (locationKeywords) {
            var location = [];
            if (typeof locationKeywords != 'undefined') {
                if (locationKeywords.hasOwnProperty('eiffeltower')) {
                    location.push('Eiffel Tower');
                }
                if (locationKeywords.hasOwnProperty('montparnasse')) {
                    location.push('Montparnasse');
                }
                if (locationKeywords.hasOwnProperty('subway') || locationKeywords.hasOwnProperty('metro')) {
                    location.push('Subway');
                }
            }
            return location;
        }

        this.getPropertyDescription = function (propertyName, propertyType, propertyAmenities, roomAmenities, reviewKeywords, geoLocationData) {

            var location = getLocation(reviewKeywords.Location);
console.log(propertyName);
            var description = propertyName + ' sits in the heart of ' + geoLocationData.neighborhoodName + ' in ' + geoLocationData.cityName + '. It offers ' + propertyType + ' with fully equipped {amenities}.\n';

            // subway access
            if ((geoLocationData.subwayDist < 200) || (location.indexOf('Subway') > -1)) {
                var subDistDisplay = (geoLocationData.subwayDist > 1000) ? parseFloat(Math.round(geoLocationData.subwayDist / 1000).toFixed(2)) + 'km' : geoLocationData.subwayDist + 'm';
                description += '\nDirectly accessible with the subway, it is located at only ' + geoLocationData.subDistDisplay + ' from the ' + geoLocationData.subwayName + ' station.\n';
            }

            // furniture
            description += '\nThe ' + propertyType + ' is in a contemporary décor with country-style furniture. It is equipped with free Wi-Fi access, a flat-screen TV and a private bathroom.\n';

            // location
            removeFromArray(location, 'Subway');
            description += '\n' + propertyName + ' is ideally located near ';
            for (var i = 0; i < location.length; i++) {
                description += location[i];
                if (i != location.length) {
                    if (location.length > 2) {
                        if (i != location.length - 1) {
                            description += ', ';
                        } else {
                            description += ' and ';
                        }
                    } else {
                        description += ' and ';
                    }
                }
            }
            description += '.\n';

            //Airport
            if(geoLocationData.airportName != ''){
                description += "\nThe nearest aiport is " + geoLocationData.airportName + " situated at " + geoLocationData.airportDistance;
            }

            //TCS
            var activitiesFound = [];
            angular.forEach(geoLocationData.activities, function (activity, indexActivity){
                angular.forEach(activity.categories, function(category, indexCategory){
                    if(typeof activitiesFound[category] === 'undefined'){
                        activitiesFound[category.toLowerCase()] = []
                    }  
                    activitiesFound[category.toLowerCase()].push(category);
                });
               
            });

            //GOOGLE POI
            var classifiedPOI = {};
            angular.forEach(geoLocationData.POI, function (POI, indexPOI){
                angular.forEach(POI.types, function(type, indexType){
                    if(typeof classifiedPOI[type] === 'undefined'){
                         classifiedPOI[type.toLowerCase()] = []
                    }  
                    classifiedPOI[type.toLowerCase()].push(POI);
                });
            });

            //TCS
            if(activitiesFound.length == 1){
                description += ' and near some ' + activitiesFound[0];
            }else{
                description += '. Activities near the property are: ';
                var activities = '';
                angular.forEach(activitiesFound, function (category, indexCategory){
                        if(activities == ''){
                            activities = indexCategory;
                        }else{
                            activities += ', ' + indexCategory;
                        }  
                });
                description += activities;
            }

            // POI
            if(classifiedPOI.length == 1){
                description += '. You will find next to it ' + geoLocationData.POI[0].name;
            }else{
                description += '. Point of interests near the property includes: ';
                var types = '';
                angular.forEach(classifiedPOI, function(type, indexCategory){
                    if(types == ''){
                        types = indexCategory;
                    }else{
                        types += ', ' + indexCategory;
                    }   
                });
                description += types;
            }

            return description;
        };

        /*
L'appartement Le St Georges sits in the heart of Dijon, 300 m from the Palais des Ducs Bourgogne. It offers apartment with fully equipped kitchens and a spacious lounge.

The apartment is in a contemporary décor with country-style furniture. It is equipped with free Wi-Fi access, a flat-screen TV and a private bathroom.

Public parking is available nearby the apartment. L'appartement Le St Georges is a 15-minute walk from Dijon Train Station.

Several restaurants are within a short walking distance from the property. Dijon Cathedral and Philippe le Bon Tower is are a 5-minute walk from the apartment. 

This is our guests' favorite part of Dijon, according to independent reviews.

This property also has one of the top-rated locations in Dijon! Guests are happier about it compared to other properties in the area.

--------------------

Studio Meublé Dijon offers self-catering studios located in the city centre of Dijon, 2 km from Dijon Ville Train Station and 600 m from Dijon Congrexpo. Accessible by a staircase, they offer a seating area with a flat-screen TV.

The kitchenette is equipped with a refrigerator, kitchenware and a stove, and the dining table seats 2 people. The private bathroom is fitted with a shower and a hairdryer. Ironing facilities are provided.

Free parking is possible on site and many bars, restaurants and shops are found within 1 km of the studio. It is 1 km from the Musée des Beaux-Arts de Dijon and 6 km from Kir Lake. 

This is our guests' favorite part of Dijon, according to independent reviews.

Couples in particular like the location – they rated it 8 for a two-person trip.
        */

    });
