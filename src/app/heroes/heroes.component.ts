//ng generate component heroes
import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero' //the data model
//import { HEROES } from '../mock-heroes'; -- do not need the import since now using a service
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[]; //component property

  //old (was used when hero details component was inside the list component)
  //selectedHero: Hero; //component property
 
  //The private heroService parameter simultaneously defines a private 
  //heroService property and identifies it as a HeroService injection site.
  //When Angular creates a HeroesComponent, the Dependency Injection system 
  //sets the heroService parameter to the singleton instance of HeroService.
  constructor(private heroService: HeroService) { }
  //Reserve the constructor for simple initialization such as wiring 
  //constructor parameters to properties. The constructor shouldn't do 
  //anything. It certainly shouldn't call a function that makes HTTP 
  //requests to a remote server as a real data service would.

  //Instead, call getHeroes() inside the ngOnInit lifecycle hook and let 
  //Angular call ngOnInit at an appropriate time after constructing a 
  //HeroesComponent instance.
  ngOnInit() {
    this.getHeroes();
  }

  //old (was used when hero details component was inside the list component)
  //custom component method sets component property value "selectedHero"
  // onSelect(theHero: Hero): void {
  //   this.selectedHero = theHero;
  // }

  //New asychronous method:
  //The new version waits for the Observable to emit the array of heroes— 
  //which could happen now or several minutes from now. Then subscribe 
  //passes the emitted array to the callback, which sets the component's 
  //heroes property.
  //This asynchronous approach will work when the HeroService requests 
  //heroes from the server.
  getHeroes(): void {
    this.heroService.serviceGetHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }

  //Old method used for synchronous below.
  //This version assigns an array of heroes to the component's heroes 
  //property. The assignment occurs synchronously, as if the server could 
  //return heroes instantly or the browser could freeze the UI while it 
  //waited for the server's response.  That won't work when the 
  //HeroService is actually making requests of a remote server.
  //
  //getHeroes(): void {
  //  this.heroes = this.heroService.serviceGetHeroes();
  //}

  //"add" handler
  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }
  //When the given name is non-blank, the handler creates a Hero-like object 
  //from the name (it's only missing the id) and passes it to the 
  //services addHero() method.
  //When addHero saves successfully, the subscribe callback receives 
  //the new hero and pushes it into to the heroes list for display.

  // "delete" handler
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
  //Although the component delegates hero deletion to the HeroService, it 
  //remains responsible for updating its own list of heroes. The component's 
  //delete() method immediately removes the hero-to-delete from that list, 
  //anticipating that the HeroService will succeed on the server.
  //
  //There's really nothing for the component to do with the Observable 
  //returned by heroService.delete(). It must subscribe anyway.
  //If you neglect to subscribe(), the service will not send the delete request 
  //to the server! As a rule, an Observable does nothing until something subscribes!
}
