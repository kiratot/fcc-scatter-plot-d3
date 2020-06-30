const URL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const margin = { top: 30, right: 30, bottom: 35, left: 60 };
const h = 500 - (margin.top + margin.bottom);
const w = 800 - (margin.left + margin.right);
const formatTimeToYear = d3.timeFormat("%Y");
const formatSeconds = d3.timeFormat("%M:%S");
const formatGDP = d3.format("$,.5r");
const svg = d3
  .select("svg")
  .attr("height", h + margin.top + margin.bottom)
  .attr("width", w + margin.left + margin.right)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
fetch(URL)
  .then((response) => response.json())
  .then((data) => {
    parseData(data);
    console.log(data);
  });

const parseData = (data) => {
  const dataSeconds = data.map((d) => {
    const time = new Date();
    time.setTime(d.Seconds * 1000);
    return time;
  });
  const dotsData = dataSeconds.map((d, i) => ({
    seconds: d,
    year: data[i].Year,
    dopping: data[i].Doping !== "",
  }));
  console.log(dotsData);
  const xExtent = d3.extent(data, (d) => d.Year);
  const yExtent = d3.extent(dataSeconds, (d) => d);

  const xScale = d3.scaleLinear().domain([1993, xExtent[1]]).range([0, w]);
  const yScale = d3.scaleTime().domain(yExtent).range([0, h]);

  const xAxis = svg
    .append("g")
    .call(d3.axisBottom(xScale).tickFormat(d3.format(".4")))
    .attr("id", "x-axis")
    .attr("transform", `translate (0, ${h})`);
  const yAxis = svg
    .append("g")
    .call(d3.axisLeft(yScale).tickFormat(formatSeconds))
    .attr("id", "y-axis")
    .attr("transform", `translate (-1, 0)`);
  //a little bit of styling for our axes

  yAxis
    .selectAll("text")
    .style("fill", "var(--secondary)")
    .style("font-size", "0.9rem")
    .style("font-weight", "bold");
  yAxis.selectAll("line").style("stroke", "var(--secondary)");
  yAxis.select("path").style("stroke", "var(--secondary)");
  xAxis
    .selectAll("text")
    .style("fill", "var(--secondary)")
    .style("font-size", "0.9rem")
    .style("font-weight", "bold");
  xAxis.selectAll("line").style("stroke", "var(--secondary)");
  xAxis.select("path").style("stroke", "var(--secondary)");

  //adding text label for the y axis
  svg
    .append("text")
    .text("")
    .attr("class", "yaxis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(-50, ${h / 2}) rotate(-90)`);

  //creating the div for the tooltip
  const div = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  //selecting the svg and appending svg's circle elements with data mapping
  svg
    .selectAll("circle")
    .data(dotsData)
    .enter()
    .append("circle")
    .style("fill", "var(--main)")
    .style(
      "stroke",
      (d) => `${d.dopping ? "var(--legend1)" : "var(--legend2)"}`
    )
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.year)
    .attr("data-yvalue", (d) => d.seconds)
    .attr("cx", (d) => xScale(d.year))
    .attr("cy", (d) => yScale(d.seconds))
    .attr("r", 6);

  //tooltip
  svg
    .selectAll("circle")
    .data(data)
    .on("mouseover", (d) => {
      div.attr("data-year", d.Year).style("opacity", 0.9);
      div
        .html(
          `${d.Doping ? d.Doping : "No dopping allegations"} <br> ${d.Name} : ${
            d.Nationality
          } <br> ${d.Year}`
        )
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY}px`);
    })
    .on("mouseout", (d) => {
      div.style("opacity", 0);
    });
};
