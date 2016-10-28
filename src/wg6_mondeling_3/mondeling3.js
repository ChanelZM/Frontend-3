/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/
d3.json('mondeling3.json', function(data){
    //Sorteren op dagen en de gemiddelde calorieen daarvan uitrekenen
    var nestedDays = d3.nest()
                        .key(function(el){return el.datum.substring(0, 3);})
                        .rollup(function(leaves){
                            return {
                                "indexNumber": d3.min(leaves, function(d){return d.weekdag;}),
                                "averageKcal": d3.mean(leaves, function(d){return d.kcal;}), 
                                "countHappy": d3.sum(leaves, function(d){ return d.aantal_blij;}), 
                                "averageSchoolTime": d3.mean(leaves, function(d){return d['tijd aan school'];}),
                                "school": [
                                    {
                                        "label": "projectdatavisualisatie", 
                                        "averageTime": d3.mean(leaves, function(d){return d.projectdatavisualisatie;})
                                    }, {
                                        "label": "dataexperience", 
                                        "averageTime": d3.mean(leaves, function(d){return d.dataexperience;})
                                    }, {
                                        "label": "frontenddevelopment", 
                                        "averageTime": d3.mean(leaves, function(d){return d.frontenddevelopment;})
                                    }, {
                                        "label": "informationdesign", 
                                        "averageTime": d3.mean(leaves, function(d){return d.informationdesign;})
                                    }
                                ],
                                "averageExpenses": d3.mean(leaves, function(d){return d.uitgaven;})
                            };
                        })
                        .entries(data);

    //Used http://bl.ocks.org/phoebebright/raw/3176159/ for rollup
    
    //Defining variables that will be used for measurements
    var svgheight = 400,
        padding = 10,
        barwidth = 60,
        axisSize = 1,
        svgwidth = nestedDays.length * barwidth + nestedDays.length * (5 * padding);
    
    //Saving input and output values
    var rangeOutput = document.getElementsByTagName('output')[0],
        rangeInput = document.getElementById('filtering'),
        sortWeekInput = document.getElementById('sortbyweek'),
        sortCaloriesInput = document.getElementById('sortbycalories'),
        schoolGraph = document.getElementById('schoolgraph'),
        calorieGraph = document.getElementById('caloriebar');
    
    var title = document.querySelector('.title'),
        description = document.querySelector('.description'),
        strong = document.getElementsByTagName('strong')[0],
        button = document.getElementById('button');
    

    //Setting up svg
    var svg = d3.select('svg')
                .attr('width', svgwidth)
                .attr('height', svgheight)
                .attr('fill', 'white');
    
    //Setting up scale
    //y-axis scale left
    var yScale = d3.scale.linear()
                .domain([0, d3.max(nestedDays, function(d){return d.values.averageKcal;})])
                .range([svgheight, 0]);
    
    //y-axis scale right
    var yScaleSchool = d3.scale.linear()
                .domain([0, d3.max(nestedDays, function(d){return d.values.averageSchoolTime;})])
                .range([svgheight, 40]);
    
    //x-scale for linechart
    var xScale = d3.scale.linear()
                .domain([0, d3.max(nestedDays, function(d){return d.values.indexNumber;})])
                .range([0, (svgwidth-27*padding)]);
    
    //Color scale
    var colorScale = d3.scale.linear()
                .domain([0, 12])
                .range(['#ff5b00', '#ffffff']);
    
    //Setting up Axis   
    //y-axis left
    var yAxis = d3.svg.axis()
                .scale(yScale)
                .tickSize(axisSize)
                .orient('left');
    
    //y-axis right
    var yAxisSchool = d3.svg.axis()
                .scale(yScaleSchool)
                .tickSize(axisSize)
                .orient('right');
    
    //Drawing axis
    //Drawing the y-axis left
    svg.append('g')
        .attr('class', 'yaxisleft')
        .attr('transform', 'translate(' + 4 * padding + ',' + 4 * -padding + ')')
        .call(yAxis);
    
    //Setting up a barchart
    var barChart = svg.append('g')
        .attr('class', 'barchart')
        .attr('x', barwidth);
    
        //Setting up line chart
    var line = d3.svg.line()
        .x(function(d){return xScale(d.values.indexNumber);})
        .y(function(d){return yScaleSchool(d.values.averageSchoolTime);});
    
    //Calling update to draw the barchart
    update();
    
    //If user moves slider, change text on screen and filter
    rangeInput.addEventListener('input', function(){
        //Changing the text
        title.textContent = 'No matching feelings';
        description.textContent = 'The way I feel throughout the day doesn’t seem to affect calories I consume. So maybe it’s something else. Let’s take a look at how much time I spend on school.';
        strong.textContent = 'Set "filter by feelings" back to "0" and check the box "Time spend on school"';
        
        //Output is input value and update
        rangeOutput.value = rangeInput.value;
        update();
        
        //Make button not visible
        if (button.id == ' '){
            button.setAttribute('id', 'button');
        }
    });  
    
    //If user checks "sort by week" change the sorting to week
    sortWeekInput.addEventListener('click', function() {
        var bar = barChart.selectAll('g.barline')
                .data(nestedDays.sort(function(a, b){return +a.values.indexNumber - +b.values.indexNumber;}));
        
         var lineChart = svg.selectAll('.linechart')
            .datum(nestedDays.sort(function(a, b){return +a.values.indexNumber - +b.values.indexNumber;}));
        
        update();
        
        //Make button not visible
        if (button.id == ' '){
            button.setAttribute('id', 'button');
        }
    });
    
    
    //If user checks "sort by calories" change text on screen and sort
    sortCaloriesInput.addEventListener('click', function() {
        //Changing the text
        title.textContent = 'Definitely fridays';
        description.textContent = 'So I should skip friday right? Oh wait... I can’t. So it’s best to look at why I eat so much on that day.';
        strong.textContent = ' Try to filter by feelings';
        
        //Sorting data
        var bar = barChart.selectAll('g.barline')
                .data(nestedDays.sort(function(a, b){return b.values.averageKcal-a.values.averageKcal;}));
        
        //Define line
        line = d3.svg.line()
        .x(function(d, i){return xScale(i);})
        .y(function(d){return yScaleSchool(d.values.averageSchoolTime);});
       
        //Tell linechart what data to use
//        var lineChart = svg.selectAll('.linechart')
//            .datum(nestedDays.sort(function(a, b){return b.values.averageKcal-a.values.averageKcal;}))
        
        update();
        
        //Make button not visible
        if (button.id == ' '){
            button.setAttribute('id', 'button');
        }
    });
    
    schoolGraph.addEventListener('click', function(){
        //Changing the text
        title.textContent = 'Is school the boogieman?';
        description.textContent = 'Hmm..school doesn’t seem to be the problem either. Let’s take a look at how much time I spend on different classes.';
        strong.textContent = ' Hover over the bars';
        
        //Toggle visibility
        var lineChartGroup = d3.select('.linechart');
        lineChartGroup.classed('visible', !lineChartGroup.classed('visible'));
        
        //Make button not visible
        if (button.id == ' '){
            button.setAttribute('id', 'button');
        }
        
        //Used http://jaketrent.com/post/d3-class-operations/ for toggle
    });
    
    calorieGraph.addEventListener('click', function(){
        //Toggle barchart visibility
        var leftAxis = d3.select('.yaxisleft');
        leftAxis.classed('visible', !leftAxis.classed('visible'));
        var bars = d3.selectAll('.barline rect, .legend');
        bars.classed('visible', !bars.classed('visible'));
    });
    
    //Prevent reload when user clicks on link
    button.addEventListener('click', function(event){
        event.preventDefault();
        
        //Changing the text 
        title.textContent = 'OMG! this is it';
        description.textContent = 'Wow, I think I’ve found the cause of my eating habits, if I spend more, I will eat more. So  all I have to do is spend less! Problem Solved!';
        strong.textContent = ' ';
        button.textContent = 'Show me this magic again!';
        button.remove();
        
        var makeButtonDoAgain = document.createElement('A');
        document.getElementById('explanation').appendChild(makeButtonDoAgain);
        
        var buttonDoAgain = document.getElementsByTagName('a')[0];
        buttonDoAgain.setAttribute('href', 'index.html');
        buttonDoAgain.innerHTML = 'Show me this magic again!';
        
        //Remove bars and legend
        d3.selectAll('rect').remove();
        d3.selectAll('.legend').remove();
        d3.selectAll('.linechart').remove();
        d3.select('.graphchoices').style('opacity', 0.3);
        d3.select('.sorting').style('opacity', 0.3);
        d3.select('.filtering').style('opacity', 0.3);
        
        energyAndExpensesLineChart();
    });

    //function for filtering
    function update(){
        //Filtering the barchart
        var minValue = +rangeInput.value;
        var subSet = nestedDays.filter(function(d){
            return d.values.countHappy >= minValue;
        });
        
        //Tell what data must be used
        var bar = barChart.selectAll('g.barline')
                .data(subSet);

        //Add rectangles, remove rect if data is less than rect
        bar.enter().append('g').attr('class', 'barline');
        bar.exit().remove();
        
        // Needed to remove all rects before adding one
            d3.selectAll('.barline rect').remove();
            d3.selectAll('.barline text').remove();

        //Draw bars
        bar.append('rect')
            .attr('id', function(d, i){return i;})
            .attr('width', barwidth)
            .attr('test', function(d, i){return i})
            .attr('height', function(d, i){return (svgheight - 4 * padding) - yScale(subSet[i].values.averageKcal);})
            .attr('x', function(d, i){return (barwidth + padding) * i;})
            .attr('y', function(d, i){return yScale(subSet[i].values.averageKcal);})
            .style('fill', function(p){return colorScale(p.values.countHappy);})
            .attr('transform', 'translate(' + 4 * padding + ', 0)')
            .on('mouseover', colorAndPie)
            .on('mouseout', colorAndPieRemove);
                
        //Adding text to barchart with the values
        bar.append('text')
            .text(function(d, i){return subSet[i].key;})
            .attr('fill', 'white')
            .style('font-size', '1em')
            .attr('x', function(d, i){return 6 * padding + (i * (barwidth + padding));})
            .attr('y', svgheight - 2 * padding);
        
        d3.select('.linechart').remove();
            
    function schoolLineChart(){      
        //Make group for linechart
        var lineChart = svg.append('g')
            .attr('class', 'linechart')
            .datum(nestedDays);
        
        var lineChartGroup = d3.select('.linechart');
        lineChartGroup.classed('visible', !lineChartGroup.classed('visible'));
        
        //Drawing the y-axis right
        lineChart.append('g')
            .attr('class', 'yaxisright')
            .attr('transform', 'translate(' + (svgheight + 2 * barwidth) + ', ' + 4 * -padding + ')')
            .call(yAxisSchool);

        //Draw line
        lineChart
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', '#79b6b6')
            .attr('stroke-width', '5')
            .attr('d', line)
            .attr('transform', 'translate(' + 0.5*-padding + ', ' + 4*-padding + ')');
    }
    
    schoolLineChart();
    
    }

    //Make pie chart and change color
    function colorAndPie(){
        //Changing the text
        title.textContent = 'Do I see a pattern?';
        description.textContent = 'Nope, still nothing. Let’s look at something else, my expenses.';
        strong.textContent = '';
        
        //Button becomes visible
        if (button.id == 'button'){
            button.setAttribute('id', ' ');
        }
        
        //On mouseover transition to color
        d3.select(this)
            .transition()
            .duration(200)
            .style('fill', '#1c4240');
        
        //ID tells piechart what data to use
        selected = d3.select(this).attr("id");
        
        pieChart();
    }
    
    function colorAndPieRemove(){
        //Remove previous piechart
        d3.select('.svgpiechart').remove();
        //Used Timo Verkroosts code for removing and adding piechart on hover
        
        //On mouseout transition back to original color
        d3.selectAll('rect')
            .data(nestedDays)
            .transition()
            .duration(200)
            .style('fill', function(p){return colorScale(p.values.countHappy);});
    }
    
    //draw the color legend
    function legenda(){
        var colorLegendData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        //Legend for colors
        var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + 2*padding + ', 0)');
        
        legend.append('text')
            .text('Not happy')
            .attr('transform', 'translate(' + (svgwidth - 19 * padding) + ',' + 2 * padding + ')');
        
        legend.append('text')
            .text('Very happy')
            .attr('transform', 'translate(' + (svgwidth - 19 * padding) + ',' + 23.5 * padding + ')');

        legend.selectAll('rect')
            .data(colorLegendData)
            .enter()
                .append('rect')
                .attr('width', 2 * padding)
                .attr('height', 2 * padding)
                .attr('x', svgwidth - 22 * padding)
                .attr('y', function(d, i){return i * (2*padding);})
                .style('fill', function(d){return colorScale(d);});
    }
    
    legenda();
    
    function pieChart(){
        //Defining variables
        var height = 600,
            width = 600,
            pieRadius = 200,
            pieColors = /*d3.scale.category20c()*/ d3.scale.linear().domain([0, 4]).range(['#aadddf', '#326362']);

        //Setting up svg and piechart
        var piesvg = d3.select('.explanation')
                .append('svg')
                .data([nestedDays[selected].values.school]);
        
        piesvg.attr('class', 'svgpiechart')
                .attr('width', width)
                .attr('height', height);
        
        var pieChartGroup = piesvg.append("g")
                .attr('class', "piechart")
                .attr('transform', 'translate(' + pieRadius + ', ' + pieRadius + ')'),
                newArc = d3.svg.arc()
                .outerRadius(pieRadius);
        

        //Drawing piechart
        var pieChartValues = d3.layout.pie()
                .value(function(d){
                    return d.averageTime;
                });

        var slicePieChart = pieChartGroup.selectAll('.slice')
                .data(pieChartValues)
                .enter()
                    .append('g')
                    .attr('class', 'slice');

        slicePieChart.append('path')
            .attr('d', newArc)
            .style('fill', function(d,i){return pieColors(i);});

        slicePieChart.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', function(d) {
                d.innerRadius = 0;
                d.outerRadius = pieRadius;
                return 'translate(' + newArc.centroid(d) + ')';
            })
            .text(function(d, i){
                if(d.value > 0){
                    return d.data.label;
                }
        });
    }
    
    function energyAndExpensesLineChart(){
        //Setting up scale for energy linechart
        var yScaleEnergy = d3.scale.linear()
                .domain([0, d3.max(nestedDays, function(d){return d.values.averageKcal;})])
                .range([svgheight - 3 * padding, 0]);
        
        //Setting up energy linechart
        var energyLine = d3.svg.line()
        .x(function(d){return xScale(d.values.indexNumber);})
        .y(function(d){return yScaleEnergy(d.values.averageKcal);});
        
        //Make new group for energy line chart
        var energyLineChart = svg.append('g')
            .attr('class', 'energylinechart');
        
        //Draw energy linechart
        energyLineChart
            .append('path')
            .datum(nestedDays)
            .attr('fill', 'none')
            .attr('stroke', '#79b6b6')
            .attr('stroke-width', '5')
            .attr('d', energyLine)
            .attr('transform', 'translate(0, 0)');
        
        energyLineChart
            .append('text')
            .text('Calories')
            .attr('transform', 'translate(400, 80)');

        //Setting up scale for expenses linechart
        var yScaleExpenses = d3.scale.linear()
                .domain([0, d3.max(nestedDays, function(d){return d.values.averageExpenses;})])
                .range([svgheight - 3 * padding, 0]);
                
        //Setting up right y axis for expenses
        var yAxisExpenses = d3.svg.axis()
                .scale(yScaleExpenses)
                .tickSize(axisSize)
                .ticks(5)
                .orient('right');
        
        //Drawing y axis
        svg.append('g')
        .attr('class', 'yaxisrightexpenses')
        .attr('transform', 'translate(' + (svgheight + 2 * barwidth) + ',' + -padding + ')')
        .call(yAxisExpenses);
        
        //Setting up expenses linechart
        var expensesLine = d3.svg.line()
        .x(function(d){return xScale(d.values.indexNumber);})
        .y(function(d){return yScaleExpenses(d.values.averageExpenses);});
        
        //Make new group for expenses linechart
        var expensesLineChart = svg.append('g')
            .attr('class', 'expenseslinechart');
        
        //Draw expenses linechart
        expensesLineChart
            .append('path')
            .datum(nestedDays)
            .attr('fill', 'none')
            .attr('stroke', '#326362')
            .attr('stroke-width', '5')
            .attr('d', expensesLine)
            .attr('transform', 'translate(0, 0)');
        
        expensesLineChart
            .append('text')
            .text('Expenses')
            .attr('transform', 'translate(400, 280)');
        
    }
    
});