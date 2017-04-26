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

            var description = propertyName + ' sits in the heart of ' + geoLocationData.neighborhoodName + ' in ' + geoLocationData.cityName + '. It offers ' + propertyType + ' with fully equipped {amenities}.\n';

            // subway access
            if ((geoLocationData.subwayDist < 200) || (location.indexOf('Subway') > -1)) {
                description += '\nDirectly accessible with the subway, it is located at only ' + geoLocationData.subwayDist + 'm from the ' + geoLocationData.subwayName + ' station.\n';
            }

            // furniture
            description += '\nThe ' + propertyType + ' is in a contemporary décor with country-style furniture. It is equipped with free Wi-Fi access, a flat-screen TV and a private bathroom.\n';

            // location
            removeFromArray(location, 'Subway');
            description += '\n' + propertyName + ' is ideally located near ' + location.join();

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
