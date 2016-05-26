angular.module('sntRover').service('RVReservationStateService', [
	function() {
		var self = this;
		self.metaData = {
			rateAddons: [],
			taxDetails: []
		};

		self.reservationFlags = {
			outsideStaydatesForGroup: false,
			borrowForGroups: false,
			RATE_CHANGED: false,
			RATE_CHANGE_FAILED: false
		};

		self.bookMark = {
			lastPostedRate: null
		};


		/**
		 * Method to get the addons associated with a Rate
		 * @param  {Array or a String} rateId [description]
		 * @return {[type]}        [description]
		 */
		self.fetchAssociatedAddons = function(rateId) {
			// In case of multiple rates, rateId might come in as an array
			// In such a case, take the rate for the first night
			if (_.isArray(rateId)) {
				rateId = rateId[0]
			}
			var rateAddons = _.findWhere(self.metaData.rateAddons, {
				rate_id: rateId
			});
			if (rateAddons && rateAddons.associated_addons) {
				return rateAddons.associated_addons;
			} else {
				return null;
			}

		};


		self.updateRateAddonsMeta = function(addonInfo) {
			if(addonInfo.length === 0){
				return false;
			}
			var rateAddons = _.findWhere(self.metaData.rateAddons, {
				rate_id: addonInfo[0].rateId
			});
			
			if(rateAddons){
				rateAddons[0] = addonInfo[0];
			}else{
				self.metaData.rateAddons.push(addonInfo[0]);
			}
		};

		self.getCustomRateModel = function(id, name, type) {
			var isAllotment = type && type === 'ALLOTMENT',
				rateIdentifier = isAllotment ? 'ALLOTMENT_CUSTOM_' + id : 'GROUP_CUSTOM_' + id, //Default to the GROUP
				rateName = isAllotment ? "Custom Rate for Allotment " + name : "Custom Rate for Group " + name,
				rateDescription = isAllotment ? "Custom Allotment Rate" : "Custom Group Rate";
			return {
				id: rateIdentifier,
				name: rateName,
				description: rateDescription,
				account_id: null,
				is_rate_shown_on_guest_bill: false,
				is_suppress_rate_on: false,
				is_discount_allowed_on: true,
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

		self.getApplicableAddonsCount = function(amountType, postType, postingRythm, numAdults, numChildren, numNights, chargeFullWeeksOnly) {
			var getTotalPostedAddons = function(postType, baseCount) {
				if (postingRythm === 0) {
					return baseCount;
				} else if (postingRythm === 1) {
                    return baseCount * numNights;
                } else {
					if(typeof chargeFullWeeksOnly !== "undefined" && !!chargeFullWeeksOnly) {
						return baseCount * parseInt((numNights / postingRythm), 10);
					} else {
						return baseCount * (parseInt((numNights / postingRythm), 10) + 1);
					}

				}
			};

			if (amountType === 'PERSON') {
				return getTotalPostedAddons(postType, numAdults + numChildren);
			} else if (amountType === 'ADULT') {
				return getTotalPostedAddons(postType, numAdults);
			} else if (amountType === 'CHILD') {
				return getTotalPostedAddons(postType, numChildren);
			} else if (amountType === 'FLAT') {
				return getTotalPostedAddons(postType, 1);
			};
		}

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


		self.shouldPostAddon = function(frequency, present, arrival, departure, chargeFullLengthOnly) {
			if (frequency === 0 && present === arrival) {
				return true;
			}
			var msPerDay = 24 * 3600 * 1000,
				dayIndex = parseInt((new tzIndependentDate(present) - new tzIndependentDate(arrival)) / msPerDay, 10),
				remainingDays = parseInt((new tzIndependentDate(departure) - new tzIndependentDate(present)) / msPerDay, 0);

			return (dayIndex % frequency === 0) && (!chargeFullLengthOnly || (chargeFullLengthOnly && (remainingDays >= frequency)));
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
					group: roomType.group_availability
				}
			});
		};

		self.getAddonAmounts = function(rateAddons, arrival, departure, stayDates) {
			var addonRates = {};
			_.each(stayDates, function(dayInfo, date) {
				var numAdults = dayInfo.guests.adults,
					numChildren = dayInfo.guests.children,
					currentDate = date;

				addonRates[currentDate] = {};

				_.each(rateAddons, function(rateInfo) {
					var rateId = rateInfo.rate_id;
					_.each(rateInfo.associated_addons, function(addon) {
						var currentAddonAmount = parseFloat(self.getAddonAmount(addon.amount_type.value, parseFloat(addon.amount), numAdults, numChildren)),
							shouldPostAddon = self.shouldPostAddon(addon.post_type.frequency, currentDate, arrival, departure, addon.charge_full_weeks_only);
						if (!addon.is_inclusive && shouldPostAddon) {
							if (addonRates[currentDate][rateId] === undefined) {
								addonRates[currentDate][rateId] = currentAddonAmount;
							} else {
								addonRates[currentDate][rateId] = parseFloat(addonRates[currentDate][rateId]) + currentAddonAmount;
							}
						}
					});
				});
			});
			return addonRates;
		};

		this.getAddonAndTaxDetails = function(date, rateId, numAdults, numChildren, arrival, departure, activeRoom, taxes, amount) {
			var associatedAddons = self.fetchAssociatedAddons(rateId),
				addonRate = 0.0,
				addonTax = {
					incl: 0.0,
					excl: 0.0
				},
				inclusiveAddonsAmount = 0.0,
				stayTaxes = {
					incl: {},
					excl: {}
				},
				rateTax = {
					incl: 0.0,
					excl: 0.0
				},
				totalTax = {
					incl: 0.0,
					excl: 0.0
				},
				stayTax = {
					incl: {},
					excl: {}
				};

			var updateStayTaxes = function(taxDetails) {
				_.each(taxDetails, function(taxDetail) {
					if (taxDetail.postType === 'STAY') {
						var taxType = taxDetail.isInclusive ? "incl" : "excl",
							currentTaxId = taxDetail.id;
						if (stayTax[taxType][currentTaxId] === undefined) {
							stayTax[taxType][currentTaxId] = parseFloat(taxDetail.amount);
						} else {
							stayTax[taxType][currentTaxId] = _.max([stayTax[taxType][currentTaxId], parseFloat(taxDetail.amount)]);
						}
					}
				});
			};


			//ADDON

			if (associatedAddons && associatedAddons.length > 0) {
				_.each(associatedAddons, function(addon) {
					var currentAddonAmount = parseFloat(self.getAddonAmount(addon.amount_type.value, parseFloat(addon.amount), numAdults, numChildren)),
						taxOnCurrentAddon = 0.0,
						shouldPostAddon = self.shouldPostAddon(addon.post_type.frequency, date, arrival, departure, addon.charge_full_weeks_only);

					if (shouldPostAddon) {
						taxOnCurrentAddon = self.calculateTax(currentAddonAmount, addon.taxes, activeRoom, numAdults, numChildren, true);
						addonTax.incl = parseFloat(addonTax.incl) + parseFloat(taxOnCurrentAddon.INCL.NIGHT);
						addonTax.excl = parseFloat(addonTax.excl) + parseFloat(taxOnCurrentAddon.EXCL.NIGHT);
						updateStayTaxes(taxOnCurrentAddon.taxDescription);
					}

					var inventoryForDay = _.findWhere(addon.inventory, {
						date: date
					});

					if (!inventoryForDay) {
						console.warn('Inventory details not returned for:' + date + 'for add on ' + addon.id);
					}

					if (!addon.is_inclusive && shouldPostAddon) {
						addonRate = parseFloat(addonRate) + parseFloat(currentAddonAmount);
					}
					if (!!addon.is_inclusive && shouldPostAddon) {
						inclusiveAddonsAmount = parseFloat(inclusiveAddonsAmount) + parseFloat(currentAddonAmount);
					}
				});
			}

			// TAXES

			var rateOnRoomAddonAdjusted = parseFloat(amount) - parseFloat(inclusiveAddonsAmount);

			if (rateOnRoomAddonAdjusted < 0) {
				rateOnRoomAddonAdjusted = 0.0;
			}


			//calculate tax for the current day
			if (taxes && taxes.length > 0) { // Need to calculate taxes IFF there are taxes associated with the rate
				var taxApplied = self.calculateTax(rateOnRoomAddonAdjusted, taxes, activeRoom, numAdults, numChildren, false);
				rateTax = {
					incl: parseFloat(taxApplied.INCL.NIGHT),
					excl: parseFloat(taxApplied.EXCL.NIGHT)
				};
				updateStayTaxes(taxApplied.taxDescription);
			};

			totalTax = {
				incl: parseFloat(rateTax.incl) + parseFloat(addonTax.incl),
				excl: parseFloat(rateTax.excl) + parseFloat(addonTax.excl)
			};

			return {
				addon: addonRate,
				inclusiveAddonsExist: !!inclusiveAddonsAmount && !addonRate,
				tax: {
					incl: totalTax.incl,
					excl: totalTax.excl
				},
				stayTax: stayTax
			}

		};

	}
]);