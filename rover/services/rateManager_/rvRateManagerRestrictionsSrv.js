angular.module('sntRover').service('rvRateManagerRestrictionsSrv', ['Toggles', 'rvRateManagerUtilitySrv',
    function(Toggles, rvRateManagerUtilitySrv) {

		var service = this;

		// service object that handles various hierarchy Restrictions feature toggle values.
        service.hierarchyRestrictions = {
            houseEnabled: Toggles.isEnabled('hierarchical_house_restrictions'),
            roomTypeEnabled: Toggles.isEnabled('hierarchical_room_type_restrictions'),
            rateTypeEnabled: Toggles.isEnabled('hierarchical_rate_type_restrictions')
        };

        // Handle GET api while loading RM with various filters in House Level ( Frozen Panel).
        // Handle GET api, for individual cell click & popup in House Level ( Frozen Panel).
        service.formatRestrictionsData = function( restrcionsList, params) {
			// CICO-76813 : New API for hierarchyRestrictions
            if (service.hierarchyRestrictions.houseEnabled && params.restrictionType === 'HOUSE') {
                _.each(restrcionsList, function( item ) {
                    item.restrictions = rvRateManagerUtilitySrv.generateOldGetApiResponseFormat(item.restrictions);
                });
            }

            return restrcionsList;
        };

        // Handle GET api while loading RM with various filters in House Level ( Frozen Panel).
        service.getURLforCommonRestrictions = function() {
			var url = '/api/daily_rates/all_restrictions';

            // CICO-76813 : New API for hierarchyRestrictions
            if (service.hierarchyRestrictions.houseEnabled) {
                url = '/api/restrictions/house';
            }
            return url;
        };

		// Handle GET api, for individual cell click & popup in House Level ( Frozen Panel).
        service.getURLforAllRestrictionsWithStatus = function(params) {
			var url = '/api/daily_rates/all_restriction_statuses';

            // CICO-76813 : New API for hierarchyRestrictions
            if (service.hierarchyRestrictions.houseEnabled && params.restrictionType === 'HOUSE') {
                url = '/api/restrictions/house';
            }
            return url;
        };

        // Handle POST api, for individual cell click & popup in House Level ( Frozen Panel).
        service.getURLforApplyAllRestrictions = function(params) {
			var url = '/api/daily_rates';

            // CICO-76813 : New API for hierarchyRestrictions
            if (service.hierarchyRestrictions.houseEnabled && params.restrictionType === 'HOUSE') {
                url = '/api/restrictions/house';
            }
            return url;
        };

        // Handle POST api, for individual cell click & popup in House Level ( Frozen Panel).
        service.processParamsforApplyAllRestrictions = function( params ) {
            if (service.hierarchyRestrictions.houseEnabled && params.restrictionType === 'HOUSE') {
				params = rvRateManagerUtilitySrv.generateNewPostApiParams(params);
            }
            return params;
        };

    }
]);