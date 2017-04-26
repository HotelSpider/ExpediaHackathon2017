var AmenitiesMappingService = angular.module('AmenitiesMappingService', [])
    .service('AmenitiesMapper', function () {

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

        var propertyAmenitiesLUT = [];

        angular.forEach(featuredAmenitiesFullList, function (a) {
            propertyAmenitiesLUT[a] = [];
        });

        var roomAmenitiesLUT = [];

        angular.forEach(roomAmenitiesFullList, function (a) {
            roomAmenitiesLUT[a] = [];
        });

        // init mapping
        propertyAmenitiesLUT['Terrace'] = ['terrace'];

        roomAmenitiesLUT['Terrace'] = ['terrace'];
        roomAmenitiesLUT['Microwave'] = ['microwave'];
        roomAmenitiesLUT['Refrigerator'] = ['fridge'];

        // public methods
        this.getPropertyAmenities = function (amenities, reviewKeywords) {

            var propertyAmenities = [];
            var unusedAmenities = amenities;
            var unusedKeywords = [];
            for (var k in reviewKeywords.Property) {
                unusedKeywords.push(k);
            }

            for (var amenity in propertyAmenitiesLUT) {
                let keywords = propertyAmenitiesLUT[amenity];

                angular.forEach(amenities, function (a) {
                    if (keywords.indexOf(a) > -1) {
                        removeFromArray(unusedAmenities, a);
                        propertyAmenities.push(amenity);
                    }
                });

                for (var keyword in reviewKeywords.Property) {
                    if (keywords.indexOf(keyword) > -1) {
                        removeFromArray(unusedKeywords, keyword);
                        propertyAmenities.push(amenity);
                    }
                }
            }

            console.info('unusedAmenities', unusedAmenities);
            console.info('unusedKeywords', unusedKeywords);

            return propertyAmenities;
        };

        this.getRoomAmenities = function (amenities, reviewKeywords) {

            var roomAmenities = [];
            var unusedAmenities = amenities;
            var unusedKeywords = [];
            for (var k in reviewKeywords.Room) {
                unusedKeywords.push(k);
            }

            for (var amenity in roomAmenitiesLUT) {
                let keywords = roomAmenitiesLUT[amenity];

                angular.forEach(amenities, function (a) {
                    if (keywords.indexOf(a) > -1) {
                        removeFromArray(unusedAmenities, a);
                        roomAmenities.push(amenity);
                    }
                });

                for (var keyword in reviewKeywords.Room) {
                    if (keywords.indexOf(keyword) > -1) {
                        removeFromArray(unusedKeywords, keyword);
                        roomAmenities.push(amenity);
                    }
                }
            }

            console.info('unusedAmenities (room)', unusedAmenities);
            console.info('unusedKeywords (room)', unusedKeywords);

            return roomAmenities;
        };

    });
