sntRover.service('RVReservationStateService', [
	function() {
		var self = this;
		self.metaData = {
			rateAddons: [],
			taxDetails: []
		};

		self.reservationFlags = {
			outsideStaydatesForGroup: false,
			RATE_CHANGED: false
		}

		self.bookMark = {
			lastPostedRate: null
		}


		/**
		 * Method to get the addons associated with a Rate
		 * @param  {[type]} rateId [description]
		 * @return {[type]}        [description]
		 */
		self.fetchAssociatedAddons = function(rateId) {
			var rateAddons = _.findWhere(self.metaData.rateAddons, {
				rate_id: rateId
			});
			return rateAddons.associated_addons;
		};


		/**
		 * Method to calculate the applicable amount the particular selected addon
		 * @param  {string} amountType      -
		 * @param  {double} baseRate        -
		 * @param  {int} numAdults          -
		 * @param  {int} numChildren        -
		 * @return {double}                 -
		 */
		self.getAddonAmount = function(amountType, baseRate, numAdults, numChildren) {
			if (amountType === "PERSON") {
				return baseRate * parseInt(parseInt(numAdults) + parseInt(numChildren));
			} else if (amountType === "CHILD") {
				return baseRate * parseInt(numChildren);
			} else if (amountType === "ADULT") {
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
		self.calculateTax = function(taxableAmount, taxes, roomIndex, numAdults, numChildren, forAddons) {
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

					if (taxData.amount_sign !== "+") {
						taxData.amount = parseFloat(taxData.amount * -1.0);
					}
					if (amountType === "ADULT") {
						multiplicity = numAdults;
					} else if (amountType === "CHILD") {
						multiplicity = numChildren;
					} else if (amountType === "PERSON") {
						multiplicity = parseInt(numChildren) + parseInt(numAdults);
					}
					if (!!tax.calculation_rules.length) {
						_.each(tax.calculation_rules, function(tax) {
							taxableAmount += parseFloat(taxesLookUp[tax]);
						});
					}

					// THE TAX CALCULATION HAPPENS HERE
					var taxCalculated = 0;
					if (taxData.amount_symbol === '%' && parseFloat(taxValue) !== 0.0) { // The formula for inclusive tax computation is different from that for exclusive. Kindly NOTE.
						if (isInclusive) {
							taxCalculated = parseFloat(multiplicity * (parseFloat(taxValue / (100 + parseFloat(taxValue))) * taxableAmount));
						} else {
							taxCalculated = parseFloat(multiplicity * (parseFloat(taxValue / 100) * taxableAmount));
						}
					} else {
						taxCalculated = parseFloat(multiplicity * parseFloat(taxValue)); //In case the tax is not a percentage amount, its plain multiplication with the tax's amount_type
					}

					taxesLookUp[taxData.id] = parseFloat(taxCalculated);

					if (!!tax.calculation_rules.length) {
						_.each(tax.calculation_rules, function(tax) {
							taxableAmount -= parseFloat(taxesLookUp[tax]);
						});
					}
					if (isInclusive) {
						taxableAmount -= parseFloat(taxCalculated);
					}

					if (taxData.post_type === 'NIGHT') { // NIGHT tax computations
						if (isInclusive) taxInclusiveTotal = parseFloat(taxInclusiveTotal) + parseFloat(taxCalculated);
						else taxExclusiveTotal = parseFloat(taxExclusiveTotal) + parseFloat(taxCalculated);
					} else { // STAY tax computations
						if (isInclusive) {
							taxInclusiveStayTotal = parseFloat(taxInclusiveStayTotal) + parseFloat(taxCalculated);
						} else {
							taxExclusiveStayTotal = parseFloat(taxExclusiveStayTotal) + parseFloat(taxCalculated);
						}
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
				EXCL: {
					NIGHT: taxExclusiveTotal,
					STAY: taxExclusiveStayTotal,
					total: parseFloat(taxExclusiveTotal) + parseFloat(taxExclusiveStayTotal)
				},
				INCL: {
					NIGHT: taxInclusiveTotal,
					STAY: taxInclusiveStayTotal,
					total: parseFloat(taxInclusiveTotal) + parseFloat(taxInclusiveStayTotal)
				},
				taxDescription: taxDescription
			};
		};

		self.setReservationFlag = function(key, status) {
			self.reservationFlags[key] = status;
		};

		self.getReservationFlag = function(key) {
			return self.reservationFlags[key];
		};

		self.shouldPostAddon = function(frequency, present, arrival) {
			if (frequency === 0 && present === arrival) {
				return true;
			}
			var dayIndex = parseInt((new tzIndependentDate(present) - new tzIndependentDate(arrival)) / (24 * 3600 * 1000), 10);
			return dayIndex % frequency === 0;
		};

		/**
		 * method to initially parse availability response
		 * @param  {[type]} roomRates [description]
		 * @param  {[type]} arrival   [description]
		 * @param  {[type]} departure [description]
		 * @return {[type]}           [description]
		 */
		self.parseRoomRates = function(roomRates, arrival, departure, stayDates, activeRoom, numNights) {
			var rooms = {},
				roomDetails = [],
				displayDates = [];

			$(roomRates.room_types).each(function(i, d) {
				roomDetails[d.id] = d;
			});

			// Parse through all room-rate combinations.
			_.each(roomRates.results, function(roomRate, i) {
				/*  --Initializing the displayData.dates array for the rows in the day wise rate table
				 *	Need NOT show the departure day in the table. [It is NOT included in any of the computations]
				 *	Hence check if the day is a departure day before adding it to the array
				 *	Have added a check to handle zero nights > Need to check with product team if zero nights is an accepted scenario.
				 *	If so, will have to change computation in other places as well to handle zero nights.
				 */
				var for_date = roomRate.date,
					adultsOnTheDay = stayDates[for_date].guests.adults,
					childrenOnTheDay = stayDates[for_date].guests.children;

				if (roomRate.date === arrival || roomRate.date !== departure) {
					displayDates.push({
						str: for_date,
						obj: new tzIndependentDate(for_date)
					});
				}

				//step1: Initial population of the rooms array
				_.each(roomRate.room_types, function(roomType, i) {
					var roomTypeId = roomType.id;
					if (typeof rooms[roomTypeId] === "undefined") {
						rooms[roomTypeId] = {
							id: roomTypeId,
							name: roomDetails[roomTypeId].name,
							level: roomDetails[roomTypeId].level,
							availability: true,
							rates: [],
							ratedetails: {},
							total: [],
							defaultRate: 0,
							averagePerNight: 0,
							description: roomDetails[roomTypeId].description,
							availabilityNumbers: {},
							stayTaxes: {}
						}
					};
					rooms[roomTypeId].availabilityNumbers[for_date] = roomType.availability;
				});

				//step2: Parse the rates and populate the object created for rooms in step1
				_.each(roomRate.rates, function(rate, i) {
					var rate_id = rate.id;
					var taxes = rate.taxes;
					_.each(rate.room_rates, function(room_rate, i) {
						var associatedAddons = self.fetchAssociatedAddons(rate_id),
							addonRate = 0.0,
							taxForAddons = {
								incl: 0.0,
								excl: 0.0
							},
							addonsApplied = [],
							inclusiveAddonsAmount = 0.0,
							currentRoomId = room_rate.room_type_id,
							currentRoom = rooms[room_rate.room_type_id];

						if (typeof currentRoom.stayTaxes[rate_id] === 'undefined') {
							currentRoom.stayTaxes[rate_id] = {
								incl: {},
								excl: {}
							};
						}

						var updateStayTaxes = function(taxDetails) {
							_.each(taxDetails, function(taxDetail) {
								if (taxDetail.postType === 'STAY') {
									var taxType = taxDetail.isInclusive ? "incl" : "excl",
										currentTaxId = taxDetail.id,
										currentStayStore = currentRoom.stayTaxes[rate_id];
									if (typeof currentStayStore[taxType][currentTaxId] === 'undefined') {
										currentStayStore[taxType][currentTaxId] = parseFloat(taxDetail.amount)
									} else {
										currentStayStore[taxType][currentTaxId] = _.max([currentStayStore[taxType][currentTaxId], parseFloat(taxDetail.amount)]);
									}
								}
							});
						};

						if (associatedAddons.length > 0) {
							_.each(associatedAddons, function(addon) {
								var currentAddonAmount = parseFloat(self.getAddonAmount(addon.amount_type.value, parseFloat(addon.amount), adultsOnTheDay, childrenOnTheDay)),
									taxOnCurrentAddon = 0.0,
									shouldPostAddon = self.shouldPostAddon(addon.post_type.frequency, for_date, arrival);
								if (shouldPostAddon) {
									taxOnCurrentAddon = self.calculateTax(currentAddonAmount, addon.taxes, activeRoom, adultsOnTheDay, childrenOnTheDay, true);
									taxForAddons.incl = parseFloat(taxForAddons.incl) + parseFloat(taxOnCurrentAddon.INCL.NIGHT);
									taxForAddons.excl = parseFloat(taxForAddons.excl) + parseFloat(taxOnCurrentAddon.EXCL.NIGHT);
									updateStayTaxes(taxOnCurrentAddon.taxDescription);
								}
								addonsApplied.push({ // for Book keeping
									addonAmount: currentAddonAmount,
									isInclusive: addon.is_inclusive,
									postType: addon.post_type.value,
									amountType: addon.amount_type.value,
									taxBreakUp: taxOnCurrentAddon
								});
								if (!addon.is_inclusive && shouldPostAddon) {
									addonRate = parseFloat(addonRate) + parseFloat(currentAddonAmount);
								}
								if (!!addon.is_inclusive && shouldPostAddon) {
									inclusiveAddonsAmount = parseFloat(inclusiveAddonsAmount) + parseFloat(currentAddonAmount);
								}
							});
						}
						if ($(rooms[currentRoomId].rates).index(rate_id) < 0) {
							rooms[currentRoomId].rates.push(rate_id);
						}
						if (typeof rooms[currentRoomId].ratedetails[for_date] === 'undefined') {
							rooms[currentRoomId].ratedetails[for_date] = [];
						}
						var rateOnRoom = self.calculateRate(room_rate, adultsOnTheDay, childrenOnTheDay),
							rateOnRoomAddonAdjusted = parseFloat(rateOnRoom) - parseFloat(inclusiveAddonsAmount);

						if (rateOnRoomAddonAdjusted < 0) {
							rateOnRoomAddonAdjusted = 0.0;
						}
						currentRoom.ratedetails[for_date][rate_id] = {
							rate_id: rate_id,
							rate: rateOnRoom,
							rateAdjusted: rateOnRoomAddonAdjusted,
							inclusiveAddonsExist: !!inclusiveAddonsAmount && !addonRate, //Can we change the 0.00 amount to INCL where add on is inclusive
							taxes: taxes,
							addonAmount: addonRate,
							associatedAddons: addonsApplied,
							rateBreakUp: room_rate,
							day: new tzIndependentDate(for_date),
							availabilityCount: rooms[currentRoomId].availabilityNumbers[for_date],
							taxForAddons: taxForAddons

						};

						var currentRoomRateDetails = currentRoom.ratedetails[for_date][rate_id];

						//calculate tax for the current day
						if (taxes && taxes.length > 0) { // Need to calculate taxes IFF there are taxes associated with the rate
							var taxApplied = self.calculateTax(currentRoomRateDetails.rateAdjusted, taxes, activeRoom, adultsOnTheDay, childrenOnTheDay, false);
							currentRoomRateDetails.roomTax = {
								incl: parseFloat(taxApplied.INCL.NIGHT),
								excl: parseFloat(taxApplied.EXCL.NIGHT)
							};
							updateStayTaxes(taxApplied.taxDescription);
						} else {
							currentRoomRateDetails.roomTax = {
								incl: 0.0,
								excl: 0.0
							};
						}

						currentRoomRateDetails.tax = {
							incl: parseFloat(currentRoomRateDetails.roomTax.incl) + parseFloat(currentRoomRateDetails.taxForAddons.incl),
							excl: parseFloat(currentRoomRateDetails.roomTax.excl) + parseFloat(currentRoomRateDetails.taxForAddons.excl)
						}

						currentRoomRateDetails.total = parseFloat(currentRoomRateDetails.tax.excl) +
							parseFloat(currentRoomRateDetails.rate) +
							parseFloat(currentRoomRateDetails.addonAmount);

						if (for_date === arrival || for_date !== departure) {
							//TODO : compute total
							if (typeof currentRoom.total[rate_id] === 'undefined') {
								currentRoom.total[rate_id] = {
									total: 0,
									totalRate: 0,
									average: 0,
									percent: "0%"
								}
							}

							//total of all rates for ADR computation
							currentRoom.total[rate_id].totalRate = parseFloat(currentRoom.total[rate_id].totalRate) +
								parseFloat(currentRoomRateDetails.rate) +
								parseFloat(currentRoomRateDetails.addonAmount);

							//total of all rates including taxes.
							currentRoom.total[rate_id].total += currentRoomRateDetails.total;
							//compute the tax header for the table
							// -- CICO-17282 Tax header wont come right as we are having taxes for addons too
							// if (taxes && taxes.length > 0) {
							// 	rooms[d.room_type_id].total[rate_id].percent = getTaxPercent(taxes);
							// }
							var stayLength = numNights;
							// Handle single days for calculating rates
							if (stayLength === 0) {
								stayLength = 1;
							}
							rooms[currentRoomId].total[rate_id].average = parseFloat(currentRoom.total[rate_id].totalRate / stayLength);
						}

						if (for_date === departure) {
							var inclusiveStayTaxTotal = 0.0,
								exclusiveStayTaxTotal = 0.0;
							_.each(currentRoom.stayTaxes[rate_id].incl, function(inclusiveStayTax) {
								inclusiveStayTaxTotal = parseFloat(inclusiveStayTaxTotal) + parseFloat(inclusiveStayTax);
							});
							_.each(currentRoom.stayTaxes[rate_id].excl, function(exclusiveStayTax) {
								exclusiveStayTaxTotal = parseFloat(exclusiveStayTaxTotal) + parseFloat(exclusiveStayTax);
							});

							currentRoom.ratedetails[arrival][rate_id].tax.incl = parseFloat(currentRoom.ratedetails[arrival][rate_id].tax.incl) + parseFloat(inclusiveStayTaxTotal);
							currentRoom.ratedetails[arrival][rate_id].tax.excl = parseFloat(currentRoom.ratedetails[arrival][rate_id].tax.excl) + parseFloat(exclusiveStayTaxTotal);

							currentRoom.ratedetails[arrival][rate_id].total = parseFloat(currentRoom.ratedetails[arrival][rate_id].total) + parseFloat(exclusiveStayTaxTotal);
							currentRoom.total[rate_id].total = parseFloat(currentRoom.total[rate_id].total) + parseFloat(exclusiveStayTaxTotal);
						}

					})
				})
			});

			return {
				rooms: rooms,
				displayDates: displayDates
			};
		}

	}
]);