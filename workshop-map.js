function workshopMap() {
  var width = 960,
      height = 450;
  function chart(selection) {
    selection.each(function(data) {

      var projection = d3.geoMercator();

      var path = d3.geoPath()
          .projection(projection);


      var svg = d3.select(this).append("svg")
          .attr("width", width)
          .attr("height", height);

      var tooltipDiv = d3.select("body").append("div")
          .attr("class", "tooltip hide")

      // source: https://docs.google.com/spreadsheet/pub?key=0AjPWVMj9wWa6dDJOVE5DVTRxbjc2Vy1PMVlQTlh4eFE&single=true&gid=0&output=csv
      // google spreadsheets no longer allows cross-domain access
      d3.queue()
          .defer(d3.json, "http://bridgefoundry.org/workshop-map/data/world-50m.json")
          .defer(d3.csv, "http://bridgefoundry.org/workshop-map/data/workshop-data.csv")
          .await(ready);

      // load and display the World
      function ready(error, world, workshops) {
        if (error) return console.log("there was an error loading the data: " + error);
        var zoom,
            circles;

        const g = svg.append("g");

        g.append("path")
            .datum(topojson.feature(world, world.objects.countries))
            .attr("d", path);



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
                console.log(`City: ${d.city}, # of Workshops: ${d["number (2013?)"]}`);
              })
              .on("mouseout", d => {
                tooltipDiv.attr("class", "tooltip hide");
                g.select("path").node().focus();
              });

        zoom = d3.zoom().on("zoom", zoomed)
        function zoomed(d) {
          const transform = d3.event.transform;
          const x = transform.x;
          const y = transform.y;
          const k = transform.k;
          circles.transition().duration(100)
            .attr("transform", `translate(${x},${y}) scale(${k})`)
            .attr("r", k < 4 ? 5 - k + 0.1 : 5/k)
            .attr("stroke-width", k < 2 ? .75 : 0);

          g.transition().duration(100)
            .attr("transform", `translate(${x},${y}) scale(${k})`)
            .attr("stroke-width", k < 2 ? 2 : 0.0001);
        }

        g.select("path").node().focus();
        svg.call(zoom);
      }
    });
  }
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  return chart;
}