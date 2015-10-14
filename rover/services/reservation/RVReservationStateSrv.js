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
		};

		self.bookMark = {
			lastPostedRate: null
		};


		/**
		 * Method to get the addons associated with a Rate
		 * @param  {[type]} rateId [description]
		 * @return {[type]}        [description]
		 */
		self.fetchAssociatedAddons = function(rateId) {
			var rateAddons = _.findWhere(self.metaData.rateAddons, {
				rate_id: rateId
			});
			if (rateAddons.associated_addons) {
				return rateAddons.associated_addons;
			} else {
				return null;
			}

		};

		self.getCustomRateModel = function(id, name, type) {
			var isAllotment = type && type === 'ALLOTMENT',
				rateIdentifier = isAllotment ? 'ALLOTMENT_CUSTOM_' + id : 'GROUP_CUSTOM_' + id, //Default to the GROUP
				rateName = isAllotment ? "Custom Rate for Allotment " + name : "Custom Rate for Group " + name,
				rateDescription = isAllotment ? "Custom Allotment Rate": "Custom Group Rate";
			return {
				id: rateIdentifier,
				name: rateName,
				description: rateDescription,
				account_id: null,
				is_rate_shown_on_guest_bill: false,
				is_suppress_rate_on: false,
				is_discount_allowed: true,
				rate_type: {
					id: null,
					name: isAllotment ? "Allotment Rate" : "Group Rate"
				},
				deposit_policy: {
					id: null,
					name: "",
					description: ""
				},
				cancellation_policy: {
					id: null,
					name: "",
					description: ""
				},
				market_segment: {
					id: null,
					name: ""
				},
				source: {
					id: null,
					name: ""
				},
				is_member: false,
				linked_promotion_ids: []
			}
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
			if (amountType === "PERSON") {
				return baseRate * parseInt(parseInt(numAdults, 10) + parseInt(numChildren, 10), 10);
			}
			if (amountType === "CHILD") {
				return baseRate * parseInt(numChildren, 10);
			}
			if (amountType === "ADULT") {
				return baseRate * parseInt(numAdults, 10);
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
		};

		self.calculateMultiplier = function(amountType, numAdults, numChildren) {
			var multiplier = 1; // for amount_type = flat
			if (amountType === "ADULT") {
				multiplier = numAdults;
			} else if (amountType === "CHILD") {
				multiplier = numChildren;
			} else if (amountType === "PERSON") {
				multiplier = parseInt(numChildren, 10) + parseInt(numAdults, 10);
			}
			return multiplier;
		};

		self.computeBaseAmount = function(taxableAmount, taxes, numAdults, numChildren) {
			var totalInclTaxPercent = 0.0,
				totalInclTaxAmount = 0.0;
			_.each(taxes, function(tax) {
				var isInclusive = tax.is_inclusive,
					taxData = _.findWhere(self.metaData.taxDetails, { // obtain the tax data from the metaData
						id: parseInt(tax.charge_code_id, 10)
					}),
					amountType = taxData.amount_type,
					multiplier = self.calculateMultiplier(amountType, numAdults, numChildren);
				if (isInclusive) {
					if (taxData.amount_symbol === '%') {
						totalInclTaxPercent += (multiplier * parseFloat(taxData.amount));
					} else {
						totalInclTaxAmount += (multiplier * parseFloat(taxData.amount));
					}
				}
			});
			return taxableAmount * 100 / (100 + totalInclTaxPercent) - totalInclTaxAmount;
		};

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
				taxesLookUp = {},
				baseAmount = self.computeBaseAmount(taxableAmount, taxes, numAdults, numChildren);

			_.each(taxes, function(tax) {
				//for every tax that is associated to the date proceed
				var isInclusive = tax.is_inclusive,
					taxData = _.findWhere(self.metaData.taxDetails, { // obtain the tax data from the metaData
						id: parseInt(tax.charge_code_id, 10)
					});

				if (!!taxData) {
					var taxValue = taxData.amount,
						amountType = taxData.amount_type,
						multiplier = self.calculateMultiplier(amountType, numAdults, numChildren),
						taxOn = baseAmount,
						taxCalculated = 0;

					if (taxData.amount_sign !== "+") {
						taxData.amount = parseFloat(taxData.amount * -1.0);
					}

					if (!!tax.calculation_rules.length) {
						_.each(tax.calculation_rules, function(tax) {
							taxOn += parseFloat(taxesLookUp[tax]);
						});
					}

					// THE TAX CALCULATION HAPPENS HERE
					if (taxData.amount_symbol === '%') { // The formula for inclusive tax computation is different from that for exclusive. Kindly NOTE.
						taxCalculated = parseFloat(multiplier * (parseFloat(taxValue / 100) * taxOn));
					} else {
						taxCalculated = parseFloat(multiplier * parseFloat(taxValue)); //In case the tax is not a percentage amount, its plain multiplication with the tax's amount_type
					}

					taxesLookUp[taxData.id] = parseFloat(taxCalculated);

					if (taxData.post_type === 'NIGHT') { // NIGHT tax computations
						if (isInclusive) {
							taxInclusiveTotal = parseFloat(taxInclusiveTotal) + parseFloat(taxCalculated);
						} else {
							taxExclusiveTotal = parseFloat(taxExclusiveTotal) + parseFloat(taxCalculated);
						}
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
				} else {}
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


		self.shouldPostAddon = function(frequency, present, arrival, departure, chargefullweeksonly) {
			if (frequency === 0 && present === arrival) {
				return true;
			}
			var dayIndex = parseInt((new tzIndependentDate(present) - new tzIndependentDate(arrival)) / (24 * 3600 * 1000), 10);
			var remainingDayIndex = parseInt((new tzIndependentDate(departure) - new tzIndependentDate(present)) / (24 * 3600 * 1000), 10);
			return (dayIndex % frequency === 0) && (remainingDayIndex >= frequency);
		};

		self.applyDiscount = function(amount, discount, numNights) {
			if (numNights === 0) {
				numNights = 1;
			}
			if (parseFloat(amount) <= 0.0) {
				return 0;
			}
			if (discount.type === 'amount') {
				return amount - discount.value / numNights; //perNight's discount to be deducted
			} // discount.type === 'percent'
			return amount - (amount * (discount.value / 100.0));
		};


		var processAssociatedAddonsForEachRoomRate = function(associatedAddons, stayDates, for_date, activeRoom, numNights, arrival, departure) {
			var addonsApplied = [],
				addonRate = 0.0,
				inclusiveAddonsAmount = 0.0,
				adultsOnTheDay = stayDates[for_date].guests.adults,
				childrenOnTheDay = stayDates[for_date].guests.children;


			return addonsApplied;
		};

		/**
		 * [populateRoomArrayForAgainstDate description]
		 * @param  {Array} roomTypes   [description]
		 * @param  {Array} roomDetails [description]
		 * @return {Array}
		 */
		var populateRoomArrayForAgainstDate = function(rooms, roomTypes, date, roomDetails) {
			var roomTypeId = null;

			_.each(roomTypes, function(roomType) {
				roomTypeId = roomType.id;
				if (rooms[roomTypeId] === undefined) {
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
					};
				}
				rooms[roomTypeId].availabilityNumbers[date] = {
					room: roomType.availability,
					group: roomType.group_availability,
					allotment: roomType.allotment_availability
				}
			});
		};

		var processRatesForNormalRatesAgainstDate = function(rooms, stayDates, roomRate, for_date, ratesMeta, additionalData, arrival, departure, activeRoom, numNights, membershipValidity) {
			var adultsOnTheDay = stayDates[for_date].guests.adults,
				childrenOnTheDay = stayDates[for_date].guests.children,
				houseAvailability = roomRate.house.availability,
				code = additionalData.code,
				selectedGroup = additionalData.group.id,
				rate_id = null,
				taxes = null,
				associatedAddons = null,
				addonRate = null,
				taxForAddons = null,
				addonsApplied = null,
				inclusiveAddonsAmount = null,
				currentRoomId = null,
				currentRoom = null,
				roomRatesToBeParsed = roomRate.rates,
				isCustomRate = false,
				selectedAllotment = additionalData.allotment.id;

			if ('custom_group_rate' in roomRate && !!selectedGroup) {
				roomRatesToBeParsed.push({
					room_rates: roomRate.custom_group_rate.room_rates,
					id: 'GROUP_CUSTOM_' + selectedGroup,
					isCustomRate: true
				});
			}

			// In case there is an allotment added, this key would have the custom rate (if applicable)
			if ('custom_allotment_rate' in roomRate && selectedAllotment) {
				roomRatesToBeParsed.push({
					room_rates: roomRate.custom_allotment_rate.room_rates,
					id: 'ALLOTMENT_CUSTOM_' + selectedAllotment,
					isCustomRate: true
				});
			}

			_.each(roomRatesToBeParsed, function(rate) {
				rate_id = rate.id;
				taxes = rate.taxes;
				isCustomRate = rate.isCustomRate;
				_.each(rate.room_rates, function(room_rate) {
					associatedAddons = isCustomRate ? [] : self.fetchAssociatedAddons(rate_id),
						addonRate = 0.0,
						taxForAddons = {
							incl: 0.0,
							excl: 0.0
						},
						addonsApplied = [],
						inclusiveAddonsAmount = 0.0,
						currentRoomId = room_rate.room_type_id,
						currentRoom = rooms[room_rate.room_type_id];

					if (currentRoom.stayTaxes[rate_id] === undefined) {
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
								if (currentStayStore[taxType][currentTaxId] === undefined) {
									currentStayStore[taxType][currentTaxId] = parseFloat(taxDetail.amount);
								} else {
									currentStayStore[taxType][currentTaxId] = _.max([currentStayStore[taxType][currentTaxId], parseFloat(taxDetail.amount)]);
								}
							}
						});
					};

					var linkedPromotions = isCustomRate ? [] : ratesMeta[rate_id].linked_promotion_ids,
						applyPromotion = false;
					applyPromotion = _.indexOf(linkedPromotions, code.id) > -1;

					if (associatedAddons.length > 0) {
						_.each(associatedAddons, function(addon) {
							var currentAddonAmount = parseFloat(self.getAddonAmount(addon.amount_type.value, parseFloat(addon.amount), adultsOnTheDay, childrenOnTheDay)),
								taxOnCurrentAddon = 0.0,
								shouldPostAddon = self.shouldPostAddon(addon.post_type.frequency, for_date, arrival, addon.charge_full_weeks_only);
							if (applyPromotion) {
								currentAddonAmount = parseFloat(self.applyDiscount(currentAddonAmount, code.discount, numNights));
							}
							if (shouldPostAddon) {
								taxOnCurrentAddon = self.calculateTax(currentAddonAmount, addon.taxes, activeRoom, adultsOnTheDay, childrenOnTheDay, true);
								taxForAddons.incl = parseFloat(taxForAddons.incl) + parseFloat(taxOnCurrentAddon.INCL.NIGHT);
								taxForAddons.excl = parseFloat(taxForAddons.excl) + parseFloat(taxOnCurrentAddon.EXCL.NIGHT);
								updateStayTaxes(taxOnCurrentAddon.taxDescription);
							}

							var inventoryForDay = _.findWhere(addon.inventory, {
								date: for_date
							});

							if (!inventoryForDay) {
								console.warn('Inventory details not returned for:' + for_date + 'for add on ' + addon.id);
							}

							if (!addon.is_inclusive && shouldPostAddon) {
								addonRate = parseFloat(addonRate) + parseFloat(currentAddonAmount);
							}
							if (!!addon.is_inclusive && shouldPostAddon) {
								inclusiveAddonsAmount = parseFloat(inclusiveAddonsAmount) + parseFloat(currentAddonAmount);
							}

							addonsApplied.push({ // for Book keeping
								name: addon.name,
								addonAmount: currentAddonAmount,
								isInclusive: addon.is_inclusive,
								postType: addon.post_type.value,
								amountType: addon.amount_type.value,
								taxBreakUp: taxOnCurrentAddon,
								id: addon.id,
								inventory: inventoryForDay && inventoryForDay.available_count || null
							});
						});
					}

					if (rooms[currentRoomId].rates.indexOf(rate_id) < 0) {
						rooms[currentRoomId].rates.push(rate_id);
					}

					if (rooms[currentRoomId].ratedetails[for_date] === undefined) {
						rooms[currentRoomId].ratedetails[for_date] = [];
					}

					var rateOnRoom = self.calculateRate(room_rate, adultsOnTheDay, childrenOnTheDay);
					if (applyPromotion) {
						rateOnRoom = parseFloat(self.applyDiscount(rateOnRoom, code.discount, numNights));
					}

					var rateOnRoomAddonAdjusted = parseFloat(rateOnRoom) - parseFloat(inclusiveAddonsAmount);

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
						availabilityCount: (function(){
							if(ratesMeta[rate_id].rate_type.name === "Group Rates" || !!selectedGroup){
							 	rooms[currentRoomId].availabilityNumbers[for_date].group;
							} else if(ratesMeta[rate_id].rate_type.name === "Group Rates" || !!selectedAllotment){
								rooms[currentRoomId].availabilityNumbers[for_date].allotment;
							}else{
								rooms[currentRoomId].availabilityNumbers[for_date].room;
							}
						})(),
						taxForAddons: taxForAddons,
						houseAvailability: houseAvailability,
						linkedPromos: linkedPromotions,
						applyPromotion: applyPromotion,
						appliedPromotion: code,
						isMember: ratesMeta[rate_id].is_member && membershipValidity,
						isGroupRate: ratesMeta[rate_id].rate_type.name === "Group Rates" || !!selectedGroup,
						isAllotmentRate: ratesMeta[rate_id].rate_type.name === "Allotment Rates" || !!selectedAllotment
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
					};

					currentRoomRateDetails.total = parseFloat(currentRoomRateDetails.tax.excl) +
						currentRoomRateDetails.rate +
						currentRoomRateDetails.addonAmount;


					if (for_date === arrival || for_date !== departure) {
						//TODO : compute total
						if (currentRoom.total[rate_id] === undefined) {
							currentRoom.total[rate_id] = {
								total: 0,
								totalRate: 0,
								average: 0,
								percent: "0%"
							};
						}

						//total of all rates for ADR computation
						currentRoom.total[rate_id].totalRate = parseFloat(currentRoom.total[rate_id].totalRate) +
							currentRoomRateDetails.rate +
							currentRoomRateDetails.addonAmount;

						//total of all rates including taxes.
						currentRoom.total[rate_id].total += currentRoomRateDetails.total;
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

				});
			});
		};

		/**
		 * method to initially parse availability response
		 * @param  {[type]} roomRates [description]
		 * @param  {[type]} arrival   [description]
		 * @param  {[type]} departure [description]
		 * @return {[type]}           [description]
		 */
		self.parseRoomRates = function(roomRates, arrival, departure, stayDates, activeRoom, numNights, additionalData, membershipValidity) {
			var rooms = {},
				displayDates = [],
				ratesMeta = [],
				roomDetails = [],
				for_date = null;

			$(roomRates.room_types).each(function(i, d) {
				roomDetails[d.id] = d;
			});

			_.each(roomRates.rates, function(rate) {
				ratesMeta[rate.id] = rate;
			});

			if (!!additionalData.group.id) {
				var customRate = self.getCustomRateModel(additionalData.group.id, additionalData.group.name, 'GROUP');
				ratesMeta[customRate.id] = customRate;
			};

			if (!!additionalData.allotment.id) {
				var customRate = self.getCustomRateModel(additionalData.allotment.id, additionalData.allotment.name, 'ALLOTMENT');
				ratesMeta[customRate.id] = customRate;
			};

			// Parse through all room-rate combinations.
			_.each(roomRates.results, function(roomRate) {
				/*  --Initializing the displayData.dates array for the rows in the day wise rate table
				 *	Need NOT show the departure day in the table. [It is NOT included in any of the computations]
				 *	Hence check if the day is a departure day before adding it to the array
				 *	Have added a check to handle zero nights > Need to check with product team if zero nights is an accepted scenario.
				 *	If so, will have to change computation in other places as well to handle zero nights.
				 */
				for_date = roomRate.date;

				if (roomRate.date === arrival || roomRate.date !== departure) {
					displayDates.push({
						str: for_date,
						obj: new tzIndependentDate(for_date)
					});
				}

				//step1: Initial population of the rooms array
				populateRoomArrayForAgainstDate(rooms, roomRate.room_types, for_date, roomDetails);

				//step2: Parse the rates and populate the object created for rooms in step1
				processRatesForNormalRatesAgainstDate(rooms, stayDates, roomRate, for_date, ratesMeta, additionalData, arrival, departure, activeRoom, numNights, membershipValidity);
			});

			return {
				rooms: rooms,
				displayDates: displayDates
			};
		};
	}
]);