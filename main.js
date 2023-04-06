// Declaire variables
const svgH = 800;
const svgW = 1000;
const margin = 60;
const yMax = svgH - margin;
const xMax = svgW - margin;


// Append objects to page
const tooltip = d3
.select('body')
.append('div')
 .attr('id', 'tooltip')
  .style('opacity', 0);
  

const app = d3
.select('body')
.append('svg')
.attr('width', svgW + margin)
.attr('height', svgH)
.attr('id', 'title');

// Get data set
let dataset = [];

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(response => response.json())
.then(data => {
  dataset = data.data;  
  // Get years
  let years = dataset.map(function(item){
  let quarter = '';
  let str = item[0].substring(5, 7);
  if(str == '01') {
    quarter = 'Q1';
  } else if(str == '04') {
    quarter = 'Q2';
  } else if(str == '07') {
    quarter = 'Q3';
  } else if(str == '10') {
    quarter = 'Q4';
  }
    return item[0].substring(0,4) + " " + quarter;
  });
  
  let yearDate = dataset.map(function(item){
    return new Date(item[0]);
  });
  let GDP = dataset.map(function(item){
    return item[1];
  });  
  
// Get domain from dataset
const ydmin = d3.min(GDP);
const ydmax = d3.max(GDP);
const xdmin = new Date (d3.min(yearDate));
const xdmax = new Date (d3.max(yearDate));
 
 // Scale GDP for data input
  const GDPScale = d3.scaleLinear().
  domain([0, ydmax]).
  range([0, yMax]);
  let scaledGDP = GDP.map(function(item){
    return GDPScale(item);
  });
  
// Set x and y scale  
const xScale = d3.scaleTime()
  .domain([xdmin, xdmax])
  .range([0, xMax]);
const yScale = d3.scaleLinear()
  .domain([0, ydmax])
  .range([yMax, 0]);

// Set X axis
app.append('g')
  .attr('transform', "translate("+margin+","+ yMax+")")
  .attr('id', 'x-axis')
  .call(d3.axisBottom(xScale));

// Set Y axis
app.append('g')
  .attr('transform', "translate("+ margin+",0)")
  .attr('id', 'y-axis')
  .call(d3.axisLeft(yScale));

// Add bars
app.selectAll('rect')
.data(scaledGDP)
.enter()
.append('rect')
.attr('x', (d,i) => xScale(yearDate[i]))
.attr('y', (d) => yMax - d)
.attr('width', 3)
.attr('height', (d) => d)
.attr('class', 'bar')
  .attr('index', (d, i) => i)
  .attr('data-date', (d,i) => dataset[i][0])
  .attr('data-gdp', (d,i) => dataset[i][1])
  .attr('transform', 'translate('+margin+',0)')
  .on('mouseover', function (event, d) { 
 const i = this.getAttribute('index');  tooltip.transition().duration(200).style('opacity', 0.9);
  tooltip.html(years[i] + ' - $' + GDP[i] + '    Billions')
          .attr('data-date', dataset[i][0])
          .style('left', i * 3 + 30 + 'px')
          .style('top', yMax - d/2 + 'px')   .style('transform','translateX('+margin+'px)');
})
.on('mouseout', function () { tooltip.transition().duration(200).style('opacity', 0);
      });
});
