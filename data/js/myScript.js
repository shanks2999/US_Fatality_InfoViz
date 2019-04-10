var svg = d3.select("svg");

var path = d3.geoPath();

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
    if (error) throw error;

    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path);

    svg.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
});
console.log("EE");

// d3.csv('SlateGunDeaths.csv')
//     .then(function(data) {
//         // for (var i = 0; i < data.length; i++) {
//         // console.log(data[i].name);
//         // console.log(data[i].age);
//         // }
//     })
// d3.csv("SlateGunDeaths.csv", function(data) {
//     // for (var i = 0; i < data.length; i++) {
//     //     console.log(data[i].name);
//     //     console.log(data[i].age);
//     //
//     // }
//     count += 1
//     console.log(data[0]);
//     console.log("LL");
// });



// var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
//     height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
//
// var svg = d3.select("body")
//     .append("svg")
//     .style("cursor", "move");

// svg.attr("viewBox", "50 10 " + width + " " + height)
//     .attr("preserveAspectRatio", "xMinYMin");
//
// var zoom = d3.zoom()
//     .on("zoom", function () {
//         var transform = d3.zoomTransform(this);
//         map.attr("transform", transform);
//     });
//
// svg.call(zoom);
//
// var map = svg.append("g")
//     .attr("class", "map");
//
//
// var files = ["data/res/50m.json", "data/res/population.json"];
// var promises = [];
//
// files.forEach(function(url) {
//     promises.push(d3.json(url))
// });
//
// Promise.all(promises).then(function(values) {
//     // console.log(values)
//     drawMap(values[0], values[1]);
// });

// d3.queue()
//     .defer(d3.json, "data/res/50m.json")
//     .defer(d3.json, "data/res/population.json")
//     .await(function (error, world, data) {
//         if (error) {
//             console.error('Oh dear, something went wrong: ' + error);
//         }
//         else {
//             drawMap(world, data);
//         }
//     });

// function drawMap(world, data) {
//     // geoMercator projection
//     var projection = d3.geoMercator() //d3.geoOrthographic()
//         .scale(130)
//         .translate([width / 2, height / 1.5]);
//
//     // geoPath projection
//     var path = d3.geoPath().projection(projection);
//
//     //colors for population metrics
//     var color = d3.scaleThreshold()
//         .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
//         .range(["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]);
//
//     var features = topojson.feature(world, world.objects.countries).features;
//     var populationById = {};

    // data.forEach(function (d) {
    //     populationById[d.country] = {
    //         total: +d.total,
    //         females: +d.females,
    //         males: +d.males
    //     }
    // });
    // features.forEach(function (d) {
    //     d.details = populationById[d.properties.name] ? populationById[d.properties.name] : {};
    // });

    // map.append("g")
    //     .selectAll("path")
    //     .data(features)
    //     .enter().append("path")
    //     .attr('d', path)
    //     .attr('vector-effect', 'non-scaling-stroke')
    //     .style('fill', fillFn)
        // .attr("name", function (d) {
        //     return d.properties.name;
        // })
        // .attr("id", function (d) {
        //     return d.id;
        // })
        // .attr("d", path)
        // .style("fill", function (d) {
        //     return d.details && d.details.total ? color(d.details.total) : undefined;
        // })
        // .on('mouseover', function (d) {
        //     d3.select(this)
        //         .style("stroke", "white")
        //         .style("stroke-width", 1)
        //         .style("cursor", "pointer");
        //
        //     d3.select(".country")
        //         .text(d.properties.name);
        //
        //     d3.select(".females")
        //         .text(d.details && d.details.females && "Female " + d.details.females || "¯\\_(ツ)_/¯");
        //
        //     d3.select(".males")
        //         .text(d.details && d.details.males && "Male " + d.details.males || "¯\\_(ツ)_/¯");
        //
        //     d3.select('.details')
        //         .style('visibility', "visible")
        // })
        // .on('mouseout', function (d) {
        //     d3.select(this)
        //         .style("stroke", null)
        //         .style("stroke-width", 0.25);
        //
        //     d3.select('.details')
        //         .style('visibility', "hidden");
        // });
// }
//
// //
// // var bardata = [20, 30, 105, 15, 85];
// //
// // var height = 400,
// //     width = 600,
// //     barWidth = 50,
// //     barOffset = 5;
// //
// // d3.select('#chart').append('svg')
// //     .attr('width', width)
// //     .attr('height', height)
// //     .style('background', '#C9D7D6')
// //     .selectAll('rect').data(bardata)
// //     .enter().append('rect')
// //     .style('fill', '#C61C6F')
// //     .attr('width', barWidth)
// //     .attr('height', function(d) {
// //         return d;
// //     })
// //     .attr('x', function(d,i) {
// //         return i * (barWidth + barOffset);
// //     })
// //     .attr('y', function(d) {
// //         return height - d;
// //     })
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// //
// // $(document).ready(function(){
// //     $("#one").click(function(){
// //         $("#myFrame").attr('src','data/home.html');
// //     });
// //     $("#two").click(function(){
// //         $("#myFrame").attr('src','data/data.html');
// //     });
// //     $("#three").click(function(){
// //         $("#myFrame").attr('src','data/svg.html');
// //     });
// //     $("#four").click(function(){
// //         $("#myFrame").attr('src','data/credits.html');
// //     });
// // });
// //
// // var sign = 1;
// // function start(){
// //     setInterval(animateCircle, 20);
// //     sign = 1;
// //     setInterval(animateRectangle, 10);
// // }
// // function changeDirection(){
// //     if(sign>0)
// //         sign = -1;
// //     else if(sign<0)
// //         sign = 1;
// // }
// //
// // function animateRectangle() {
// //     var rectangle = document.getElementById("rec");
// //     var x = rectangle.getAttribute("x");
// //     var newX = parseInt(x);
// //
// //     if(sign > 0) {
// //         newX = parseInt(x) + 1;
// //         if (newX > 500) {
// //             newX = -70;
// //         }
// //     }
// //     else if(sign<0){
// //         newX = parseInt(x) - 1;
// //         if (newX < -70) {
// //             newX = 500;
// //         }
// //     }
// //     rectangle.setAttribute("x", newX);
// // }
// //
// // function changeColor() {
// //     var col = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
// //     var svgElement = document.getElementById("poly");
// //     svgElement.style.fill = col;
// // }
// // function increaseCircleSpeed() {
// //     setInterval(animateCircle, 20);
// // }
// // function animateCircle() {
// //     var circle = document.getElementById("cir");
// //     var x = circle.getAttribute("cx");
// //     var y = circle.getAttribute("cy");
// //     var newX = parseInt(x);
// //     var newY = parseInt(y);
// //     if(x<=460 && y<=40){
// //         newX = parseInt(x) + 1;
// //         circle.setAttribute("cx", newX);}
// //     else if(x>460 && y<=460){
// //         newY = parseInt(y) + 1;
// //         circle.setAttribute("cy", newY);}
// //     else if(y>460 && x>=40){
// //         newX = parseInt(x) - 1;
// //         circle.setAttribute("cx", newX);}
// //     else if(x<40){
// //         newY = parseInt(y) - 1;
// //         circle.setAttribute("cy", newY);}
// // }