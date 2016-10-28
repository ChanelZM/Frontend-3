/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

d3.json('./mondeling2.json', function(data){
        //Sorteert op snack
    var nestedSnacks = d3.nest()
        .key(function(el){return el.Snack;})
        .entries(data);
    
    //Ik wil weten hoevaak een bepaalde snack voorkomt en dit stop ik hier in een variabele.
    //Om later labels te maken, maak ik een array met de waarden van de snacks
    var subSet = [];
    for (var i = 0; i < nestedSnacks.length; i++){
        subSet.push({count:nestedSnacks[i].values.length, type:nestedSnacks[i].key});
    }
    
    //Een aantal variabelen aanmaken en declareren
    var width = 800;
    var height = 600;
    var pieRadius = [50, 200];
    var pieColors = d3.scale.category20c();
    
    
    //Dit stukje maakt een svg element aan als eerste element en geeft het een width en een height
    d3.selectAll('body')
        .insert('svg', ':first-child')
        .data([subSet])
        .attr('width', width)
        .attr('height', height);
    
    //Nog meer variabelen
    var svg = d3.select('svg');
    var dataTip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '10px')
        .style('background', 'lightblue')
        .style('opacity', '0')
        .style('font-family', 'YanoneKaffeesatz-Bold')
        .style('text-transform', 'uppercase')
        .style('font-size', '20px');
    var moreInfo = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('opacity', '0')
        .style('font-family', 'YanoneKaffeesatz-Bold')
        .style('text-transform', 'uppercase')
        .style('font-size', '20px');
    
    //Maak een titel aan voor onze data visualisatie
    svg.append('text')
        .text('Geconsumeerde snacks')
        .attr('x', '20px')
        .attr('y', '60px')
        .style('font-family', 'YanoneKaffeesatz-Bold')
        .style('text-transform', 'uppercase')
        .style('font-size', '60px');
    
    //Maak een groep aan die de piechart groepeert
    var myPieChart = svg.append('g')
        .attr('id', 'piechart')
        .attr('transform', 'translate(300, 300)');
    
    //De radius wordt hier gezet op 200
    var newArc = d3.svg.arc()
        .innerRadius(pieRadius[0])
        .outerRadius(pieRadius[1]);
    
    //Maakt hier de start voor een pieChart en gebruikt de waarden die uit de vorige functie zijn gekomen
    var snackPieChart = d3.layout.pie().value(function (d){ return d.count;});
    
    //Maak voor elke slice in de piechart een groep
    var slicePieChart = myPieChart.selectAll('g.slice')
        .data(snackPieChart)
        .enter()
            .append('svg:g')
                .attr('class', 'slice');
    
    //Teken in elke groep een slice
    slicePieChart.append('svg:path')
        .attr('d', newArc)
        .style('fill', function(d,i){return pieColors(i);})
        .style('stroke', 'white')
        .style('stroke-width', '2px')
        .on('mouseover', colorMouseover)
        .on('mouseover', function(d, i){
            d3.select(this)
                .transition()
                .duration(200)
                .style('fill', 'darkgray');
            dataTip.transition()
                .style('opacity', 0.7); 
            dataTip.html(subSet[i].type + ' heb ik ' + subSet[i].count + ' keer gegeten.');
            dataTip.style('left', d3.event.pageX + 'px');
            dataTip.style('top', d3.event.pageY + 'px');})
        .on('mouseout', colorMouseout)
        .on('click', function(d, i){
        function getData() {
            console.log(nestedSnacks);
            for(var a=0; a < nestedSnacks[i].values.length; a++){
                return 'Datum: ' + nestedSnacks[i].values[a].Date + '</br>' + 'Locatie: ' + nestedSnacks[i].values[a].Location; 
            }
        }
            moreInfo.style('opacity', '1')
                .html(getData());
    });
    
    //Een functie wanneer je hovert
    function colorMouseover(d) {
        d3.select(this)
                .transition()
                .duration(200)
                .style('fill', 'darkgray');
        }
    
    //Wanneer je niet meer op het element staat met de muis
    function colorMouseout(){
        d3.selectAll('path')
            .transition()
            .duration(200)
            .style('fill', function(d,i){return pieColors(i);});
        dataTip.transition()
            .style('opacity', 0);
        dataTip.html('');
    }
    
    //Voeg labels toe aan de slices
    slicePieChart.append('svg:text')
        .attr('text-anchor', 'middle')
        .attr('transform', function(d) {
            d.innerRadius = pieRadius[0];
            d.outerRadius = pieRadius[1];
        console.log(newArc.centroid(d));
            return 'translate(' + newArc.centroid(d) + ')';
        })
        .text(function(d,i){return subSet[i].type;})
        .style('font-family', 'YanoneKaffeesatz-Bold')
        .style('text-transform', 'uppercase')
        .style('font-size', '20px')
        .style('fill', 'white');

//Source: http://bl.ocks.org/enjalot/1203641 for the slices of the piechart
//Source: Lynda.com for the color scales
//Source: Elton with dataTip
//Source: D3 in action
});
