angular.module('admin').service('ADInterfaceMonitorSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function ($http, $q, ADBaseWebSrvV2) {
        var service = this;

        service.fetch = function () {
            return ADBaseWebSrvV2.getJSON('/admin/hotel_ext_interfaces');
        };

        service.fetchLlpts = function () {
            return ADBaseWebSrvV2.getJSON('/admin/hotel_ext_interfaces/llpts_installed_interfaces');
        };

        service.saveLlpts = function (comtrolInterfaces) {
            return ADBaseWebSrvV2.postJSON('/admin/hotel_ext_interfaces/llpts_installed_interfaces', {
                'comtrol_llpts_installed_interfaces': comtrolInterfaces
            });
        };

    }
]);
