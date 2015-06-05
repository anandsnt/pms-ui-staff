sntRover.service('RVReservationStateService', [
	function($q, RVBaseWebSrvV2) {
		var self = this;
		self.metaData = {
			rateAddons: []
		};

		






		
		self.fetchAssociatedAddons = function(rateId) {
			var rateAddons = _.findWhere(self.metaData.rateAddons, {
				rate_id: rateId,
			});

			return rateAddons.associated_addons;
		}




		/**
         * Method to calculate the applicable amount the particular selected addon
         * @param  {string} amountType      -
         * @param  {double} baseRate        -
         * @param  {int} numAdults          -
         * @param  {int} numChildren        -
         * @return {double}                 -
         */
        self.getAddonAmount = function(amountType, baseRate, numAdults, numChildren) {
            if (amountType == "PERSON") {
                return baseRate * parseInt(parseInt(numAdults) + parseInt(numChildren));
            } else if (amountType == "CHILD") {
                return baseRate * parseInt(numChildren);
            } else if (amountType == "ADULT") {
                return baseRate * parseInt(numAdults);
            }
            return baseRate;
        };

	}
]);