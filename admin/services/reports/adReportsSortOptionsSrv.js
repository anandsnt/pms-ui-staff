admin.service('adReportsSortOptionsSrv', ['$q', 'ADBaseWebSrvV2',
	function($q, ADBaseWebSrvV2) {
		var self = this;

		// ------------------------------------------------------------------------------------------------------------- A. MAPPING
		var __sortOptions = {
			"hotel_name": {
				associatedReports: ["CLIENT_USAGE"],
				desc: "Hotel Name"
			},
			"hotel_chain": {
				associatedReports: ["CLIENT_USAGE"],
				desc: "Hotel Chain"
			},
			"total_check_ins": {
				associatedReports: ["CLIENT_USAGE"],
				desc: "Total Check-ins"
			},
			"total_check_outs": {
				associatedReports: ["CLIENT_USAGE"],
				desc: "Total Check-outs"
			},
			"total_queued": {
				associatedReports: ["CLIENT_USAGE"],
				desc: "Total Queued"
			}
		};

		// ------------------------------------------------------------------------------------------------------------- B. EXPOSED METHODS

		self.getSortOptions = function(ReportKey) {
			var deferred = $q.defer();
			var associatedOptions = _.filter(_.keys(__sortOptions), function(key) {
					return _.indexOf(__sortOptions[key].associatedReports, ReportKey) > -1
				}),
				response = [];

			_.each(associatedOptions, function(sortOption) {
				response.push({
					value: sortOption,
					description: __sortOptions[sortOption].desc
				});
			})

			deferred.resolve(response);
			return deferred.promise;

		}
	}
]);