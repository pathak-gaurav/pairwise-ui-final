import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PairwiseService} from "../../services/pairwise/pairwise.service";
import {Subscription} from "rxjs";

declare var google: any;

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('treemap') treemap: ElementRef;
  datatable: any[] = [];


  constructor(private pairwiseService: PairwiseService) {
  }

  ngOnDestroy() { // It's a good practice to unsubscribe to ensure no memory leaks
  }

  ngOnInit(): void {
    this.getTreeNodeList();
  }

  ngAfterViewInit() {
    this.datatable = [];
    this.datatable.push(['nodeName', 'parentName', 'value']);
    this.pairwiseService.getTreeNode().subscribe((res) => {
      res.forEach(el => {
        this.datatable.push([el.nodeName, el.parentName, el.value]);
      });
    });
    google.charts.load('current', {packages: ['treemap']});
    this.buildChart(this.datatable);
  }

  buildChart(datatable: any[]) {
    console.log('Datatable==>', this.datatable);
    var func = (chart: any) => {
      var data = google.visualization.arrayToDataTable(datatable);
      var optionsV49 = { // For v49 or before
        highlightOnMouseOver: true,
        maxDepth: 1,
        maxPostDepth: 2,
        minHighlightColor: '#8c6bb1',
        midHighlightColor: '#9ebcda',
        maxHighlightColor: '#edf8fb',
        minColor: '#009688',
        midColor: '#f7f7f7',
        maxColor: '#ee8100',
        headerHeight: 15,
        showScale: true,
        height: 500,
        useWeightedAverageForAggregation: true,
        generateTooltip:showStaticTooltip
      };
      var options = {
        title: 'Pairwise Nodes',
        legend: {position: 'top'},
        animation: {
          duration: 1000,
          easing: 'out',
        },
        enableHighlight: true,
        headerHeight: 20,
        showScale: true,
        is3D: true,
        height: 300,
        fontSize: 13,
        useWeightedAverageForAggregation: true,
        minColor: '#249cc0',
        midColor: '#009688',
        maxColor: '#04423b',
        fontColor: 'black',
        generateTooltip:showStaticTooltip,
        eventsConfig: {
          highlight: ['click'],
          unhighlight: ['mouseout'],
          rollup: ['contextmenu'],
          drilldown: ['dblclick'],
        }
      };

      function showStaticTooltip(row: any, size:any, value:any) {
        return '<div style="background:#fd9; padding:10px; border-style:solid">' +
          '<span style="font-family:Courier"><b>' + data.getValue(row, 0) +
          '</b>, ' + 'Parent: ' + data.getValue(row, 1) + ', ' + data.getValue(row, 2)
          + '</span><br>' + '</div>';
      }

      var optionsV50 = { // For v50+
        enableHighlight: true,
        maxDepth: 1,
        maxPostDepth: 2,
        minHighlightColor: '#8c6bb1',
        midHighlightColor: '#9ebcda',
        maxHighlightColor: '#edf8fb',
        minColor: '#275610',
        midColor: '#1332f5',
        maxColor: '#ee8100',
        headerHeight: 15,
        showScale: true,
        height: 300,
        useWeightedAverageForAggregation: true,
        // Use click to highlight and double-click to drill down.
        generateTooltip:showStaticTooltip
      };
      chart().draw(data, options);
    };
    var chart = () => new google.visualization.TreeMap(document.getElementById('chart_div'));
    var callback = () => func(chart);
    google.charts.setOnLoadCallback(callback);
  }

  getTreeNodeList(): void {
    this.ngOnInit();
    this.datatable = [];
    this.datatable.push(['nodeName', 'parentName', 'value']);
    this.pairwiseService.getTreeNode().subscribe((res) => {
      res.forEach(el => {
        this.datatable.push([el.nodeName, el.parentName, el.value]);
      });
      console.log('Res==>', res);
    });
    console.log('data==>', this.datatable);
    google.charts.load('current', {packages: ['treemap']});
    this.buildChart(this.datatable);
  }

}
