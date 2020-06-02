angular.module('sntRover').service('rvRateManagerHierarchyRestrictionsSrv', ['$q', 'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {
        // Exclusive service for hierarchy restrictions
        var service = this,
            houseUrl = '/api/restrictions/house',
            roomTypeUrl =  '/api/restrictions/room_types',
            rateTypeUrl = '/api/restrictions/rate_types',
            rateUrl = '/api/restrictions/rates';

        service.fetchHouseRestrictions = (params) => {
            return BaseWebSrvV2.getJSON(houseUrl, params);
        };
        
        service.saveHouseRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(houseUrl, params);
        };

        service.saveRoomTypeRestrictions = () => {};
        service.saveRateTypeRestrictions = () => {};
        service.saveRateRestrictions = () => {};

        service.fetchHierarchyRestrictions = (params) => {
            return BaseWebSrvV2.getJSON('/api/restrictions/hierarchy', params);
        };

        service.deleteHouseRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(houseUrl, params);
        };

        service.deleteRoomTypeRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(roomTypeUrl, params);
        };

        service.deleteRateTypeRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(rateTypeUrl, params);
        };

        service.deleteRateRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(rateUrl, params);
        };
    }
]);
