angular.module('cacheVaultModule', [])
	.factory('$vault', ['$cacheFactory', '$timeout', function($cacheFactory, $timeout) {
		var factory = {},
			$_store = $cacheFactory( 'cache-vault' );

		// will only accept numbers and strings
		factory.set = function(key, value) {
			if ( 'number' === typeof value || 'string' === typeof value ) {
				$_store.put( key, value );
			} else {
				console.warn( 'Not allowed to save ' + typeof value + ' type into cacheVault!' );
			}
		};

		factory.setUpto = function(key, value, min) {
			var min = min || 3;
			$_store.put( key, value );
			$timeout(function() {
				$_store.remove(key);
			}, 1000 * 60 * min);
		};

		factory.get = function(key) {
			return  !!$_store.get( key ) ? $_store.get( key ) : "";
		};

		factory.remove = function(key) {
			$_store.remove( key );
		};

		return factory;
	}]);