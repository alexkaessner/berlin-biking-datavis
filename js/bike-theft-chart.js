var ctx = document.getElementById("bike-theft-diagram").getContext("2d");

var data = {
labels: ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"],
datasets: [{
  label: 'aufgeklärte Fälle',
  data: [1032, 1288, 1259, 888, 1059, 1125, 1067, 1238, 1255, 1203],
  backgroundColor: 'rgba(20, 99, 217, 0.7)',
  // fill: 'rgba(20, 99, 217, 0.7)'
}, {
  label: 'erfasste Fälle',
  data: [20246, 23645, 21689, 19942, 25988, 26029, 26513, 30758, 32244, 34418],
  backgroundColor: 'rgba(255, 0, 0, 0.7)',
//   fill: 'rgba(20, 99, 217, 0.7)'

  }]
};

var myLineChart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: {
    legend: {
      display: false,
/*
      position: 'top',
      labels: {
        fontColor: '#333'
      } */

    },
    scales:
    {
        xAxes: [{
            gridLines : {
              drawBorder: true,
                display : false,
                show: false
            }
        }],
        yAxes: [{
            gridLines : {
              drawBorder: false,
                display: false,
                show: false
            },
            ticks: {
              display: false
            }
        }]
    },
    showAllTooltips: true,
    tooltips: {
      custom: function(tooltip) {
        if (!tooltip) return;
        // disable displaying the color box;
        tooltip.displayColors = false;
      },
      callbacks: {
        // use label callback to return the desired label
        label: function(tooltipItem, data) {
          return tooltipItem.yLabel;
        },
        // remove title
        title: function(tooltipItem, data) {
          return;
        }
      }
    }
  }
});
