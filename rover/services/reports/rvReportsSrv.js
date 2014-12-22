sntRover.service('RVreportsSrv', [
	'$q',
	'rvBaseWebSrvV2',
	function($q, rvBaseWebSrvV2) {
		var choosenReport = {};

		this.setChoosenReport = function(item) {
			choosenReport = item;
		};

		this.getChoosenReport = function() {
			return choosenReport;
		};

		this.cacheReportList = {};

		this.fetchReportList = function(backToList) {
			var deferred = $q.defer(),
				url = '/api/reports';

			if ( backToList ) {
				deferred.resolve( this.cacheReportList );
			} else {
				rvBaseWebSrvV2.getJSON(url)
					.then(function(data) {
						this.cacheReportList = data;
						deferred.resolve(this.cacheReportList);
					}.bind(this), function(data){
						deferred.reject(data);
					});
			}

			return deferred.promise;
		};

		this.fetchReportDetails = function(params) {
			var deferred = $q.defer(),
				url = '/api/reports/' + params.id + '/submit',
				params = _.omit(params, 'id');

			rvBaseWebSrvV2.getJSON(url, params)
				.then(function(data) {

					// for TESTING ONLY
					var data = data;
					var note1 = {
									date: '12-12-2014',
									name: 'Alex',
									note: 'This is a dummy note added from the UI > service -> rvReportsSrv.js'
								};
					var note2 = {
									date: '12-10-2014',
									name: 'Jon',
									note: 'This is a dummy note added from the UI > service -> rvReportsSrv.js'
								};
					angular.forEach(data.results, function(item) {
						item.notes.push(note1);
						item.notes.push(note2);
					});


					deferred.resolve(data);
				}.bind(this), function(data){
					deferred.reject(data);
				});

			return deferred.promise;
		};
	}
]);