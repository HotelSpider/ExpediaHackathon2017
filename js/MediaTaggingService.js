var MediaTaggingService = angular.module('MediaTaggingService', [])
    .service('ImageTagging', function ($http) {
        var amenitiesCache = [];

        this.getAmenities = function (propertyId) {
            return amenitiesCache[propertyId];
        }

        var recordAmenity = function (propertyId, amenity) {
            if (typeof amenitiesCache[propertyId] === 'undefined') {
                amenitiesCache[propertyId] = [];
            }

            if (amenitiesCache[propertyId].indexOf(amenity) == -1) {
                amenitiesCache[propertyId].push(amenity);
            }
        }

        var checkAmenity = function (propId, lbl, key, confThresh, amenity) {
            if (lbl.name == key) {
                if ((typeof amenity !== 'undefined') && (lbl.confidence > confThresh)) {
                    recordAmenity(propId, amenity);
                }
                return lbl.confidence;
            }
            return 0;
        }

        this.getMediaTags = function (imgFilename) {
            var imgFilenameRoot = imgFilename.split('.')[0];
            var propId = imgFilenameRoot.split('_')[0];
$timeout(function(){
            return $http({
                method: 'GET',
                url: 'http://35.158.79.41/ExpediaHackathon2017/resources/api_responses/expedia/media_tagging_service/' + propId + '/' + imgFilenameRoot + '.json'
            }).then(function successCallback(response) {
                
                var data = response.data;

                var roomConfidence = 0;
                var propConfidence = 0;
                angular.forEach(data.label, function (lbl) {
                    // what makes a room
                    roomConfidence += checkAmenity(propId, lbl, 'guestroom', 0.5, 'guestroom');
                    roomConfidence += checkAmenity(propId, lbl, 'bathroom', 0.5, 'bathroom');
                    roomConfidence += checkAmenity(propId, lbl, 'bed');
                    // what makes a property
                    propConfidence += checkAmenity(propId, lbl, 'kitchen', 0.5, 'kitchen');
                    propConfidence += checkAmenity(propId, lbl, 'exterior tables and chairs', 0.25, 'terrace');
                    propConfidence += checkAmenity(propId, lbl, 'living');
                    propConfidence += checkAmenity(propId, lbl, 'living room');
                    propConfidence += checkAmenity(propId, lbl, 'courtyard');
                    propConfidence += checkAmenity(propId, lbl, 'backyard');
                    // other amenities
                    checkAmenity(propId, lbl, 'bidet', 0.5, 'bidet');
                    checkAmenity(propId, lbl, 'hardwood', 0.5, 'wood flooring');
                    checkAmenity(propId, lbl, 'wood flooring', 0.5, 'wood flooring');
                    checkAmenity(propId, lbl, 'living room  couch area', 0.4, 'couch');
                    checkAmenity(propId, lbl, 'loft', 0.5, 'loft');

                    // DEBUG: if (lbl.confidence > 0.2) { console.log(lbl.name + ' ('+lbl.confidence+')') };
                });

                console.info('confidences', { file: imgFilename, room: roomConfidence, property: propConfidence });
                var type = (roomConfidence > propConfidence) ? 'guestroom' : 'property';
                return {
                    filename: imgFilename,
                    type: type
                }

            }, function errorCallback(response) {
                console.error('MediaTaggingService response', response.data);
            });
        }, 2000);
        }
    });
