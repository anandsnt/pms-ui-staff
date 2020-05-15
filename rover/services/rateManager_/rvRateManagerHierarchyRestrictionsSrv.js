angular.module('sntRover').service('rvRateManagerHierarchyRestrictionsSrv', ['$q', 'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {
        // Exclusive service for hierarchy restrictions
        var service = this,
            houseUrl = '/api/restrictions/house';

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

        service.deleteRestrictions = (params) => {
            return BaseWebSrvV2.postJSON('/api/restrictions/house', params);
        };
    }
]);
