/**
 * This service is used to make proxied calls to IFC through PMS
 */
admin.service('adIFCSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {
        /**
         * Make a create CRUD proxy call to IFC integration
         * @param {String} integration - Name of integration
         * @param {String} namespace - Remote call namespace
         * @param {Object} data - Data sent to service
         * @return {deferred.promise|{then, catch, finally}}
         */
        this.create = function(integration, namespace, data) {
            return ADBaseWebSrvV2.postJSON('ifc/' + integration + '/' + namespace, data);
        };

        /**
         * Make a delete CRUD proxy call to IFC integration
         * @param {String} integration - Name of integration
         * @param {String} namespace - Remote call namespace
         * @param {String} id - Identifier of remote object
         * @param {Object} data - Data sent to service
         * @return {deferred.promise|{then, catch, finally}}
         */
        this.delete = function(integration, namespace, id, data) {
            return ADBaseWebSrvV2.deleteJSON('ifc/' + integration + '/' + namespace + '/' + id, data);
        };

        /**
         * Make a GET proxy call to IFC
         * @param {String} namespace - remote call namespace
         * @param {String} method - remote call method
         * @param {Object} params - Data sent to service
         * @return {deferred.promise|{then, catch, finally}}
         */
        this.get = function(namespace, method, params) {
            return ADBaseWebSrvV2.getJSON('ifc/proxy/' + namespace + '/' + method, params);
        };

        /**
         * Make an index CRUD proxy call to IFC integration
         * @param {String} integration - name of integration
         * @param {String} namespace - remote call namespace
         * @param {Object} params - Data sent to service
         * @return {deferred.promise|{then, catch, finally}}
         */
        this.index = function(integration, namespace, params) {
            return ADBaseWebSrvV2.getJSON('ifc/' + integration + '/' + namespace, params);
        };

        /**
         * Make a POST proxy call to IFC
         * @param {String} namespace - remote call namespace
         * @param {String} method - remote call method
         * @param {Object} data - Data sent to service
         * @return {deferred.promise|{then, catch, finally}}
         */
        this.post = function(namespace, method, data) {
            return ADBaseWebSrvV2.postJSON('ifc/proxy/' + namespace + '/' + method, data);
        };

        /**
         * Make a PUT proxy call to IFC
         * @param {String} namespace - remote call namespace
         * @param {String} method - remote call method
         * @param {Object} data - Data sent to service
         * @return {deferred.promise|{then, catch, finally}}
         */
        this.put = function(namespace, method, data) {
            return ADBaseWebSrvV2.putJSON('ifc/proxy/' + namespace + '/' + method, data);
        };

        /**
         * Make a show CRUD proxy call to IFC integration
         * @param {String} integration - Name of integration
         * @param {String} namespace - Remote call namespace
         * @param {String} id - Identifier of remote object
         * @param {Object} params - Data sent to service
         * @return {deferred.promise|{then, catch, finally}}
         */
        this.show = function(integration, namespace, id, params) {
            return ADBaseWebSrvV2.getJSON('ifc/' + integration + '/' + namespace + '/' + id, params);
        };

        /**
         * Make an update CRUD proxy call to IFC integration
         * @param {String} integration - Name of integration
         * @param {String} namespace - Remote call namespace
         * @param {String} id - Identifier of remote object
         * @param {Object} data - Data sent to service
         * @return {deferred.promise|{then, catch, finally}}
         */
        this.update = function(integration, namespace, id, data) {
            return ADBaseWebSrvV2.putJSON('ifc/' + integration + '/' + namespace + '/' + id, data);
        };
    }
]);
