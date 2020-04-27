$("#add").click(function() {
  let text = $("#ing").val();
  if (text === '') {
    return;
  }
  let li = $('<li/>');
  li.append("<span>" + text + "</span>");
  li.append('<button type="button" onClick="removeIng(\'' + text + '\')" class="remove-ing btn btn-primary btn-sm">-</button>');
  li.addClass("col-2");
  li.addClass("ingredient");
  li.attr("id", text);
  $("#ingredients").append(li);
  $('#ing').val("");
});

function removeIng(ing) {
  $("#" + ing).remove();
}

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
    .attr('id','xAxis')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);

  svg.append("g")
    .attr('id','yAxis')
    .call(d3.axisLeft(y));

    //X Label
    svg.append("text")
    .attr('id','xAxisLabel')             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Fat per 100g");

    //Y Label
    svg.append("text")
    .attr('id','yAxisLabel') 
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
      .attr("r", 3)
      .style("fill", function (d) { return d3.color(d.fsa_lights_per100g.sugars); } )
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',12)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',3)
          .attr('stroke-width',1)
      })
      .append('title')
      .text(function (d) { return d.title })

});

function switchYAxis(value) {
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
    
  yAxis.scale(yScale)
  d3.select('#yAxis')
    .transition().duration(1000)
    .call(d3.axisLeft(y));
  
  d3.select('#yAxisLabel') // change the yAxisLabel
    .text(value + " per 100g");

  d3.selectAll('circle') // move the circles
    .transition().duration(1000)
    .delay(function (d,i) { return i*100})
    .attr('cy',function (d) { return y(d.nutr_values_per100g[value]) });
}

function switchXAxis(value) {
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, width ]);
    
  d3.select('#xAxis')
    .call(d3.axisLeft(x));
  
  d3.select('#xAxisLabel') // change the yAxisLabel
    .text(value + " per 100g");

  d3.selectAll('circle') // move the circles
    .attr('cx',function (d) { return x(d.nutr_values_per100g[value.toLowerCase()]) });
}

function filter(){
  let xAxisValue = $("#xAxisSelection").val();
  switchXAxis(xAxisValue);
}
