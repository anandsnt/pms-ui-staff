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

					var data = data;
					_.each(data.results, function(item) {
						if ( !item.notes ) {
							item.notes = [];
						};
						item.notes.push({
							name: 'Hello',
							date: '12/12/12',
							note: 'This is a dummy note added from the Angular service - rvReportsSrv.js:L43'
						}, {
							name: 'World',
							date: '10/10/12',
							note: 'This is a dummy note added from the Angular service - rvReportsSrv.js:L43'
						});
					});


					deferred.resolve(data);
				}.bind(this), function(data){
					deferred.reject(data);
				});

			return deferred.promise;
		};
	}
]);