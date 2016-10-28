/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
var i = 0;

var padding = 20;

var margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
};

var size = {
    width: 600,
    height: 400
};

d3.select('svg')
    .attr('width', size.width)
    .attr('height', size.height);

d3.json('eigendata.json', function (data){
    var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d){return d.minuten;})])
        .range([size.height, 0]);
    
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5);
    
    for(i; i<data.length; i++){
        d3.select('svg')
        .append('rect')
        .classed('bars', true)
        .attr('width', 50)
        .attr('height', size.height - yScale(data[i].minuten))
        .attr('x', 70 * i)
        .attr('y', size.height - (size.height - yScale(data[i].minuten)));
        console.log(yScale(data[i].minuten));
    }
    d3.select('svg').append("g")
        .attr("transform", "translate(0, 0)")
        .call(yAxis);
});