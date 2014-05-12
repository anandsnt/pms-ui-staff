sntRover.controller('RateMgrOccupancyGraphCtrl', ['$q', '$scope', 'RateMgrOccupancyGraphSrv',
    function ($q, $scope, RateMgrOccupancyGraphSrv) {

        BaseCtrl.call(this, $scope);
        $scope.highchartsNG = {};
        var drawGraph = function(){
            $scope.highchartsNG = {
                options: {
                    chart: {
                        type: 'line',
                        className: "rateMgrOccGraph",
                        plotBackgroundColor: '#e0e0e0'
                    },
                    legend: {
                        rtl: true,
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'top',
                        borderWidth: 0
                    },
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
            actualData.push([itemDate, 20]); // TODO :: replace harcoded 20 with item.actual
            targetData.push([itemDate, 10]); // TODO :: replace harcoded 10 with item.target
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

    var fetchGraphData = function(params){
        var fetchGraphDataSuccess = function(data) {
            $scope.graphData = manipulateGraphData(data);
            drawGraph();
            $scope.$emit('hideLoader');
        };
        $scope.invokeApi(RateMgrOccupancyGraphSrv.fetch, {}, fetchGraphDataSuccess);
    };

    fetchGraphData();
    }
]);