angular.module('sntRover').
    service('RVLikesSrv', ['$q', 'RVBaseWebSrv', '$http', require('../../modules/snt/services/likes/rvLikesSrv').LikesSrv]);
