//Amend the @angular/core import statement to include the Input symbol.
import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService }  from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  //Add the hero property, preceded by the @Input() decorator
  //The HeroDetailComponent template binds to the component's 
  //hero property which is of type Hero
  @Input() myHero: Hero;

  //Inject the ActivatedRoute, HeroService, and Location services 
  //into the constructor, saving their values in private fields:
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}
  //The ActivatedRoute holds information about the route to this instance 
  //of the HeroDetailComponent. This component is interested in the route's 
  //bag of parameters extracted from the URL. The "id" parameter is the id 
  //of the hero to display.
  //The HeroService gets hero data from the remote server and this component 
  //will use it to get the hero-to-display.
  //The location is an Angular service for interacting with the browser. 
  //You'll use it later to navigate back to the view that navigated here

  ngOnInit(): void {
    this.getHero();
  }
  
  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getOneHero(id)
      .subscribe(hero => this.myHero = hero);
  }
  //The route.snapshot is a static image of the route information shortly 
  //after the component was created.
  //The paramMap is a dictionary of route parameter values extracted from 
  //the URL. The "id" key returns the id of the hero to fetch.
  //Route parameters are always strings. The JavaScript (+) operator converts 
  //the string to a number, which is what a hero id should be.

  goBack(): void {
    this.location.back();
  }
  //A goBack() method navigates backward one step in the browser's history 
  //stack using the Location service that you injected previously.

  // the following save() method persists hero name changes using the 
  //hero service updateHero() method and then navigates back to the previous view.
  save(): void {
    this.heroService.updateHero(this.myHero)
      .subscribe(() => this.goBack());
  }

}
