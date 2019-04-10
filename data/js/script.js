var usStates = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    // "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}
/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web"
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html

Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart Legend
http://bl.ocks.org/mbostock/3888852  */


var width = 1000;
var height = 500;
active = d3.select(null);
var projection = d3.geoAlbersUsa() // updated for d3 v4
    .scale(1000)
    .translate([width / 2, height / 2]);



var path = d3.geoPath()
    .projection(projection);


var color = d3.scaleLinear()
    .range(["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);

var legendText = ["0-250 Victims", "251-500 Victims", "501-750 Victims", "751-1000 Victims", "1000+ Victims"];

//Create SVG element and append map to the SVG


// Append Div for tooltip to SVG


// Load in my states data!
d3.csv("data/res/SlateGunDeaths.csv", function(data) {
// d3.csv("data/res/stateslived.csv").then(function(data) {
    color.domain([0,1,2,3,4]); // setting the range of the input data

// Load GeoJSON data and merge with states data
    d3.json("data/res/USA.json", function(json) {
// Loop through each state data value in the .csv file

        var stateKills = []
        var cityKills = []
        for (var i = 0; i < data.length; i++) {
            var foundFlag = false;
            // if ((data[i].state in usStates) && (usStates[data[i].state] in stateKills) == false)
            //     stateKills[usStates[data[i].state]] = 0;
            // stateKills[usStates[data[i].state]] += 1;
            if (data[i].state in usStates) {
                foundFlag = false;
                for (var j = 0; j < stateKills.length; j++) {
                    if (stateKills[j].state == usStates[data[i].state]) {
                        stateKills[j].count += 1
                        if(!isNaN(data[i].age) && parseInt(data[i].age) > 0) {
                            stateKills[j].avgAge += parseInt(data[i].age);
                            stateKills[j].avgAge /= 2;
                        }
                        if(data[i].gender == 'M')
                            stateKills[j].maleCount += 1
                        else if(data[i].gender == 'F')
                            stateKills[j].femaleCount += 1
                        foundFlag = true;
                        break;
                    }
                }
                if (foundFlag == false) {
                    var tempState = {state: usStates[data[i].state], count: 1, maleCount: 1, femaleCount: 1, avgAge:(isNaN(data[i].age)?0:parseInt(data[i].age))};
                    if(data[i].gender == 'M')
                        tempState.femaleCount = 0
                    else if(data[i].gender == 'F')
                        tempState.femaleCount = 0
                    stateKills.push(tempState)
                }
            }



            foundFlag = false;
            if (!isNaN(parseFloat(data[i].lat)) && !isNaN(parseFloat(data[i].lng))) {

                for (var j = 0; j < cityKills.length; j++) {
                    if (cityKills[j].city == data[i].city) {
                        cityKills[j].count += 1
                        if(data[i].name.length>0 && parseInt(data[i].ageGroup) >= 0  && parseInt(data[i].ageGroup) <=3) {
                            cityKills[j].names.push(data[i].name)
                            cityKills[j].ageGroup.push(data[i].ageGroup)
                            cityKills[j].ages.push((parseInt(data[i].age) >= 1  && parseInt(data[i].age) <=100)?data[i].age:"N/A")
                            cityKills[j].gender.push(data[i].gender.length==1 ?data[i].gender:"N/A")
                        }
                        if(!isNaN(data[i].age)) {
                            cityKills[j].avgAge += data[i].age;
                            cityKills[j].avgAge /= 2;
                        }
                        if(data[i].gender == 'M')
                            cityKills[j].maleCount += 1
                        else if(data[i].gender == 'F')
                            cityKills[j].femaleCount += 1

                        foundFlag = true;
                        break;
                    }
                }
                if (foundFlag == false) {
                    var tempCity = {state:usStates[data[i].state], city: data[i].city, count: 1, maleCount: 1, femaleCount: 1, lat: data[i].lat, long: data[i].lng, avgAge:(isNaN(data[i].age)?0:data[i].age),
                        names:(data[i].name.length>0 && parseInt(data[i].ageGroup) >= 0  && parseInt(data[i].ageGroup) <=3)?[data[i].name]:[],
                        ageGroup:(data[i].name.length>0 && parseInt(data[i].ageGroup) >= 0  && parseInt(data[i].ageGroup) <=3)?[data[i].ageGroup]:[],
                        ages:(parseInt(data[i].age) >= 1  && parseInt(data[i].age) <=100)?[data[i].age]:["N/A"],
                        gender:data[i].gender.length==1 ?[data[i].gender]:["N/A"]};
                    if(data[i].gender == 'M')
                        tempCity.femaleCount = 0
                    else if(data[i].gender == 'F')
                        tempCity.femaleCount = 0
                    cityKills.push(tempCity)
                }
            }
        }
        for (var j = 0; j < stateKills.length; j++) {
            stateKills[j].count = stateKills[j].maleCount + stateKills[j].femaleCount;
        }
        var stateMax = Object.keys(stateKills).reduce(function(m, k){ return stateKills[k].count > m ? stateKills[k].count : m }, -Infinity);
        var stateMin = Object.keys(stateKills).reduce(function(m, k){ return stateKills[k].count < m ? stateKills[k].count : m }, Infinity);
        var cityMax = Object.keys(cityKills).reduce(function(m, k){ return cityKills[k].count > m ? cityKills[k].count : m }, -Infinity);
        var cityMin = Object.keys(cityKills).reduce(function(m, k){ return cityKills[k].count < m ? cityKills[k].count : m }, Infinity);
        console.log(stateKills)
        console.log(cityKills)
        console.log(stateMax)
        console.log(stateMin)
        console.log(cityMax)
        console.log(cityMin)
        // for (var i = 0; i < json.features.length; i++)  {
        //     var jsonState = json.features[i].properties.name;
        //     for(var j=0;j<stateKills.length;j++) {
        //         if(jsonState == stateKills[j].state) {
        //             json.features[i].properties.killCount = stateKills[j].count;
        //             break;
        //         }
        //     }
        // }

        zoom = d3.zoom()
        // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
        // .translate([0, 0])
        // .scale(1)
            .scaleExtent([1, 8])
            .on("zoom", zoomed);
        var zoom, svg , g, legend, stateText;
        createMyMap()
        function createMyMap() {
            d3.selectAll("#myMap").remove();
            d3.selectAll("#tooltip").remove();
            d3.selectAll("#legendMap").remove();


            svg = d3.select("#main")
                .append("svg")
                .attr("id", "myMap")
                .attr("class", "initialSVG")
                .attr("width", width)
                .attr("height", height)
                .on("click", stopped, true);


            svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "#bdbdbd")
                .on("click", reset);

            g = svg.append("g");

            var div = d3.select("#main")
                .append("div")
                .attr("id", "tooltip")
                .attr("class", "tooltip")
                .style("opacity", 0);
            svg
                .call(zoom); // delete this line to disable free zooming
// .call(zoom.event); // not in d3 v4

            g.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", "feature")
                .style("stroke", "#000000")
                .style("stroke-width", "1")
                .style("fill", function (d) {

                    // Get data value
                    // var value = d.properties.killCount;
                    var value;
                    for(var i=0;i<stateKills.length;i++)
                    {
                        if(d.properties.name == stateKills[i].state) {
                            value = stateKills[i].count;
                            break;
                        }
                    }


                    if (value) {
                        if (value >= 0 && value <= 250)
                            return color(0);
                        else if (value >= 251 && value <= 500)
                            return color(1);
                        else if (value >= 501 && value <= 750)
                            return color(2);
                        else if (value >= 751 && value <= 1000)
                            return color(3);
                        else if (value >= 1001)
                            return color(4);
                        // var normalized = ((8-0)*((value-stateMin)/(stateMax-stateMin))) + 0;

                    } else {
                        return "#d5ded9";
                    }
                })
                .on("click", clicked);

            stateText = g.selectAll("text")
                .data(json.features)
                .enter()
                .append('text')
                .attr("x", function (d) {
                    c = path.centroid(d)[0];
                    if (c)
                        return c
                })
                .attr("y", function (d) {
                    c = path.centroid(d)[1];
                    if (c)
                        return c
                })
                .style("fill", "#000000")
                .style("pointer-events", "none")
                .text(function (d) {
                    for (var key in usStates) {
                        if (usStates[key] == d.properties.name)
                            return key
                    }
                });

            g.selectAll("circle")
                .data(cityKills)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return projection([d.long, d.lat])[0];
                })
                .attr("cy", function (d) {
                    return projection([d.long, d.lat])[1];
                })

                .attr("r", function (d) {
                    // var size = (d.count/cityMax)*5
                    var normalized = ((10 - 1) * ((d.count - cityMin) / (cityMax - cityMin))) + 1;
                    // return Math.sqrt(d.years) * 4;
                    return normalized
                })
                .style("fill", "rgb(217,91,67)")
                .style("opacity", 0.85)

                // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
                // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.text(" "+d.city + " | " + "M: "+ d.maleCount +" | F: "+d.femaleCount +" ")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })

                // fade out tooltip on mouse out
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function (d) {
                    createMyLinks(d)
                    d3.select('.thirdSVG')
                        .style('visibility', "visible")
                });


// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
            legend = d3.select("#main").append("svg")
                .attr("id", "legendMap")
                .attr("class", "legend")
                .attr("width", 140)
                .attr("height", 200)
                .selectAll("g")
                .data(color.domain())
                .enter()
                .append("g")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .data(legendText)
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function (d) {
                    return d;
                });

        }

        function createMyLinks(d) {
            // Force Link START

            d3.select("#myLinks").remove();
            // d3.select("#myPie").remove();
            // d3.selectAll("#tooltipDonut").remove();
            var lw=800, lh=400;
            var linkSvg = d3.select("#main")
                .append("div")
                .attr("id", "myLinks")
                .append("svg")
                .attr("class", "thirdSVG")
                .attr('width', lw)
                .attr('height', lh)
            var borderPath = linkSvg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", lw)
                .attr("width", lw)
                .style("stroke", 'black')
                .style("fill", "#cccccc")
                .style("stroke-width", 1)
            var myNodes=[], myLinks=[];

            for(var i=0;i<d.names.length;i++) {
                myNodes.push({id:(i+4),name:d.names[i], ageGroup:d.ageGroup[i], age:d.ages[i], gender:d.gender[i]});
                myLinks.push({source: (i+4), target: d.ageGroup[i]});
            }
            myNodes.push({id:"0", name:"0", ageGroup:"0"});
            myNodes.push({id:"1", name:"1", ageGroup:"1"});
            myNodes.push({id:"2", name:"2", ageGroup:"2"});
            myNodes.push({id:"3", name:"3", ageGroup:"3"});
            myLinks.push({source:"0", target:"1"});
            myLinks.push({source:"1", target:"2"});
            myLinks.push({source:"2", target:"3"});
            // myLinks.push({source:"3", target:"0"});

            // var clr = d3.scaleOrdinal(d3.schemeCategory20);
            var clr = d3.scaleOrdinal()
                .range(["#d7191c", "#fdae61", "#abd9e9", "#2c7bb6","#000000"])

            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(100).strength(0.5))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(lw / 2, lh / 2));



            var link = linkSvg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(myLinks)
                .enter().append("line")
                .attr("stroke-width", 1);

            var node = linkSvg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(myNodes)
                .enter().append("circle")
                .attr("r", 5)
                .attr("fill", function(d) { return (d.name.length>1)?clr(d.ageGroup):4; })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            node.append("title")
                .text(function(d) {
                    if(d.name == 0)
                        return "Age Group 0";
                    if(d.name == 1)
                        return "Age Group 1";
                    if(d.name == 2)
                        return "Age Group 2";
                    if(d.name == 3)
                        return "Age Group 3";
                    else {
                        var text = d.name+" | " +d.age+" | " +d.gender;
                        return text
                    } })
                .style("pointer-events", "none")
                .attr('font-size', 15);
            // const textElements = linkSvg.append('g')
            //     .selectAll('text')
            //     .data(myNodes)
            //     .enter().append('text')
            //     .text(node => node.id)
            //     .style("pointer-events", "none")
            //     .attr('font-size', 15)
            //     .attr('dx', 15)
            //     .attr('dy', 4)

            simulation
                .nodes(myNodes)
                .on("tick", ticked);

            simulation.force("link")
                .links(myLinks);

            function ticked() {
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node
                    .attr("cx", function(d) { return d.x = Math.max(5, Math.min(lw - 5, d.x)); })
                    .attr("cy", function(d) { return d.y = Math.max(5, Math.min(lh - 5, d.y)); });
                // node
                //     .attr("transform", function(d) {
                //         return "translate(" + d.x + "," + d.y + ")";
                //     })
                // textElements
                //     .attr("x", function(d) { return d.x; })
                //     .attr("y", function(d) { return d.y; })
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
            d3.select('#myLinks').append("div")
                .attr("class","forceDirectedText")
                .text("Force Directed Graph showing individual casualty batched via age groups in \""+d.city+"\", \""+d.state+"\". Hover over individual nodes to know more.")
            //Force Link END
        }

    function createMyPie(stateName) {

        //PIE START
        // d3.selectAll("svg > *").remove();
        d3.select("#myLinks").remove();
        d3.select("#myPie").remove();
        d3.selectAll("#tooltipDonut").remove();
        // d3.select("#divPie").remove();
        // var divPie = d3.select("body")
        //     .append("div")
        //     .attr("id", "divPie")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);

        var s, c, m ,f;
        for(var i=0;i<stateKills.length;i++) {
            if(stateName == stateKills[i].state)
            {
                s=stateKills[i].state;
                c=stateKills[i].count;
                m=stateKills[i].maleCount;
                f=stateKills[i].femaleCount;
            }
        }
        var mydata = [Math.round((m/(m+f))*100), Math.round((f/(m+f))*100)]


        var pw = 360,
            ph = 360,
            pr = Math.min(pw, ph) / 2;

        var clr = d3.scaleOrdinal()
            .range(["#ef8a62", "#807dba"])

        var tooltipDonut = d3.select('#main')
            .append('div')
            .attr('class', 'tooltipDonut')
            .attr("id", "tooltipDonut");


        tooltipDonut.append('div')
            .attr('class', 'label');

        tooltipDonut.append('div')
            .attr('class', 'count');

        tooltipDonut.append('div')
            .attr('class', 'percent');
        var s = d3.select("#main")
            .append("div")
            .attr("id", "myPie")
            .append("svg")
            .attr("class", "secondSVG")
            .attr('width', pw)
            .attr('height', ph)
            .append('g')
            .attr('transform', 'translate(' + (pw / 2) +
                ',' + (ph / 2) + ')');

        var donutWidth = 75;

        var arc = d3.arc()
            .innerRadius(pr - donutWidth)
            .outerRadius(pr);

        var pie = d3.pie()
            .value(function(d) { return d; })
            .sort(null);

        var legendRectSize = 18;
        var legendSpacing = 4;
        var pathDonut = s.selectAll('path')
            .data(pie(mydata))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return clr(i);
            });

        pathDonut.on('mouseover', function(d,i) {
            tooltipDonut.select('.label').html((i==0)?"Male: "+m : "Female: "+f);
            tooltipDonut.select('.count').html("Total: " + c);
            tooltipDonut.select('.percent').html(mydata[i] + '%');
            tooltipDonut.style("opacity", .9)
                // .style("left", 140 + "px")
                // .style("top", 900 + "px")
        });

        pathDonut.on('mouseout', function() {
            tooltipDonut.style("opacity", 0)
        });

        var legendDonut = s.selectAll('.legendDonut')
            .data(clr.domain())
            .enter()
            .append('g')
            .attr('class', 'legendDonut')
            .attr('transform', function(d, i) {
                var h = legendRectSize + legendSpacing;
                var offset =  h * clr.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * h - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legendDonut.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', clr)
            .style('stroke', clr);
        legendDonut.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d,i) { return (i==0)?"Male":"Female"; });

        d3.select('#myPie').append("div")
            .attr("class","pieText")
            .text("Donut chart showing Male-Female casualties ratio for \""+ stateName+"\"")
    }



        function clicked(d) {
            if (active.node() === this) return reset();
            active.classed("active", false);
            active = d3.select(this).classed("active", true);

            var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
                translate = [width / 2 - scale * x, height / 2 - scale * y];
            svg.transition()
                .duration(750)
                // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
                .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4

            var c, m, f, a, cityCount=0, min=cityMax, max=cityMin, mostNotorious="", leastNotorious="";
            for(var i=0;i<stateKills.length;i++){
                if(stateKills[i].state == d.properties.name)  {
                    c = stateKills[i].count;
                    m = stateKills[i].maleCount;
                    f = stateKills[i].femaleCount;
                    a = stateKills[i].avgAge;
                    break;
                }
            }
            for(var i=0;i<cityKills.length;i++){
                if(cityKills[i].state == d.properties.name)  {
                    cityCount++;
                    if(min > cityKills[i].count) {
                        min = cityKills[i].count;
                        leastNotorious = cityKills[i].city;
                    }
                    if(max < cityKills[i].count) {
                        max = cityKills[i].count;
                        mostNotorious = cityKills[i].city;
                    }
                }
            }
            d3.select(this)
                .style("stroke", "white")
                .style("stroke-width", 2.5)
                .style("cursor", "pointer");

            $(".country").html(d.properties.name);
            $("#deathCount").html(c);
            $("#txtMale").val(m);
            $("#txtFemale").val(f);
            $("#meanAge").html(Math.round(a));
            $("#cityCount").html(cityCount);
            $("#maxNotoriety").html(mostNotorious);
            $("#minNotoriety").html(leastNotorious);
            // d3.select(".country")
            //     .text(d.properties.name);
            //
            // d3.select("#deathCount")
            //     .text(c);
            //
            // d3.select("#txtMale")
            //     .attr("value", m);
            //
            // d3.select("#txtFemale")
            //     .attr("value", f);

            d3.select('.details')
                .style('visibility', "visible")

            createMyPie(d.properties.name);
            d3.select('.secondSVG')
                .style('visibility', "visible")


        }

        function reset() {
            active.classed("active", false);
            active = d3.select(null);

            svg.transition()
                .duration(750)
                // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
                .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4

            d3.select('.details')
                .style('visibility', "hidden");

            d3.select('.secondSVG')
                .style('visibility', "hidden")

            d3.select("#myLinks").remove();
            d3.select("#myPie").remove();
            d3.selectAll("#tooltipDonut").remove();
        }

        function zoomed() {
            g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
            // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
            g.attr("transform", d3.event.transform); // updated for d3 v4
        }

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
        function stopped() {
            if (d3.event.defaultPrevented) d3.event.stopPropagation();
            // d3.select(this)
            //     .style("stroke", null)
            //     .style("stroke", "#000000")
            //     .style("stroke-width", 0.25);
            d3.selectAll("path")
                .style("stroke", "#000000")
                .style("stroke-width", 1)

            // d3.select('.details')
            //     .style('visibility', "hidden");
            //
            // d3.select('.secondSVG')
            //     .style('visibility', "hidden")
            //
            // d3.select("#myLinks").remove();
            // d3.select("#myPie").remove();
            // d3.selectAll("#tooltipDonut").remove();
    }
        $(document).ready(function(){
            $('#btnMale, #btnFemale').on('click', function() {
            if($(this).text() == "Save") {
                $(this).html("Edit");
                if(this.id == "btnMale")
                    $("#txtMale").attr("disabled", "disabled");
                if(this.id == "btnFemale")
                    $("#txtFemale").attr("disabled", "disabled");
                var m, f, c, s;
                s = $(".country").text();
                m=parseInt($("#txtMale").val());
                f=parseInt($("#txtFemale").val());
                c=m+f
                $("#deathCount").html(c);
                for(var i=0;i<stateKills.length;i++) {
                    if(stateKills[i].state == s) {
                        stateKills[i].count = c;
                        stateKills[i].maleCount = m;
                        stateKills[i].femaleCount = f;
                        break;
                    }
                }
                createMyMap();
                createMyPie(s);
                d3.select('.secondSVG')
                    .style('visibility', "visible")
            }
            else if($(this).text() == "Edit") {
                $(this).html("Save");
                if(this.id == "btnMale")
                    $("#txtMale").removeAttr("disabled");
                if(this.id == "btnFemale")
                    $("#txtFemale").removeAttr("disabled");

            }
        });});
    });

});
