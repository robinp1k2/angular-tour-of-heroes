//ng generate module app-routing --flat --module=app
//--flat puts the file in src/app instead of its own folder.
//--module=app tells the CLI to register it in the imports array of the AppModule.
import { NgModule } from '@angular/core';

//You'll configure the router with Routes in the RouterModule so import 
//those two symbols from the @angular/router library.
import { RouterModule, Routes } from '@angular/router';

//Import the components so you can reference them in Routes.
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

//A typical Angular Route has two properties:
//path: a string that matches the URL in the browser address bar.
//component: the component that the router should create when navigating to this route.

//Define an array of routes with a single route to that component.

//To make the app navigate to the dashboard automatically, add the following route to 
//the AppRoutingModule.Routes array: { path: '', redirectTo: '/dashboard', pathMatch: 'full' }

//add a parameterized route to the AppRoutingModule.routes array that matches the 
//path pattern to the hero detail view.  The colon (:) in the path indicates that 
//:id is a placeholder for a specific hero id.

const routes: Routes = [
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

//You generally don't declare components in a routing module so you can 
//delete the @NgModule.declarations array and delete CommonModule references too.
//
//import { CommonModule } from '@angular/common';
// @NgModule({
//   imports: [
//     CommonModule
//   ],
//   declarations: []
// })

//1. Add an @NgModule.exports array with RouterModule in it. Exporting 
//RouterModule makes router directives available for use in the AppModule 
//components that will need them.
//2. Initialize the router and start it listening for browser location changes.
//Add RouterModule to the @NgModule.imports array and configure it with the 
//routes in one step by calling RouterModule.forRoot() within the imports array
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
