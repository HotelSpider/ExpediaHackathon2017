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

            //$http({
            //    method: 'GET',
            //    url: 'http://35.158.79.41/ExpediaHackathon2017/resources/api_responses/expedia/media_tagging_service/' + propId + '/' + imgFilenameRoot + '.json'
            //}).then(function successCallback(response) {
                
            //    var data = response.data;

            var response = '{"mediaUrl":"http://35.158.79.41/ExpediaHackathon2017/resources/test_data/2280482/pics/2280482_02.jpg","filename":null,"label":[{"source":"pollo_loco","name":"guestroom","confidence":0.4284900724887848},{"source":"pollo_loco","name":"living room  couch area","confidence":0.2794465124607086},{"source":"pollo_loco","name":"bathroom","confidence":0.07093866169452667},{"source":"pollo_loco","name":"interior seating  lobby","confidence":0.05896111577749252},{"source":"pollo_loco","name":"single dining area","confidence":0.053630780428647995},{"source":"pollo_loco","name":"kitchen","confidence":0.030679751187562943},{"source":"pollo_loco","name":"spa treatment","confidence":0.01556049007922411},{"source":"pollo_loco","name":"public dining","confidence":0.011895001865923405},{"source":"pollo_loco","name":"hallway","confidence":0.011160084046423435},{"source":"pollo_loco","name":"staircases","confidence":0.004887119866907597},{"source":"pollo_loco","name":"exterior hotel  grounds building","confidence":0.004579370375722647},{"source":"pollo_loco","name":"exterior tables and chairs","confidence":0.004466400481760502},{"source":"pollo_loco","name":"daytime exterior","confidence":0.0039375717751681805},{"source":"pollo_loco","name":"bar","confidence":0.003544245380908251},{"source":"pollo_loco","name":"business","confidence":0.0034217205829918385},{"source":"pollo_loco","name":"fancy tables and chairs","confidence":0.003311197506263852},{"source":"pollo_loco","name":"childrens play","confidence":0.0019235017243772745},{"source":"pollo_loco","name":"mini-fridge","confidence":0.0012053137179464102},{"source":"pollo_loco","name":"laundry","confidence":0.0010446273954585195},{"source":"pollo_loco","name":"exercise classes  equip","confidence":0.0010309823555871844},{"source":"pollo_loco","name":"coffee","confidence":9.579033358022571E-4},{"source":"pollo_loco","name":"pool","confidence":7.322984165512025E-4},{"source":"pollo_loco","name":"trays of food","confidence":6.970672984607518E-4},{"source":"pollo_loco","name":"food close-ups","confidence":6.344806752167642E-4},{"source":"pollo_loco","name":"safes","confidence":5.410680314525962E-4},{"source":"pollo_loco","name":"expedialodgingdomain","confidence":0.9999486207962036},{"source":"google_vision","name":"property","confidence":0.9050670266151428},{"source":"google_vision","name":"room","confidence":0.9014784693717957},{"source":"google_vision","name":"floor","confidence":0.7801146507263184},{"source":"google_vision","name":"living room","confidence":0.7363643646240234},{"source":"google_vision","name":"real estate","confidence":0.7220495343208313},{"source":"google_vision","name":"hardwood","confidence":0.7206248044967651},{"source":"google_vision","name":"home","confidence":0.6878818273544312},{"source":"google_vision","name":"interior design","confidence":0.6668425798416138},{"source":"google_vision","name":"cottage","confidence":0.6125093698501587},{"source":"google_vision","name":"estate","confidence":0.5976108312606812},{"source":"google_vision","name":"wood flooring","confidence":0.5687649846076965},{"source":"google_vision","name":"loft","confidence":0.5628584623336792},{"source":"google_vision","name":"laminate flooring","confidence":0.5436784625053406},{"source":"google_vision","name":"apartment","confidence":0.5430050492286682},{"source":"google_vision","name":"condominium","confidence":0.5323529839515686},{"source":"google_vision","name":"flooring","confidence":0.5009530186653137},{"source":"microsoft_vision","name":"indoor","confidence":0.9978718757629395},{"source":"microsoft_vision","name":"floor","confidence":0.9967504739761353},{"source":"microsoft_vision","name":"wall","confidence":0.9928755760192871},{"source":"microsoft_vision","name":"room","confidence":0.8839862942695618},{"source":"microsoft_vision","name":"wood","confidence":0.5265829563140869},{"source":"microsoft_vision","name":"furniture","confidence":0.42788106203079224}],"safesearch":[{"source":"google_vision","name":"adult","confidence":0.2},{"source":"google_vision","name":"medical","confidence":0.2},{"source":"google_vision","name":"spoof","confidence":0.2},{"source":"google_vision","name":"violence","confidence":0.2}],"landmark":[],"text":[],"face":[]}';
            var data = JSON.parse(response.replace(/\n/g, ''))
                
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

            //}, function errorCallback(response) {
            //    console.error('MediaTaggingService response', response.data);
            //});
        }
    });
