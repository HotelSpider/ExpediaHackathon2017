var AmenitiesMappingService = angular.module('AmenitiesMappingService', [])
    .service('AmenitiesMapper', function () {

        var propertyAmenitiesLUT = {
            'couch': '',
        };

        this.getPropertyAmenities = function (keywords) {
            return featuredAmenitiesFullList;
        };

        this.getRoomAmenities = function (keywords) {
            return ['ROOM_WIFI_INTERNET', 'ROOM_BIDET'];
        };

    });
