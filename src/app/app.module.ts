import { BrowserModule } from '@angular/platform-browser';
//Although ngModel is a valid Angular directive, it isn't available by default.
//It belongs to the optional FormsModule and you must opt-in to using it.
import { FormsModule } from '@angular/forms';
//To make HttpClient available everywhere in the app,
//import the HttpClientModule symbol from @angular/common/http,
//add it to the @NgModule.imports array.
import { HttpClientModule } from '@angular/common/http'

//This tutorial sample mimics communication with a remote data server 
//by using the In-memory Web API module.
//After installing the module, the app will make requests to and receive 
//responses from the HttpClient without knowing that the In-memory Web API 
//is intercepting those requests, applying them to an in-memory data store, 
//and returning simulated responses.
//$ npm install angular-in-memory-web-api --save
//Import the InMemoryWebApiModule and the InMemoryDataService (custom) class:
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroService } from './hero.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';

//You must provide the HeroService in the dependency injection system 
//before Angular can inject it into the HeroesComponent.
//The providers array tells Angular to create a single, shared instance 
//of HeroService and inject into any class that asks for it.
//
//To have CLI automatically insert "import" line and modify provider
//for new service use the following command:
//ng generate service message --module=app

//Every component must be declared in exactly one NgModule.
//The Angular CLI declared HeroesComponent in the AppModule when it generated 
//that component.  It also imported HeroesComponent.
@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    DashboardComponent,
    HeroSearchComponent
  ],
  imports: [
    BrowserModule,
    //Add FormsModule to the @NgModule metadata's imports array, which contains 
    //a list of external modules that the app needs.
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
    //The forRoot() configuration method takes an InMemoryDataService 
    //class that primes the in-memory database.
  ],
  providers: [HeroService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
