$(function () {
    new Chart(document.getElementById("line_chart").getContext("2d"), getChartJs(1));
});

function getChartJs(index) {
    var config = null;
    var toplot = getPlotArrays(index);


        config = {
            type: 'line',
            data: {
                labels: toplot["stockPriceRange"],
                datasets: [{
                    label: "Stock proba",
                    data: toplot["proba"],
                    borderColor: 'rgba(0, 188, 212, 0.75)',
                    backgroundColor: 'rgba(0, 188, 212, 0.3)',
                    pointBorderColor: 'rgba(0, 188, 212, 0)',
                    pointBackgroundColor: 'rgba(0, 188, 212, 0.9)',
                    pointRadius: 1.5,
                    pointBorderWidth: 0.2
                }, {
                        label: "Total gain",
                        data: toplot["totalGain"],
                        borderColor: 'rgba(233, 30, 99, 0.75)',
                        backgroundColor: 'rgba(233, 30, 99, 0.3)',
                        pointBorderColor: 'rgba(233, 30, 99, 0)',
                        pointBackgroundColor: 'rgba(233, 30, 99, 0.9)',
                        pointRadius: 1.5,
                        pointBorderWidth: 0.2
                    }]
            },
            options: {
                responsive: true,
                legend: false,
                annotation: {
                    annotations: [
                      {
                        drawTime: "afterDatasetsDraw",
                        type: "line",
                        mode: "vertical",
                        scaleID: "x-axis-0",
                        value: 90,
                        borderWidth: 5,
                        borderColor: "red",
                        label: {
                          content: "TODAY",
                          enabled: true,
                          position: "top"
                        }
                      }
                    ]
                }
            }
          }




    return config;
}