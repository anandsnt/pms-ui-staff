angular.module('sntRover').
    service('RVLikesSrv', ['$q', 'RVBaseWebSrv', '$http', require('../../modules/snt/guestLikes.service').LikesSrv]);
