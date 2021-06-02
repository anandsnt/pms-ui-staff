angular.module('sntRover').service('RVGAHelperSrv', ['$window', '$log', function($window, $log) {
	var actionMapping = {
		'LOAD_RESERVATION': {
			id: '',
			confNum: '',
			startTime: ''
		},
		'CHECKIN': {
			id: '',
			confNum: '',
			startTime: ''
		},
		'CHECKOUT': {
			id: '',
			confNum: '',
			startTime: ''
		}
	};
	var resetEventType = function(eventType) {
		actionMapping[eventType] = {
			id: '',
			confNum: '',
			startTime: ''
		};
	};

	this.startEventTiming = function(eventType, id, confNum) {
		actionMapping[eventType] = {
			id: id,
			confNum: confNum,
			startTime: new Date().getTime()
		};
	};

	this.sendEventToGA = function(eventType, id) {
		if ((actionMapping[eventType].id === id || actionMapping[eventType].confNum === id) && actionMapping[eventType].startTime) {
			var eventAttributes = {
				name: eventType.replace("_", " ").toLowerCase(),
				time: ((new Date().getTime() - actionMapping[eventType].startTime) / 1000).toFixed(2),
				entity: '#' + actionMapping[eventType].confNum
			};

			resetEventType(eventType);
			$log.info('GTM::-> ' + eventAttributes.name + ' ::-> ' + eventAttributes.entity + ' ::-> ' + eventAttributes.time);
			if ($window['dataLayer']) {
				$window['dataLayer'].push({
					event: 'trackActionTime',
					attributes: eventAttributes
				});
			}
		}
	};
}]);