sntRover.controller('RateMgrOccupancyGraphCtrl', ['$q', '$scope', 'RateMgrOccupancyGraphSrv', 'ngDialog',
    function ($q, $scope, RateMgrOccupancyGraphSrv, ngDialog) {

        BaseCtrl.call(this, $scope);
        $scope.highchartsNG = {};
        $scope.targetData = "";
        var drawGraph = function(){
            $scope.highchartsNG = {
                options: {
                    chart: {
                        type: 'line',
                        className: "rateMgrOccGraph",
                        plotBackgroundColor: '#e0e0e0'
                    },
                    /*legend: {
                        rtl: true,
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'top',
                        borderWidth: 0
                    },*/
                    tooltip: {
                        formatter: function () {
                            return 'Actual <b>' + this.point[1].y + '</b>' + '<br/>Off Target <b>' + this.point[0].y + '</b>';
                        }
                    },
                    tooltip: {
                        shared: true,
                        formatter: function() {
                            return 'Actual <b>' + this.points[0].y + '</b>' + '<br/>Off Target <b>' + this.points[1].y + '</b>';
                        }

                    },
                    xAxis: {
                        gridLineWidth: 10,
                        gridLineColor: '#f0f0f0',
                        opposite: true,
                        tickPosition: 'inside',
                        type: 'datetime',
                        minTickInterval: 24 * 3600 * 1000,
                        dateTimeLabelFormats:{
                            day: '%A <br/> %B %d'
                        }
                    },
                    title:{
                        text:''
                    }
                    /*plotOptions: {
                        series: {
                            showCheckbox: true,
                            selected: true
                        }
                    },*/
                },
                series: $scope.graphData
            }
        }
        

    var manipulateGraphData = function(data){
        var graphData = [];
        var actualData = [];
        var targetData = [];
        angular.forEach(data.results, function(item){
            itemDate = Date.parse(item.date);
            actualData.push([itemDate, 10]); // TODO :: replace harcoded 10 with item.actual
            targetData.push([itemDate, item.target]);
        });
        graphData = [{
            "name": "Actual",
            "data": actualData,
            "color": "blue"
        },{
            "name": "Target",
            "data": targetData,
            "color": "black"
        }]
        return graphData
    }

    var manipulateTargetData = function(data){
        var targetData = [];
        var targetItem = {};
        angular.forEach(data.results, function(item){
            itemDate = Date.parse(item.date);
            target_value = item.target == null ? 0 : item.target
            targetItem = {"date": itemDate, "value": target_value, "is_editable": true};
            targetData.push(targetItem);
        });
        targetData = appendRemainingWeekDays(targetData);
        var formattedTargetData = [];
        var targetWeeklyItem = [];
        for(var i = 0; i <= targetData.length; i++){
            item = targetData[i];
            if(i%7 == 0 && i != 0){
                formattedTargetData.push(targetWeeklyItem);
                targetWeeklyItem = [];
                targetWeeklyItem.push(item);
            }
            else{
                targetWeeklyItem.push(item);
            }
        }
        return formattedTargetData;
    }

    var appendRemainingWeekDays = function(targetData){
        from_date = new Date(targetData[0].date);
        to_date = new Date(targetData[targetData.length - 1].date);
        var remainingStartWeekDays = [];
        var remainingEndWeekDays = [];

        // append missing week days before from date
        if (from_date.getDay() != 0){
            limit = from_date.getDay();
            for(var i = limit; i > 0; i--){
                var itemDate = new Date();
                itemDate.setDate(from_date.getDate() - i);
                remainingStartWeekDays.push({"date": Date.parse(itemDate), "value": 0, "is_editable": false})
            }  
        }
        
        // append missing week days after to date
        if (to_date.getDay() != 6){
            limit = 6 - to_date.getDay();
            for(var j = 1; j <= limit; j++){
                var itemDate = new Date();
                itemDate.setDate(to_date.getDate() + j);
                remainingEndWeekDays.push({"date": Date.parse(itemDate), "value": 0, "is_editable": false})
            }
            
        }
        targetData = remainingStartWeekDays.concat(targetData, remainingEndWeekDays);
        return targetData;
    }

    $scope.showSetTargetDialog = function () {
        ngDialog.open({
            template: '/assets/partials/rateManager/setTargetPopover.html',
            className: 'ngdialog-theme-default',
            closeByDocument: true,
            scope: $scope
        });
    };

    $scope.setTargets = function(){
        var params = {};
        var dates = [];
        var weekDate = "";
        var formatted_date = "";
        angular.forEach($scope.targetData, function(week){
            angular.forEach(week, function(weekDays){
                weekDate = new Date(weekDays.date)
                formatted_date = weekDate.getFullYear() + '-' + (weekDate.getMonth() + 1) + '-' + weekDate.getDate() 
                dates.push({"date": formatted_date, "target": weekDays.value});
            });
        });
        params = { "dates" : dates }
        var setTargetsSuccess = function(data) {
            ngDialog.close();
            fetchGraphData();
            $scope.$emit('hideLoader');
        };
        $scope.invokeApi(RateMgrOccupancyGraphSrv.setTargets, params, setTargetsSuccess);
    }

    var fetchGraphData = function(params){
        var fetchGraphDataSuccess = function(data) {
            $scope.graphData = manipulateGraphData(data);
            drawGraph();
            $scope.targetData = manipulateTargetData(data);
            $scope.$emit('hideLoader');
        };
        var params = {
            "from_date": "2014-05-01",
            "to_date": "2014-05-13"
        }
        $scope.invokeApi(RateMgrOccupancyGraphSrv.fetch, params, fetchGraphDataSuccess);
    };

    fetchGraphData();
    }
]);