var w = parseInt($(window).width());
var h = parseInt($(window).height());
var paddingPercentage = 5
var wPadding = parseInt((w*paddingPercentage)/100);
var hPadding = parseInt((w*paddingPercentage)/100);
var range = 500

function randomIntFromInterval(min,max) {
  return parseInt(Math.floor(Math.random()*(max-min+1)+min));
}

var vertices = d3.range(range).map(function(d) {
  return [
    randomIntFromInterval(-wPadding, w + wPadding),
    randomIntFromInterval(-hPadding, h + wPadding)
  ];
});

var delaunay = d3.voronoi().triangles(vertices)

var svg = d3.select("body").append("svg").attr("preserveAspectRatio", "xMidYMid slice").attr("viewBox", [0, 0, w, h].join(' '))

svg.append("g").selectAll("path").data(delaunay).enter().append("path")
.attr("class", function(d, i) {
  return "q" + (i % 9) + "-9";
}).attr("d", function(d) {
  return "M" + d.join("L") + "Z";
});