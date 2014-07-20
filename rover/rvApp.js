

var sntRover = angular.module('sntRover',['ui.router', 'ui.utils','pickadate', 'ng-iscroll', 'highcharts-ng', 'ngAnimate','ngDialog', 'ngSanitize', 'pascalprecht.translate','advanced-pickadate','ui.date','ui.calendar', 'dashboardModule', 'companyCardModule', 'stayCardModule', 'reservationModule', 'housekeepingModule']);

sntRover.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	//BaseCtrl.call(this, $scope);
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;


	// a simple flag to set the 
	// slide animation in reverse mode
	var $_mustRevAnim = false;


	// keep track of the previous state and its params
	// saving the prevState name and params
	var $_prevStateName = null,
		$_prevStateParam = null; 


	/**
	*	revAnimList is an array that holds
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
	*	Note: if yeah we will fill this out later
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
	*	and always slide-in states in reverse animation, unless overridden.
	*
	*	Default behaviour can be overridden in two ways:
	*	1. Pass in a callback with its scope - This callback will be responsible for the state change (total control)
	*	2. Pass in the state name and param - This will load the passed in state with its param
	*/
	$rootScope.loadPrevState = function() {

		// since these folks will be created anyway
		// so what the hell, put them here
		var options = $rootScope.setPrevState,
			name    = options.stateName || $_prevStateName,
			param   = options.stateName ? options.stateParam || $_prevStateParam : $_prevStateParam,
			reverse = typeof options.reverse === 'boolean' ? true : false;

		// ok boys we are gonna sit this one out
		// 'scope.callback' is on the floor
		if ( !!options.scope ) {
			$_mustRevAnim = reverse ? options.reverse : true;
			options.scope[options.callback]();
			return;
		};

		// necessary for a case where there isn't
		// a passed in stateName or prevStateName
		if ( !!options.stateName || !!$_prevStateName ) {
			$_mustRevAnim = reverse ? options.reverse : true;
			$state.go( name, param );
		};
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
		// invidual controllers can then set with 
		// its own desired values
		$rootScope.setPrevState = {};

		// choose slide animation direction
		if ( $_mustRevAnim || $_shouldRevDir(fromState.name, toState.name) ) {
			$_mustRevAnim = false;
			$rootScope.returnBack = true;
		} else {
			$rootScope.returnBack = false;
		}

		// saving the prevState name and params
		// for quick 'loadPrevState' method
		$_prevStateName  = fromState.name;
		$_prevStateParam = fromParams;
	});
}]);

