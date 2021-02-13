import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './guards/auth-guard.service';
import {SignComponent} from './components/sign/sign.component';
import {DashComponent} from './components/dash/dash.component';

const routes: Routes = [
  { path: 'sign', component: SignComponent},
  { path: '', component: DashComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
