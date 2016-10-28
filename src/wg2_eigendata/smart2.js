/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
//var padding = 20;
//var width = 600;
//var height = 400;
//var svg = d3.select("svg").attr("width", width).attr("height", height);
//
//d3.json('eigendata.json', function (data){
//    //De uren uit het JSON bestand halen en in een Array stoppen
//        function getDataOutOfArray(dataSet, dataName){
//        var subArrayHours = [];
//        for (var i=0; i < dataSet.length; i++)
//            subArrayHours.push(dataSet[i][dataName]);
//        return subArrayHours;
//    }
//    
//    //Het resultaat van de functie stop ik in result
//    var result = getDataOutOfArray(data, "uren");
//    
//    for (var i = 0; i <data.length; i++){
//        var smartphoneData = data[i].uren;
//        
//        d3.select('svg').append('rect').attr('x', 40 * i).attr('y', 200).attr('width', 30).attr('height', 20 * data[i].uren).attr('class', 'uren');
//    }
//    
//    var xScale = d3.scale.linear().domain([0, data.length]).range([0 + padding, width]);
//    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(7);
//    svg.append("g").attr("class", "axis").attr("transform", "translate(0," + (height - padding) + ")").call(xAxis);
//    var yScale = d3.scale.linear().domain([0, d3.max(result)]).range([height, 0]);
//    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(7);
//    svg.append("g").attr("class", "axis").attr("transform", "translate(" + padding + "," + width + ")").call(yAxis);
//});
////Alle variabelen
//var decade = 10;
//var height = 400;
//var padding = 50;
//var width = 300;
//var svg = d3.select("svg");
//
////Data ophalen uit JSON bestand
//d3.json('eigendata.json', function (data) {
////Dit stukje code zorgt ervoor dat ik alle waarden van uren verzamel in 1 variabele
//    function getDataOutOfArray(dataSet, dataName){
//        var subArrayHours = [];
//        for (var i=0; i < dataSet.length; i++)
//            subArrayHours.push(dataSet[i][dataName]);
//        return subArrayHours;
//    }
//    
//    //Het resultaat van de functie stop ik in result
//    var result = getDataOutOfArray(data, "uren");
//    
//    //Hier wordt een schaal opgeslagen in variabele yScale en xScale
//    var xScale = d3.scale.linear().domain([0, data.length]).range([0 + padding, width]);
//    var yScale = d3.scale.linear().domain([0, d3.max(result)]).range([height,0]);
//    console.log(d3.max(result));
//    
//    //Hier voeg ik een assenstelsel toe
//    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(7);
//    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(7);
//
//    //For loop om de data uit het JSON bestand weer te geven.
//    for (var i = 0; i < data.length; i++) {
//        var smartphoneData = [data[i].dag, data[i].uren];
//        
//        d3.select('svg')
//            .append('rect')
//            .attr('x', 40 * i + padding)
//            .attr('y', height-yScale(data[i].uren)).attr('width', 3 * decade).attr('height', yScale(data[i].uren)).attr('class', 'uren');
//        //d3.select('svg').append('p').text('Dag ' + data[i].dag);
//    }
//    
//    svg.append("g").attr("class", "axis").attr("transform", "translate(0," + (height - padding) + ")").call(xAxis);
//    svg.append("g").attr("class", "axis").attr("transform", "translate(" + padding + "," + width + ")").call(yAxis);
//    
//});
//
var padding = 20;
var width = 600;
var height = 400;
var svg = d3.select("svg").attr("width", width).attr("height", height);
//
d3.json('eigendata.json', function (data) {
    for (var i = 0; i < data.length; i++) {
        var smartphoneData = data[i].uren;
        d3.select('svg')
            .append('rect')
            .attr('x', 40 * i)
            .attr('y', 200)
            .attr('width', 30)
            .attr('height', 20 * data[i].uren)
            .attr('class', 'uren');
    }
    //
    var xScale = d3.scale.linear().domain([0, d3.max(data, function (d) {
        return d[0];
    })]).range([padding, width - padding * 2]);
});
//