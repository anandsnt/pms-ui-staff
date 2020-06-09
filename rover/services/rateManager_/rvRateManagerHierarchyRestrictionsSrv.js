angular.module('sntRover').service('rvRateManagerHierarchyRestrictionsSrv', ['$q', 'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {
        // Exclusive service for hierarchy restrictions
        var service = this,
            roomTypeUrl =  '/api/restrictions/room_types';
        
        service.saveHouseRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(houseUrl, params);
        };

        service.saveRoomTypeRestrictions = () => {
            return BaseWebSrvV2.postJSON(roomTypeUrl, params);
        };

        service.saveRateTypeRestrictions = () => {};

        service.saveRateRestrictions = () => {};

        service.fetchHierarchyRestrictions = (params) => {
            return BaseWebSrvV2.getJSON('/api/restrictions/hierarchy', params);
        };

        service.fetchAllRoomTypes = (params) => {
            return BaseWebSrvV2.getJSON('/api/room_types.json', params);
        };
    }
]);
