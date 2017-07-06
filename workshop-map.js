function workshopMap() {
  var svg, container, chartWrapper, path, width, height;

  width = 960, height = 450;

  //initialize svg
  svg = d3.select('#chart').append('svg')
    .attr("width", width)
    .attr("height", height)
    .call(responsivefy)

  function chart(selection) {
    selection.each(function(data) {

      var projection = d3.geoMercator()
        // initial size of map
        .scale(150)
        .translate([width / 2, height / 2]);

      var path = d3.geoPath()
          .projection(projection);

      var tooltipDiv = d3.select("body").append("div")
          .attr("class", "tooltip hide")

      //load data, then initialize chart
      d3.queue()
        .defer(d3.json, "data/world-50m.json")
        .defer(d3.csv, "data/workshop-data.csv")
        .await(init);

      // load and display the World
      function init(error, world, workshops) {
        if (error) return console.log("there was an error loading the data: " + error);
        var zoom, circles;

        chartWrapper = svg.append('g')
            .append("path")
            .datum(topojson.feature(world, world.objects.countries))
            .attr("d", path)

        circles = drawCircles(svg, workshops, projection, tooltipDiv);

        var zoom = d3.zoom()
          .on("zoom", zoomed);

        svg.call(zoom);
      }
    });
  }

  appendTitle(svg)

  //render the chart
  return chart;
}


function zoomed() {
  const transform = d3.event.transform;
  const x = transform.x;
  const y = transform.y;
  const k = transform.k;
  circles.transition().duration(100)
    .attr("transform", `translate(${x},${y}) scale(${k})`)
    .attr("r", k < 4 ? 5 - k + 0.1 : 5/k)
    .attr("stroke-width", k < 2 ? .75 : 0);

  chartWrapper.transition().duration(100)
    .attr("transform", `translate(${x},${y}) scale(${k})`)
    .attr("stroke-width", k < 2 ? 2 : 0.0001);
}

function drawCircles(svg, workshops, projection, tooltipDiv, chartWrapper){
  circles = svg.selectAll("circle")
    .data(workshops)
    .enter().append("circle")
      .attr("class", "symbol")
      .attr("cx", d => projection([d.longitude, d.latitude])[0])
      .attr("cy", d => projection([d.longitude, d.latitude])[1])
      .attr("r", d => 5)
      .on("mouseover", function(d) {
        var html = `${d.city}<br/>`;
        //if (d["number (2013?)"]) { html += `${d["number (2013?)"]} Workshop`; }
        //if (+d["number (2013?)"] > 1) { html += "s"; }
        tooltipDiv.html(html);
        tooltipDiv.style("opacity", 0);
        tooltipDiv.attr("class", "tooltip");
        var width = +tooltipDiv.style("width").slice(0, -2);
        var height = +tooltipDiv.style("height").slice(0, -2);
        tooltipDiv.style("left", `${d3.event.pageX - (width / 2)}px`);
        tooltipDiv.style("top", `${d3.event.pageY - height - 20}px`);
        tooltipDiv.style("opacity",1);
        // console.log(`City: ${d.city}, # of Workshops: ${d["number (2013?)"]}`);
      })
      .on("mouseout", d => {
        tooltipDiv.attr("class", "tooltip hide");
      });
      return circles
}

function responsivefy(svg) {
  // get container + svg aspect ratio
  container = d3.select(svg.node().parentNode),
  width = parseInt(svg.style("width")),
  height = parseInt(svg.style("height")),
  aspect = width / height;

  svg.attr("viewBox", "0 0 " + width + " " + height)
    .attr("perserveAspectRatio", "xMinYMid")
    .call(resize);

  d3.select(window).on("resize", resize);

  // get width of container and resize svg to fit it
  function resize() {
    containerWidth = parseInt(container.style("width"));
    var targetWidth = containerWidth?containerWidth:parseInt(svg.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
};

function appendTitle(svg){
  var padding = 100
  svg.append("text")
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .attr("transform", "translate("+ (width/2) +","+(height-(padding/10))+")")
  .text("Bridge Foundry workshop locations");
}


