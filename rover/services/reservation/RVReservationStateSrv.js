sntRover.service('RVReservationStateService', [
	function($q, RVBaseWebSrvV2) {
		var self = this;
		self.metaData = {
			rateAddons: [],
			taxDetails: []
		};


		/**
		 * Method to get the addons associated with a Rate
		 * @param  {[type]} rateId [description]
		 * @return {[type]}        [description]
		 */
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

		/**
		 * This method is used to calculate the rate amount of the room
		 * @param  {Object} rateTable   
		 * @param  {Integer} numAdults   
		 * @param  {Integer} numChildren 
		 * @return {Float}             
		 */
		self.calculateRate = function(rateTable, numAdults, numChildren) {
			var baseRoomRate = numAdults >= 2 ? rateTable.double : rateTable.single;
			var extraAdults = numAdults >= 2 ? numAdults - 2 : 0;
			return baseRoomRate + (extraAdults * rateTable.extra_adult) + (numChildren * rateTable.child);
		}

		/**
		 * This method returns the break down of taxes after computation of the same.
		 * @param  {Float} taxableAmount      
		 * @param  {Object} taxes       
		 * @param  {Integer} roomIndex   
		 * @param  {Boolean} forAddons   
		 * @param  {Integer} numAdults   
		 * @param  {Integer} numChildren 
		 * @return {Object}             
		 */
		self.calculateTax = function(taxableAmount, taxes, roomIndex, forAddons, numAdults, numChildren) {
			var taxInclusiveTotal = 0.0, //Per Night Inclusive Charges
				taxExclusiveTotal = 0.0; //Per Night Exclusive Charges
			// --The above two are required only for the room and rates section where we do not display the STAY taxes
			var taxInclusiveStayTotal = 0.0, //Per Stay Inclusive Charges
				taxExclusiveStayTotal = 0.0; //Per Stay Exlusive Charges
			var taxDescription = [],
				taxesLookUp = {};

			_.each(taxes, function(tax) {
				//for every tax that is associated to the date proceed
				var isInclusive = tax.is_inclusive,
					taxData = _.findWhere(self.metaData.taxDetails, { // obtain the tax data from the metaData
						id: parseInt(tax.charge_code_id)
					});

				if (!!taxData) {
					var taxValue = taxData.amount,
						amountType = taxData.amount_type,
						multiplicity = 1; // for amount_type = flat

					if (taxData.amount_sign != "+")
						taxData.amount = parseFloat(taxData.amount * -1.0);

					if (amountType == "ADULT") multiplicity = numAdults;
					else if (amountType == "CHILD") multiplicity = numChildren;
					else if (amountType == "PERSON") multiplicity = parseInt(numChildren) + parseInt(numAdults);

					if (!!tax.calculation_rules.length) {
						_.each(tax.calculation_rules, function(tax) {
							taxableAmount = parseFloat(taxableAmount) + parseFloat(taxesLookUp[tax]);
						});
					}

					// THE TAX CALCULATION HAPPENS HERE
					var taxCalculated = 0;
					if (taxData.amount_symbol == '%' && parseFloat(taxValue) != 0.0) { // The formula for inclusive tax computation is different from that for exclusive. Kindly NOTE.
						if (isInclusive) taxCalculated = parseFloat(multiplicity * (parseFloat(taxValue / (100 + parseFloat(taxValue))) * taxableAmount));
						else taxCalculated = parseFloat(multiplicity * (parseFloat(taxValue / 100) * taxableAmount));
					} else {
						taxCalculated = parseFloat(multiplicity * parseFloat(taxValue)); //In case the tax is not a percentage amount, its plain multiplication with the tax's amount_type 
					}

					taxesLookUp[taxData.id] = parseFloat(taxCalculated);

					if (taxData.post_type == 'NIGHT') { // NIGHT tax computations
						if (isInclusive) taxInclusiveTotal = parseFloat(taxInclusiveTotal) + parseFloat(taxCalculated);
						else taxExclusiveTotal = parseFloat(taxExclusiveTotal) + parseFloat(taxCalculated);
					} else { // STAY tax computations                 
						if (isInclusive) taxInclusiveStayTotal = parseFloat(taxInclusiveStayTotal) + parseFloat(taxCalculated);
						else taxExclusiveStayTotal = parseFloat(taxExclusiveStayTotal) + parseFloat(taxCalculated);
					}

					taxDescription.push({
						postType: taxData.post_type,
						isInclusive: isInclusive,
						amount: taxCalculated,
						id: taxData.id,
						description: taxData.description,
						roomIndex: roomIndex
					});
				} else {
					console.warn('Error condition! Tax code in results but not in meta data');
				}
			});
			return {
				inclusiveTotal: parseFloat(taxInclusiveTotal) + parseFloat(taxInclusiveStayTotal),
				exclusiveTotal: parseFloat(taxExclusiveTotal) + parseFloat(taxExclusiveStayTotal),
				exclusive: taxExclusiveTotal,
				inclusive: taxInclusiveTotal,
				stayInclusive: taxInclusiveStayTotal,
				stayExclusive: taxExclusiveStayTotal,
				taxDescription: taxDescription
			};
		};

	}
]);