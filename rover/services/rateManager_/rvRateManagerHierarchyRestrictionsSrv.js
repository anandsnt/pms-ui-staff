angular.module('sntRover').service('rvRateManagerHierarchyRestrictionsSrv', ['$q', 'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {
        // Exclusive service for hierarchy restrictions
        var service = this,
            houseUrl = '/api/restrictions/house',
            roomTypeUrl =  '/api/restrictions/room_types',
            rateTypeUrl = '/api/restrictions/rate_types';

        service.fetchHouseRestrictions = (params) => {
            return BaseWebSrvV2.getJSON(houseUrl, params);
        };
        
        service.saveHouseRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(houseUrl, params);
        };

        service.saveRoomTypeRestrictions = (params) => {
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

        service.deleteRateTypeRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(rateTypeUrl, params);
        };
    }
]);
