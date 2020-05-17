import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from 'src/app/data/data.model';


@Component({
  selector: 'app-line-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class BarChartComponent implements OnChanges {
  @ViewChild('chart')

  @Input()
  data: DataModel[];
  selectboxData : any=[];

  margin = {top: 20, right: 20, bottom: 30, left: 40};

  constructor() {}

  ngOnChanges(): void {
    if (!this.data) { return; }
    this.selectboxData = [];
    this.renderSelectbox();
  }

  private renderSelectbox(): void{
    let records = this.data[0];
    for (let key in records) {
      if(key !== 'date')
        this.selectboxData.push(key);
    }
  }

  private updateChart(e): void{
    let DOMSVG = document.querySelector("svg");
    if(DOMSVG){
      document.querySelector("svg").remove();
    }
    if(e.target.value !== '0'){
      this.createChart(e.target.value);
    }
  }

  private createChart(sortBy): void {
    var margin = { top: 50, right: 50, bottom: 50, left: 30 }
      , width = window.innerWidth - margin.left - margin.right  // Use the window's width 
      , height = window.innerHeight - margin.top - margin.bottom; // Use the window's height


     // number of datapoints
     var n = this.data.length;
      
     //  X scale will use the index of our data
     var xScale = d3.scaleLinear()
       .domain([0, n - 1]) // input
       .range([0, width]); // output

     //  Y scale will use the generate number based on domain
     var yScale = d3.scaleLinear()
       .domain([0, 5]) // input 
       .range([height, 0]); // output 

     //  d3's line generator
     var line = d3.line()
       .x(function (d, i) { return xScale(i); }) // set the x values for the line generator
       .y(function (d: any) { return yScale(d[sortBy]); }) // set the y values for the line generator 

     
     var svg = d3.select("body").append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     //  Call the x axis in a group tag
     svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

     //  Call the y axis in a group tag
     svg.append("g")
       .attr("class", "y axis")
       .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

     // Append the path, bind the data, and call the line generator 
     svg.append("path")
       .datum(this.data) // Binds data to the line 
       .attr("class", "line") // Assign a class for styling 
       .attr("d", line); //  Calls the line generator 

     // Appends a circle for each datapoint 
     svg.selectAll(".dot")
       .data(this.data)
       .enter().append("circle") // Uses the enter().append() method
       .attr("class", "dot") // Assign a class for styling
       .attr("cx", function (d, i) { return xScale(i) })
       .attr("cy", function (d: any) { return yScale(d[sortBy]) })
       .attr("r", 5)
  }

}
