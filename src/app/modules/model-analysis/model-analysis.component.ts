import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Node} from 'src/app/common/node/node';
import {PairwiseService} from 'src/app/services/pairwise/pairwise.service';
import {ToastService} from 'src/app/services/toast/toast.service';
import {Router} from "@angular/router";
import {Triad} from "../../common/triad/triad";

import * as Highcharts from 'highcharts';
import Treemap from 'highcharts/modules/treemap';
import Histogram from 'highcharts/modules/histogram-bellcurve';

declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/sunburst')(Highcharts);
Treemap(Highcharts)
Histogram(Highcharts)

@Component({
  selector: 'app-model-analysis',
  templateUrl: './model-analysis.component.html',
  styleUrls: ['./model-analysis.component.scss']
})
export class ModelAnalysisComponent implements OnInit, AfterViewInit {
  @ViewChild('divClick') divClick: ElementRef;
  @ViewChild('divCurveClick') divCurveClick: ElementRef;

  nodes: Node[] = [];
  nodeNameInput: string = '';
  updateNameOfNode: string = '';
  addNodeNameParent: any = 0;
  deleteNodeName: any = 0;
  renameParentNodeId: any = 0;
  analyseNodeName: any = 0;
  isDisabled: boolean = true;
  inconsistencyTolerance: number = 0.33;

  //This may be removed, Not in use.
  analyzeSelectedNode: number = 1;

  // file upload
  selectedFiles: FileList | undefined;
  currentFile: File | undefined;
  progress = 0;
  message = '';
  finalResult: any[] = [];
  fileFlag: boolean = false;

  //Matrix
  showTableOnAnalyze: boolean = false;
  showTableOnMaxInconsistency: boolean = false;
  data: any[] = [];

  //MaxInconsistency
  triad: Triad[] = [];
  dataForReducedInconsistency: any[] = [];
  reducedInconsistencyFlag: boolean = false;
  showTriadTable: boolean = false;

  //File Download
  file: any;

  //HighCharts BellCurve
  bellCurveDatatable: any = [3.5, 3];
  bellCurveChartOptions: Highcharts.Options = {
    title: {
      text: 'Inconsistency Reduction Histogram'
    },
    credits: {
      enabled: false,
    },
    xAxis: [{
      title: {text: 'Data'},
      alignTicks: false
    }, {
      title: {text: 'Histogram'},
      alignTicks: false,
      opposite: true
    }],

    yAxis: [{
      title: {text: 'Data'}
    }, {
      title: {text: 'Histogram'},
      opposite: true
    }],

    series: [{
      name: 'Histogram',
      type: 'bellcurve',
      xAxis: 1,
      yAxis: 1,
      baseSeries: 's1',
      zIndex: -1
    }, {
      name: 'Data',
      type: 'scatter',
      data: this.bellCurveDatatable,
      visible: false,
      id: 's1',
      marker: {
        radius: 1.5
      }
    }]
  }

  //HighCharts TreeMap
  datatable: any = [{name: 'Root', parent: null, value: 100, colorValue: 1}];
  Highcharts: typeof Highcharts = Highcharts; // required
  chartOptions: Highcharts.Options = {
    chart: {
      height: '25%',
      // width: '30%',
    },
    series: [
      {
        type: 'treemap',
        layoutAlgorithm: 'sliceAndDice', //'sliceAndDice',
        alternateStartingDirection: true,
        allowTraversingTree: true,
        animationLimit: 1000,
        data: this.datatable,
        levelIsConstant: false,
        levels: [
          {
            layoutAlgorithm: 'sliceAndDice',
            level: 1,
            borderWidth: 3,
            borderColor: '#130f0f',
            color: '#f8f9fc',
            dataLabels: {
              color: '#130f0f',
              enabled: true,
              align: 'center',
              verticalAlign: 'top',
              format:
                'Node: {point.name}, Value: {point.value}, Parent: {point.parent}<br/> ',
              style: {
                fontSize: '15px',
                fontFamily: 'sans-serif',
                fontWeight: 'sans-serif',
              },
            },
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 3,
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 4,
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 5,
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 6,
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 7,
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 8,
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 9,
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 10,
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 11,
          },
          {
            borderWidth: 1,
            borderColor: 'black',
            level: 12,
          },
          {
            layoutAlgorithm: 'squarified',
            level: 2,
            borderWidth: 1,
            borderColor: '#130f0f',
            color: '#f8f9fc',
            dataLabels: {
              color: '#130f0f',
              enabled: true,
              align: 'center',
              verticalAlign: 'middle',
              format:
                'Node: {point.name}, Value: {point.value}, Parent: {point.parent} <br/>',
              style: {
                // fontSize: '15px',
                fontFamily: 'sans-serif',
                fontWeight: 'sans-serif',
              },
            },
          },
        ],
      },
    ],
    colorAxis: {
      minColor: '#7a2e69',
      maxColor: '#E11919FF',
    },
    title: {
      text: 'Pairwise Comparisons Model',
    },
    exporting: {
      enabled: true,
    },
    plotOptions: {
      series: {
        events: {
          click: function (event) {},
        },
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      useHTML: true,
      followPointer: true,
      pointFormat:
        '<span>Node: {point.name}, Value: {point.value}, Parent: {point.parent} </span>',
    },
  };
 // required
  updateFlag: boolean = false; // optional boolean
  invisible: boolean = true;

  //HighCharts PieChart
  pieChartDatatable: any = ['Inconsistency', 1];
  pieChartOptions: Highcharts.Options = {
    chart: {
      plotShadow: false,
    },
    title: {
      text: 'Inconsistency Weighted Chart'
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      headerFormat: `<span class="mb-2">Type: {point.key}</span><br>`,
      pointFormat: '<span>Inconsistency Value: {point.y}, Inconsistency Percentage: {point.percentage:.1f}% </span>',
      useHTML: true,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',

        dataLabels: {
          enabled: true,
          distance: -30,
          format: '</b> {point.y}, {point.percentage:.1f} %',
        },

        showInLegend: false
      }
    },
    series: [{
      type: 'pie',
      // name: 'Inconsistency',
      data: this.pieChartDatatable

    }]
  };


  constructor(
    private pairwiseService: PairwiseService,
    private toast: ToastService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getAllNodes();
    this.callAPi();
    setTimeout(() => {
      this.divClick.nativeElement.click();
    }, 200);
  }

  ngAfterViewInit() {
    // this.getAllNodes();
    // this.callAPi();
    // setTimeout(() => {
    //   this.divClick.nativeElement.click();
    // }, 200);
    // this.divClick.nativeElement.click();
  }

  getAllNodes(): void {
    this.nodes = [];
    let tempNodes: any[] = [];
    this.pairwiseService.getListOfNodes().subscribe((data) => {
      data._embedded.node.forEach(element => {
        tempNodes.push(new Node(element.id, element.nodeName, element.parentNodeId, element.value, element.children));
      });
      setTimeout(() => {
        this.nodes = tempNodes;
        this.addNodeNameParent = tempNodes[0].id;
        this.deleteNodeName = tempNodes[0].id;
        this.renameParentNodeId = tempNodes[0].id;
        this.analyseNodeName = tempNodes[0].id;
      }, 100);

      if (tempNodes.length >= 4) {
        this.isDisabled = false;
      } else if (tempNodes.length < 4) {
        this.isDisabled = true;
      }
    }, (err: any) => {
      this.toast.show('Error', err.error);
    });

  }

  callAPi() {
    let temp: any[] = [];
    this.pairwiseService.getTreeNode().subscribe((res) => {
      res.forEach(el => {
        // if(el.parentName!==null){
        temp.push({
          name: el.nodeName,
          id: el.nodeName,
          parent: el.parentName,
          value: el.value,
          colorValue: Math.floor(Math.random() * 100) + 1
        });
        // }
      });
    });
    this.datatable = temp
    console.log('data', this.datatable);
  }

  handleUpdate() {
    this.chartOptions.title = {
      text: 'Pairwise Comparisons Model',
    };
    this.chartOptions.series = [{
      type: 'treemap',
      data: this.datatable,
    }];
    this.pieChartOptions.series = [{
      type: 'pie',
      data: this.pieChartDatatable,
    }];
    this.bellCurveChartOptions.series = [{
      name: 'Histogram',
      type: 'bellcurve',
      xAxis: 1,
      yAxis: 1,
      baseSeries: 's1',
      zIndex: -1
    }, {
      name: 'Data',
      type: 'scatter',
      data: this.bellCurveDatatable,
      visible: false,
      id: 's1',
      marker: {
        radius: 1.5
      }
    }];
    this.updateFlag = true;
  }

  handleCurve() {
    this.pieChartOptions.series = [{
      type: 'pie',
      data: this.pieChartDatatable,
    }];
    this.bellCurveChartOptions.series = [{
      name: 'Histogram',
      type: 'bellcurve',
      xAxis: 1,
      yAxis: 1,
      baseSeries: 's1',
      zIndex: -1
    }, {
      name: 'Data',
      type: 'scatter',
      data: this.bellCurveDatatable,
      visible: false,
      id: 's1',
      marker: {
        radius: 1.5
      }
    }];
    this.updateFlag = true;
  }

  addNode(): void {
    let node = new Node();
    node.nodeName = this.nodeNameInput;
    node.parentNodeId = this.addNodeNameParent;

    this.pairwiseService.addNode(node).subscribe((res) => {
      this.nodes = res;
    }, (err: any) => {
      this.toast.show('Error', err.error);
    });

    this.nodeNameInput = '';
    this.reload();
    setTimeout(() => {
      this.divClick.nativeElement.click();
    }, 300);
  }

  deleteNode(): void {
    let nodeIdToDelete = this.deleteNodeName;

    this.pairwiseService.deleteNode(nodeIdToDelete).subscribe((res) => {
        this.nodes = res;
      },
      (err: any) => {
        this.toast.show('Node Deletion Failed!', err.error);
      })

    this.getAllNodes();
    this.reload();
    setTimeout(() => {
      this.divClick.nativeElement.click();
    }, 300);
  }

  updateNode(): void {
    let node = new Node();
    node.id = this.renameParentNodeId;
    node.nodeName = this.updateNameOfNode;

    this.pairwiseService.updateNode(node).subscribe((res) => {
      this.nodes = res;
    }, (err: any) => {
      this.toast.show('Error', err.error);
    });

    this.updateNameOfNode = '';
    this.reload();
    setTimeout(() => {
      this.divClick.nativeElement.click();
    }, 300);
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  upload() {
    this.message = '';
    this.fileFlag = false;
    this.progress = 0;
    this.inconsistencyTolerance = 0.33;
    this.currentFile = this.selectedFiles?.item(0) as File;

    this.pairwiseService.upload(this.currentFile).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event?.loaded / event?.total);
        } else if (event instanceof HttpResponse) {
          this.finalResult = event.body;
          // After Upload show the Matrix in UI
          this.data = event.body;

          this.selectedFiles = undefined;
          if (event.statusText === 'OK') {
            this.fileFlag = true;
            this.toast.show('Success', 'File Uploaded successfully');
            this.message = 'File Uploaded successfully';
            this.showTableOnAnalyze = true;
            this.reducedInconsistencyFlag = false;
            this.showTableOnMaxInconsistency = false;
            this.showTriadTable = false;
            this.pairwiseService.getPairwiseResult(this.data, 0).subscribe((response) => {
              this.dataForReducedInconsistency = response;
            }, (error) => {
              if (error.statusText === 'Bad Gateway') {
                this.message = error.body;
                this.progress = 0;
                this.currentFile = undefined;
                this.toast.show('Error', this.message);
              } else {
                this.progress = 0;
                this.message = 'File Format is not correct';
                this.currentFile = undefined;
                this.toast.show('Error', this.message);
              }
            })
            this.getAllNodes();
            this.reload();
          }
        }
      },
      err => {
        if (err.error === 'File cannot be processed as it contain VIRUS') {
          this.message = 'File cannot be processed as it contain VIRUS';
          this.progress = 0;
          this.currentFile = undefined;
          this.toast.show('ERROR', this.message);
        } else {
          this.progress = 0;
          this.message = 'File Format is not correct';
          this.currentFile = undefined;
          this.toast.show('ERROR', this.message);
        }
      });

    setTimeout(() => {
      this.message = '';
      this.fileFlag = false;
      this.progress = 0;
      this.currentFile = undefined;
    }, 8000);

  }

  closeToast() {
    this.toast.close();
  }


  reload() {
    setTimeout(() => {
      this.getAllNodes();
    }, 100);

    setTimeout(() => {
      this.callAPi();
    }, 100);
    setTimeout(() => {
      this.divClick.nativeElement.click();
    }, 200);
  }

  curve() {
    setTimeout(() => {
      this.divCurveClick.nativeElement.click();
    }, 200);
  }

  analyze() {
    console.log("Analyze ===>", this.analyseNodeName);
    this.pairwiseService.analyze(this.analyseNodeName, this.inconsistencyTolerance).subscribe((data) => {
      this.data = data;
      this.showTableOnAnalyze = true;
      this.reducedInconsistencyFlag = false;
      this.showTableOnMaxInconsistency = false;
      this.showTriadTable = false;
    }, (error) => {
      this.toast.show('Error', error.error);
    })
    //this.reload();
  }

  changeValue(item: any, id: number, j: number, event: any, numberPassed: number): void {
    //  this.data[item][id] = event.target.textContent;
    // This removes the white space from  the table and convert it into number
    this.data[j][id] = +event.target.textContent.replace(/\s/g, '');
    console.log('====>', j);
    console.log('====>', id, item);
    console.log('====>', this.data);
    this.pairwiseService.getPairwiseResult(this.data, numberPassed).subscribe((response) => {
      this.data = response;
      this.dataForReducedInconsistency = response;
      this.reducedInconsistencyFlag = false;
      this.showTableOnMaxInconsistency = false;
      this.showTriadTable = false;
    }, (error) => {
      this.toast.show('Error', error.error);
    })
  }

  checkMaxInconsistency() {
    let tempPieChart: any[] = [];
    let tempBellCurve: any = [];
    this.pairwiseService.maxInconsistency(this.data).subscribe((response) => {
      this.triad = response;
      this.showTableOnMaxInconsistency = true;
      this.reducedInconsistencyFlag = false;
      this.showTriadTable = true;
      this.triad.forEach(element => {
        tempPieChart.push(['Inconsistency', element.kii]);
        tempBellCurve.push(element.kii);
      });
      this.reload();
    }, (error) => {
      this.toast.show('Error', error.error);
    })
    this.bellCurveDatatable = tempBellCurve;
    this.pieChartDatatable = tempPieChart;
    setTimeout(() => {
    }, 200);
    this.curve();
  }

  reduceInconsistency() {
    this.pairwiseService.getPairwiseResult(this.data, 1).subscribe((response) => {
      this.data = response;
      this.reduceInconsistencyTriadValue();
    }, (error) => {
      this.toast.show('Error', error.error);
    })
  }

  private reduceInconsistencyTriadValue() {
    let tempPieChart: any[] = [];
    let tempBellCurve: any = [];
    this.pairwiseService.reduceInconsistencyTriad(this.dataForReducedInconsistency).subscribe((response) => {
      this.triad = response;
      this.reducedInconsistencyFlag = true;
      this.showTriadTable = false;
      // tempPieChart.push(['None Inconsistency', response.length]);
      this.triad.forEach(element => {
        tempPieChart.push(['None Inconsistency', element.kii]);
        tempBellCurve.push(element.kii);
      });
    }, (error) => {
      this.toast.show('Error', error.error);
    })
    this.pieChartDatatable = tempPieChart;
    this.bellCurveDatatable = tempBellCurve;
    this.reload();
  }


  downloadExample() {
    const fileName = 'example.csv';
    return this.pairwiseService.getFiles().subscribe(x => {
      var newBlob = new Blob([x], {type: "application/csv"});
      // this.file = res;

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob, fileName);
        return;
      }

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const file_data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = file_data;
      link.download = fileName;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(file_data);
        link.remove();
      }, 100);
    })
  }

  reset() {
    this.pairwiseService.reset().subscribe();
    this.showTableOnAnalyze = false;
    this.reducedInconsistencyFlag = false;
    this.showTableOnMaxInconsistency = false;
    this.showTriadTable = false;
    // this.getAllNodes();
    this.reload();
    setTimeout(() => {
      window.location.reload();
    }, 150);
  }

  exportResult() {
    const fileName = 'result-download.csv';
    return this.pairwiseService.exportResult().subscribe(x => {
      var newBlob = new Blob([x], {type: "application/csv"});
      // this.file = res;

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob, fileName);
        return;
      }

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const file_data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = file_data;
      link.download = fileName;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(file_data);
        link.remove();
      }, 100);
    })
  }


  exportTreeResult() {
    const fileName = 'treemap.csv';
    return this.pairwiseService.downloadTree().subscribe(x => {
      var newBlob = new Blob([x], {type: "application/csv"});
      // this.file = res;

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob, fileName);
        return;
      }

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const file_data = window.URL.createObjectURL(newBlob);

      var link = document.createElement('a');
      link.href = file_data;
      link.download = fileName;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(file_data);
        link.remove();
      }, 100);
    })
  }

}
