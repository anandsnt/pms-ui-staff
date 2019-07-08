admin.service('adAxbaseSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {
    this.fetchRoomMappings = function() {
        var url = 'ifc/proxy/axbase3000/fetch_room_mappings';
        return ADBaseWebSrvV2.getJSON(url);
    };
}]);
