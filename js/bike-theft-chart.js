var ctx = document.getElementById("bike-theft-diagram").getContext('2d');

var lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"],
    datasets: [{
      label: 'aufgeklärte Fälle',
      data: [43921, 42476, 44642, 46797, 50207, 47815, 48041, 46956, 50510, 51391],
      backgroundColor: "rgba(63,103,139,0.8)",
    }, {
      label: 'erfasste Fälle',
      data: [186881, 182372, 184914, 190437, 213012, 213012, 226279, 242899, 267123, 270880],
      backgroundColor: "rgba(152,0,0,0.8)",
    }]
  },

	options: {
        scales:
        {
            xAxes: [{
                gridLines : {
                    display : false,
										show: false
                }
            }],
						yAxes: [{
                gridLines : {
										display: false,
                    show: false
                },
								ticks: {
                	display: false
            		}
            }]
        },
				layout: {
	 				padding: {
		 				top: 10
	 				}
 				},

				responsive: true,
 					legend: {
	 					position: 'center',
 					}
				},

				tooltips:
				{
						callbacks:
						{
								//label: function(tooltipItem, chartData) {
								//		width: 60,
    						//		height: 60,
								//}
						}
				}

});
