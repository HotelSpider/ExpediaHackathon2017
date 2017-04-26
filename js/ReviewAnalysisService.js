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
            return JSON.parse('{"Miscellaneous":{"accommodation":1,"neighborhood":1,"apartment":9,"location":7,"place":4,"stay":2,"trip":3},"Room":{"microwave":1,"bathroom":2,"windows":1,"kitchen":1,"washer":1,"fridge":1,"views":1,"view":38},"Location":{"towersparkle":1,"montparnasse":1,"metrostation":1,"eiffeltower":2,"metrostop":1,"station":1,"eiffel":1,"subway":1,"space":1,"tower":3,"city":1,"ina":1,"of":1},"Property":{"officebuildings":1,"cleanliness":3,"apartment":2,"supplies":1,"checkin":1,"check":1,"decor":2,"dcor":1,"host":1,"in":2}}');
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

        this.getViewType = function (keywords) {
            if (keywords.Room.hasOwnProperty('view') || keywords.Room.hasOwnProperty('views') || keywords.Property.hasOwnProperty('view') || keywords.Property.hasOwnProperty('views')) {
                if (keywords.Location.hasOwnProperty('city')) {
                    return 'City View';
                }
            }
        }
    });
