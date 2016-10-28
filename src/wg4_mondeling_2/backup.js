/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

d3.json('./mondeling2.json', function(data){
    //Een aantal variabelen aanmaken en declareren
    var svg = d3.select('svg');
    var width = 800;
    var height = 600;
    
    //Dit stukje maakt een svg element aan als eerste element en geeft het een width en een height
    d3.selectAll('body')
        .insert('svg', ':first-child')
        .attr('width', width)
        .attr('height', height);
    
    //Sorteert op snack
    var nestedSnacks = d3.nest()
        .key(function(el){return el.Snack;})
        .entries(data);
    
    //Ik wil weten hoevaak een bepaalde snack voorkomt en dit stop ik hier in een variabele.
    function makeAnArrayWithSnacks() {
        var countedSnacks = [];
        for (var i = 0; i < nestedSnacks.length; i++)
            countedSnacks.push(nestedSnacks[i].values.length);
        return countedSnacks;
    }
    
    //Maakt hier de start voor een pieChart en gebruikt de waarden die uit de vorige functie zijn gekomen
    var snackPieChart = d3.layout.pie();
    var myData = snackPieChart([2,3,5,1]);
    
    //De radius wordt hier gezet op 200
    var newArc = d3.svg.arc();
    newArc.outerRadius(200);
    
    //Maak een titel aan voor onze data visualisatie
    svg.append('text')
        .text('Geconsumeerde snacks')
        .attr('x', '20px')
        .attr('y', '60px')
        .style('font-family', 'YanoneKaffeesatz-Bold')
        .style('text-transform', 'uppercase')
        .style('font-size', '60px');
    
    //Maak een piechart aan
    var myPieChart = svg.append('g')
        .attr('id', 'piechart')
        .attr('transform', 'translate(300, 300)');
    
    //Maak voor elke slice in de piechart een groep
    var slicePieChart = myPieChart.selectAll('g.slice')
        .data(myData)
        .enter()
            .append('svg:g')
                .attr('class', 'slice');
    
    //Teken in elke groep een slice
    slicePieChart.append('svg:path')
                .attr('d', newArc)
                .style('fill', '#607d8b')
                .style('stroke', 'white')
                .style('stroke-width', '2px');
    
//Used http://bl.ocks.org/enjalot/1203641 for the slices of the piechart
});
