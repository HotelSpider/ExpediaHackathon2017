var DescriptionGeneratorService = angular.module('DescriptionGeneratorService', [])
    .service('DescriptionGenerator', function () {

        this.getPropertyDescription = function (amenities, reviewKeywords, geoLocationData) {
            return 'No description yet';
        };

    });
