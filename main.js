var margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#graphDiv")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("recipes_with_nutritional_info.json", function(data){
    console.log(data);
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

    //X Label
    svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Fat per 100g");

    //Y Label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Salt per 100g");  

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.nutr_values_per100g.fat); } )
      .attr("cy", function (d) { return y(d.nutr_values_per100g.salt); } )
      .attr("r", 1.5)
      .style("fill", function (d) { return d3.color(d.fsa_lights_per100g.sugars); } )

});