import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./modules/homepage/homepage.module').then(m => m.HomepageModule)
  // },
  {
    path: '',
    loadChildren: () => import('./modules/model-analysis/model-analysis.module').then(m => m.ModelAnalysisModule)
  },
  {
    path: 'homepage',
    loadChildren: () => import('./modules/homepage/homepage.module').then(m => m.HomepageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'version',
    loadChildren: () => import('./modules/version/version.module').then(m => m.VersionModule)
  },
  {
    path: 'model-analysis',
    loadChildren: () => import('./modules/model-analysis/model-analysis.module').then(m => m.ModelAnalysisModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
