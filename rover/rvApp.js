

var sntRover = angular.module('sntRover',['ui.router', 'ui.utils','pickadate', 'ng-iscroll', 'highcharts-ng', 'ngAnimate','ngDialog', 'ngSanitize', 'pascalprecht.translate','advanced-pickadate','ui.date','ui.calendar', 'dashboardModule', 'companyCardModule', 'stayCardModule', 'reservationModule', 'housekeepingModule']);

sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	//BaseCtrl.call(this, $scope);
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;

	/**
	*	if this is true animation will be revesed, no more checks
	* 	keep track of the previous state and params
	* 
	*	@private
	*/
	var $_mustRevAnim = false,
		$_prevStateName = null,
		$_prevStateParam = null;

	/**
	*	revAnimList is an array of objects that holds
	*	state name sets that when transitioning
	*	the transition animation should be reversed 
	*	
	*	@private
	*/
	var $_revAnimList = [{
		fromState: 'rover.housekeeping.roomDetails',
		toState  : 'rover.housekeeping.roomStatus'
	}, {
		fromState: 'rover.staycard.reservationcard.reservationdetails',
		toState  : 'rover.search'
	}, {
		fromState: 'rover.staycard.billcard',
		toState  : 'rover.staycard.reservationcard.reservationdetails'
	}, {
		fromState: 'rover.staycard.nights',
		toState  : 'rover.staycard.reservationcard.reservationdetails'
	}, {
		fromState: 'rover.companycarddetails',
		toState  : 'rover.companycardsearch'
	}];


	/**
	*	A method on the $rootScope to determine if the
	*	slide animation during stateChange should run in reverse or forward
	*	Note: this is overridden when state change is via pressing back button action
	*
	*	@private
	*	@param {string} fromState - name of the fromState
	*	@param {string} toState - name of the toState
	*
	*	@return {boolean} - to indicate reverse or not
	*/
	var $_shouldRevDir = function(fromState, toState) {
		for (var i = 0, j = $_revAnimList.length; i < j; i++) {
			if ( $_revAnimList[i].fromState === fromState && $_revAnimList[i].toState === toState ) {
				return true;
				break;
			};
		};

		return false;
	};


	/**
	*	A very simple methods to go back to the previous state
	*	
	*	By default it will use the (saved) just previous state - '$_prevStateName', '$_prevStateParam'
	*	and always do the slide animation in reverse, unless overridden by callee.
	*
	*	Default behaviour can be overridden in two ways, by setting values to '$rootScope.setPrevState' in ctrl`:
	*	1. Pass in a callback with its scope - This callback will be responsible for the state change (total control)
	*	2. Pass in the state name and param - This will load the passed in state with its param
	* 
	* 	@param {Object} $rootScope.setPrevState - Uses this object as param which is set by the current state contoller
	*/
	$rootScope.loadPrevState = function() {

		// since these folks will be created anyway
		// so what the hell, put them here
		var options = $rootScope.setPrevState,
			name    = options.stateName || $_prevStateName,
			param   = options.stateName ? options.stateParam || $_prevStateParam : $_prevStateParam,
			reverse = typeof options.reverse === 'boolean' ? true : false;

		// if currently disabled, return
		if ( options.disable ) {
			return;
		};

		// ok boys we are gonna sit this one out
		// 'scope.callback' is will be running the show
		if ( !!options.scope ) {
			$_mustRevAnim = reverse ? options.reverse : true;
			options.scope[options.callback]();
			return;
		};

		// check necessary as we can have a case where both can be null
		if ( !!options.stateName || !!$_prevStateName ) {
			$_mustRevAnim = reverse ? options.reverse : true;
			$state.go( name, param );
		};
	};

	var $_thatStateData = [];

	$rootScope.setStateData = function(data) {
		var index = null;

		if ( !data && !data.id ) {
			return;
		};

		for (var i = 0, j = $_thatStateData.length; i < j; i++) {
			if ( data.id === $_thatStateData[i].id ) {
				index = i;
				break;
			};
		};

		if ( index ) {
			$_thatStateData[index] = data;
		} else {
			$_thatStateData.push( data );
		}
	};

	$rootScope.getStateData = function(ctrlName) {
		if ( !ctrlName ) {
			return false;
		};

		for (var i = 0, j = $_thatStateData.length; i < j; i++) {
			if ( ctrlName === $_thatStateData[i].id ) {
				return $_thatStateData[i];
				break;
			};
		};

		return false;
	};

	$rootScope.returnBack = false;
	$rootScope.isReturning = function() {
		return $rootScope.returnBack;
	};


	/**
	*	For certain state transitions
	*	the transition animation must be reversed
	*
	*	This is achived by adding class 'return-back'
	*	to the imediate parent of 'ui-view'
	*	check this template to see how this class is applied:
	*	app/assets/rover/partials/staycard/rvStaycard.html
	*/
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		// spiting state names so as to add them to '$_revAnimList', if needed
		console.log(fromState.name + ' ===> ' + toState.name);

		// this must be reset with every state change
		// invidual controllers can then set it  
		// with its own desired values
		$rootScope.setPrevState = {};

		// choose slide animation direction
		if ( $_mustRevAnim || $_shouldRevDir(fromState.name, toState.name) ) {
			$_mustRevAnim = false;
			$rootScope.returnBack = true;
		} else {
			$rootScope.returnBack = false;
		}

		// saving the prevState name and params
		$_prevStateName  = fromState.name;
		$_prevStateParam = fromParams;
	});
}]);

