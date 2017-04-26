var ReviewAnalysisService = angular.module('ReviewAnalysisService', [])
    .service('ReviewAnalyser', function ($http) {

        this.analyseReviews = function (hotelCode) {
            //$http({
            //    method: 'GET',
            //    url: 'http://35.158.79.41/ExpediaHackathon2017/getReviewsKeywords.php?HotelCode=' + hotelCode
            //}).then(function successCallback(response) {
            //    return response.data;
            //}, function errorCallback(response) {
            //    // called asynchronously if an error occurs
            //    // or server returns response with an error status.
            //});

            // DEBUG
            return JSON.parse('{"Miscellaneous":{"apartment":9,"location":7,"place":4,"trip":3,"stay":2,"accommodation":1,"neighborhood":1},"Room":{"view":22,"bathroom":2,"windows":1,"views":1,"kitchen":1,"fridge":1,"microwave":1,"washer":1},"Location":{"tower":3,"metro":2,"station":2,"space":1,"Eiffel":1,"Tower":1,"eiffel":1,"of":1,"Montparnasse":1,"I\u00e9na":1,"subway":1,"sparkle":1,"stop":1,"city":1},"Property":{"apartment":2,"check":2,"in":2,"cleanliness":2,"d\u00e9cor":1,"Decor":1,"office":1,"buildings":1,"supplies":1,"decor":1,"host":1}}');
        };

        this.getPropertyType = function (keywords) {
            var existingPropertyType = [
                'HOTEL',
                'MOTEL',
                'APART_HOTEL',
                'BED_AND_BREAKFAST',
                'INN',
                'APARTMENT',
                'CONDO',
                'COTTAGE'
            ];

            if (keywords.Miscellaneous.hasOwnProperty('apartment')) {
                return 'apartment';
            }

            return hotel;
        }
    });
