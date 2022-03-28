import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModelAnalysisComponent } from './model-analysis.component';

const routes: Routes = [
  {
    path: '',
    component: ModelAnalysisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelAnalysisRoutingModule { }
