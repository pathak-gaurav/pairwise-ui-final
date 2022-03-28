import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from './charts.component';
import {GoogleChartsModule} from "angular-google-charts";



@NgModule({
  declarations: [
    ChartsComponent
  ],
  exports: [
    ChartsComponent
  ],
  imports: [
    CommonModule,
    GoogleChartsModule
  ]
})
export class ChartsModule { }
