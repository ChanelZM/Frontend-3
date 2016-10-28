/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

//d3.json('weather.json', function (data) {
//    console.log(data[1].dag);
//});
//
//d3.select('svg').append('rect').attr('x', 20).attr('y', 312).attr('width', 10).attr('height', 88).attr('class', 'dag');

//d3.json('weather.json', function (data) {
//    console.log(data);
//});

var decade = 10;
var barDag = [20, 50, 80, 110, 140, 170, 200, 230];
var barNacht = [30, 60, 90, 120, 150, 180, 210, 240];

//d3.select('svg').append('rect').attr('x', 2*decade).attr('y', 312).attr('width', 10).attr('height', 88).attr('class', 'dag');
//d3.select('svg').append('rect').attr('x', 3*decade).attr('y', 336).attr('width', 10).attr('height', 64).attr('class', 'nacht');
//
//d3.select('svg').append('rect').attr('x', 5*decade).attr('y', 288).attr('width', 10).attr('height', 112).attr('class', 'dag');
//d3.select('svg').append('rect').attr('x', 6*decade).attr('y', 328).attr('width', 10).attr('height', 72).attr('class', 'nacht');
//
//d3.select('svg').append('rect').attr('x', 8*decade).attr('y', 276).attr('width', 10).attr('height', 124).attr('class', 'dag');
//d3.select('svg').append('rect').attr('x', 9*decade).attr('y', 324).attr('width', 10).attr('height', 76).attr('class', 'nacht');
//
//d3.select('svg').append('rect').attr('x', 11*decade).attr('y', 276).attr('width', 10).attr('height', 124).attr('class', 'dag');
//d3.select('svg').append('rect').attr('x', 12*decade).attr('y', 332).attr('width', 10).attr('height', 68).attr('class', 'nacht');
//
//d3.select('svg').append('rect').attr('x', 14*decade).attr('y', 296).attr('width', 10).attr('height', 104).attr('class', 'dag');
//d3.select('svg').append('rect').attr('x', 15*decade).attr('y', 344).attr('width', 10).attr('height', 56).attr('class', 'nacht');
//
//d3.select('svg').append('rect').attr('x', 17*decade).attr('y', 328).attr('width', 10).attr('height', 72).attr('class', 'dag');
//d3.select('svg').append('rect').attr('x', 18*decade).attr('y', 352).attr('width', 10).attr('height', 48).attr('class', 'nacht');
//
//d3.select('svg').append('rect').attr('x', 20*decade).attr('y', 328).attr('width', 10).attr('height', 72).attr('class', 'dag');
//d3.select('svg').append('rect').attr('x', 21*decade).attr('y', 352).attr('width', 10).attr('height', 48).attr('class', 'nacht');


d3.json('weather.json', function (data) {
    for (var i=0; i < data.length; i++){
    var temperatuurLijst = [data[i].dag, 
                            data[i].nacht];
        
    d3.select('svg').append('rect').attr('x', barDag[i]).attr('y', 400 - 4*data[i].dag).attr('width', decade).attr('height', 4*data[i].dag).attr('class', 'dag');
    d3.select('svg').append('rect').attr('x', barNacht[i]).attr('y', 400 - 4*data[i].nacht).attr('width', decade).attr('height', 4*data[i].nacht).attr('class', 'nacht');
    }
    console.log(data);
    
});