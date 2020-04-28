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

const zoom = d3.zoom()
.scaleExtent([1/4, 9])
.on('zoom', function () {
  d3.select('g').attr('transform', d3.event.transform)
});

var xValue = "fat";
var yValue = "fat";
var margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#graphDiv")
  .append("svg")
  .attr('id','graph')  
  .call(zoom)
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
    .text("Fat per 100g");  


  // Add dots
  var dots = svg
    .append('g')
    .selectAll("dot")
    .data(data)
    .enter()     
    .append("circle")
      .attr("cx", function (d) { return x(d.nutr_values_per100g[xValue]); } )
      .attr("cy", function (d) { return y(d.nutr_values_per100g[yValue]); } )
      .attr("r", 1)
      .style("fill", function (d) { return d3.color(d.fsa_lights_per100g.fat); } )
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',5)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',1)
          .attr('stroke-width',1)
      })
      .on('click', function(d) {window.open(d.url);})
      .append('title')
      .text(function (d) { return "Title of Recipe: " + d.title + "\n# of Steps in Recipe: " + d.instructions.length + "\nFat per 100g: " + d.nutr_values_per100g.fat + "\nProtein per 100g: " + d.nutr_values_per100g.protein + "\nSugars at per 100g: " + d.nutr_values_per100g.sugars;})


  // function filterOutData(inputValues) {
  //   console.log("insideFilter")
  //   //Useful example: https://www.d3-graph-gallery.com/graph/line_filter.html

  //   // Create a new dataset
  //   var filteredDownData = data.filter(function(d){return d.nutr_values_per100g.fat < 12;})

  //   // With the new data now we need to update the dots
  //   dots
  //       .data(filteredDownData)
  // }
});

function switchFilterOut(searchTerms){
  // Input: Array of Strings of search terms to match

  d3.selectAll('circle').style("fill",function (d){ 
    // First lets build up the ingredients into a single string
    var ingListStr = ""
    for (var idx in d.ingredients) {
      substr = d.ingredients[idx]["text"] + " "
      ingListStr += substr.toLowerCase()
    }

    // Now lets go through and see if any of our terms match the ingredients string we built above
    for (var term in searchTerms){
      term = searchTerms[term].toLowerCase()
      if (!(ingListStr.includes(term))){
        return "none"
      }
    }
    return d3.select(this).style('fill')
  });
  
}


function switchYAxis(value) {
  yValue = value.toLowerCase();
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);

  d3.select('#yAxis')
    .call(d3.axisLeft(y));
  
  d3.select('#yAxisLabel') // change the yAxisLabel
    .text(value + " per 100g");

  d3.selectAll('circle') // move the circles
    .attr('cy',function (d) { return y(d.nutr_values_per100g[yValue]) });
}

function switchXAxis(value) {
  xValue = value.toLowerCase();
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, width ]);
    
  d3.select('#xAxis')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  
  d3.select('#xAxisLabel') // change the yAxisLabel
    .text(value + " per 100g");

  d3.selectAll('circle') // move the circles
    .attr('cx',function (d) { return x(d.nutr_values_per100g[xValue]) });
}

function switchColor(value) {
  d3.selectAll('circle')
  .style("fill", function (d) { return d3.color(d.fsa_lights_per100g[value.toLowerCase()]);});
}

function filterColor(greenToggle, orangeToggle, redToggle, value) {
  colorM = {}
  colorM["green"] = greenToggle
  colorM["orange"] = orangeToggle
  colorM["red"] = redToggle
  d3.selectAll('circle')
  .style("fill",function (d) { 
    let color = d3.color(d.fsa_lights_per100g[value.toLowerCase()]);
    if(colorM[d.fsa_lights_per100g[value.toLowerCase()]]){
      return color;
    }
    return "none";
  });
}
function filter(){

  zoom.transform(svg, d3.zoomIdentity);

  let xAxisValue = $("#xAxisSelection").val();
  switchXAxis(xAxisValue);

  let yAxisValue = $("#yAxisSelection").val();
  switchYAxis(yAxisValue);

  let colorValue =  $("#colorSelection").val();
  switchColor(colorValue);

  let greenToggle = $("#greenBox").prop( "checked" );
  let orangeToggle = $("#orangeBox").prop( "checked" );
  let redToggle = $("#redBox").prop( "checked" );
  filterColor(greenToggle, orangeToggle, redToggle ,colorValue);

  let filterValues = ["yogurt", "straw"]
  switchFilterOut(filterValues);
}
