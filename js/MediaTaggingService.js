var MediaTaggingService = angular.module('MediaTaggingService', [])
    .service('ImageTagging', function () {
        this.getMediaTags = function (imgFilename) {
            return {
                filename: imgFilename,
                type: 'hotel'
            }
        }
    });
