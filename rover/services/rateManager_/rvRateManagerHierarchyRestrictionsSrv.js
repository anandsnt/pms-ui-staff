angular.module('sntRover').service('rvRateManagerHierarchyRestrictionsSrv', ['$q', 'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {
        // Exclusive service for hierarchy restrictions
        var service = this,
            houseUrl = '/api/restrictions/house',
            roomTypeUrl =  '/api/restrictions/room_types',
            rateTypeUrl = '/api/restrictions/rate_types',
            rateUrl = '/api/restrictions/rates';
        
        service.saveHouseRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(houseUrl, params);
        };

        service.saveRoomTypeRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(roomTypeUrl, params);
        };

        service.saveRateTypeRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(rateTypeUrl, params);
        };

        service.saveRateRestrictions = (params) => {
            return BaseWebSrvV2.postJSON(rateUrl, params);
        };

        service.fetchHierarchyRestrictions = (params) => {
            return BaseWebSrvV2.getJSON('/api/restrictions/hierarchy', params);
        };

        service.fetchAllRoomTypes = (params) => {
            return BaseWebSrvV2.getJSON('/api/room_types.json', params);
        };

        service.fetchAllRateTypes = (params) => {
            return BaseWebSrvV2.getJSON('/api/rate_types/active', params);
        };

        service.fetchAllRates = (params) => {
            return BaseWebSrvV2.getJSON('/api/rates', params);
        };
    }
]);
