//Service imports the Angular Injectable symbol and 
//annotates the class with the @Injectable() decorator
import { Injectable } from '@angular/core';

//the "Hero" data model:
import { Hero } from './hero';

//Import HTTP symbols:
import { HttpClient, HttpHeaders } from '@angular/common/http';

//old: import mock data which is stored in the HEROES constant
import { HEROES } from './mock-heroes';

//In a later tutorial on HTTP, you'll learn that Angular's HttpClient methods 
//return RxJS Observables. In this tutorial, you'll simulate getting data 
//from the server with the RxJS of() function.
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

//To catch errors, you "pipe" the observable result from http.get() through 
//an RxJS catchError() operator.
//Import the catchError symbol from rxjs/operators, along with some other 
//operators you'll need later.
import { catchError, map, tap } from 'rxjs/operators';

//Inject message service into hero service:  Import
import { MessageService } from './message.service';

//The heroes web API expects a special header in HTTP save requests. That 
//header is in the httpOption constant defined in the HeroService.
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

//The @Injectable() decorator tells Angular that this 
//service might itself have injected dependencies. It doesn't have dependencies.
@Injectable()
export class HeroService {

  //Inject services into hero service:  declare "private" in the constructor
  constructor(
    //Inject HttpClient into the constructor in a private property called http.
    private http: HttpClient,
    //Modify the constructor with a parameter that declares a private messageService 
    //property. Angular will inject the singleton MessageService into that property 
    //when it creates the HeroService.
    private heroMessageService: MessageService) { }
    //This is a typical "service-in-service" scenario: you inject the 
    //MessageService into the HeroService which is injected into the 
    //HeroesComponent

  /** Log a HeroService message with the MessageService */
  //You'll call the message service so frequently that you'll wrap it in private log method.
  private log(message: string) {
    this.heroMessageService.add('HeroService: ' + message);
  }

  //Define the heroesUrl with the address of the heroes resource on the server.
  //private heroesUrl = 'api/heroes';  // URL to web api
  private heroesUrl = 'api/people';  // URL to web api
  
  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  //After reporting the error to console, the handler constructs a user 
  //friendly message and returns a safe value to the app so it can keep working.
  //Because each service method returns a different kind of Observable result, 
  //errorHandler() takes a type parameter so it can return the safe value as 
  //the type that the app expects.

  //New getHeroes method that uses HttpClient:
  /** GET heroes from the server */
  serviceGetHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        //original: tap(heroes => this.log(`fetched heroes`)),
        //https://stackoverflow.com/questions/24977110/how-to-count-the-number-of-elements-in-this-json-object
        tap(peopleRecords => this.log(`Fetched ` + Object.keys(peopleRecords).length + ` heroes from `+ this.heroesUrl)),
        catchError(this.handleError('serviceGetHeroes', []))
      );
      //The HeroService methods will tap into the flow of observable values and 
      //send a message (via log()) to the message area at the bottom of the page.
      //They'll do that with the RxJS tap operator, which looks at the observable 
      //values, does something with those values, and passes them along. The 
      //tap call back doesn't touch the values themselves.

      //The catchError() operator intercepts an Observable that failed. 
      //It passes the error an error handler that can do what it wants with the error.
    //orig:  return this.http.get<Hero[]>(this.heroesUrl)
  }
  //Http methods return one value:
  //All HttpClient methods return an RxJS Observable of something.
  //HTTP is a request/response protocol. You make a request, it returns a single response.
  //In general, an Observable can return multiple values over time. An Observable from HttpClient always emits a single value and then completes, never to emit again.
  //This particular HttpClient.get call returns an Observable<Hero[]>, literally "an observable of hero arrays". In practice, it will only return a single hero array.
  //HttpClient.get returns response data:
  //HttpClient.get returns the body of the response as an untyped JSON object by default. Applying the optional type specifier, <Hero[]> , gives you a typed result object.
  //The shape of the JSON data is determined by the server's data API. The Tour of Heroes data API returns the hero data as an array.
  //Other APIs may bury the data that you want within an object. You might have to dig that data out by processing the Observable result with the RxJS map operator.
  //Although not discussed here, there's an example of map in the getHeroNo404() method included in the sample source code.

  //Old second version of getHeroes method:
  //of(HEROES) returns an Observable<Hero[]> that emits a single value, the 
  //array of mock heroes.
  //The HeroService.getHeroes method used to return a Hero[]. Now it 
  //returns an Observable<Hero[]>.
  /*
  serviceGetHeroes(): Observable<Hero[]> {
    // Todo: send the message _after_ fetching the heroes
    this.heroMessageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }
  */
  //In this tutorial, HeroService.getHeroes() will return an Observable in 
  //part because it will eventually use the Angular HttpClient.get method 
  //to fetch the heroes and HttpClient.get() returns an Observable.

  //Original getHeroes method to return the mock heroes.
  //This method has a synchronous signature, which implies that the 
  //HeroService can fetch heroes synchronously. The HeroesComponent 
  //consumes the getHeroes() result as if heroes could be fetched synchronously.
  //This will not work in a real app.
  /*
  serviceGetHeroes(): Hero[] {
    return HEROES;
  }
  */

  //Most web APIs support a get by id request in the form api/hero/:id 
  //(such as api/hero/11).
  /** GET hero by id. Will 404 if id not found */
  getOneHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
    tap(_ => this.log(`Fetched hero id=${id}`)),
    catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  //There are three significant differences from getHeroes():
  // - it constructs a request URL with the desired hero's id.
  // - the server should respond with a single hero rather than an array of heroes.
  // - therefore, getHero returns an Observable<Hero> ("an observable of 
  //Hero objects") rather than an observable of hero arrays .

  //Original getHero which returns data from constant HEROES:
  //return data for a single hero from mock data:
  /*
  getHero(id: number): Observable<Hero> {
    // Todo: send the message _after_ fetching the hero
    this.heroMessageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }
  */
  //Note the backticks ( ` ) that define a JavaScript template literal for 
  //embedding the id.
  //Like getHeroes(), getHero() has an asynchronous signature. It returns 
  //a mock hero as an Observable, using the RxJS of() function.
  //You'll be able to re-implement getHero() as a real Http request without 
  //having to change the HeroDetailComponent that calls it.

  //The HttpClient.put() method takes three parameters
  // - the URL
  // - the data to update (the modified hero in this case)
  // - options
  //The URL is unchanged. The heroes web API knows which hero to update by 
  //looking at the hero's id.
  /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );  
  }
  //HeroService.addHero() differs from updateHero in two ways.
  // - it calls HttpClient.post() instead of put().
  // - it expects the server to generates an id for the new hero, which it returns 
  //in the Observable<Hero> to the caller.

  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  //Note that
  // - it calls HttpClient.delete.
  // - the URL is the heroes resource URL plus the id of the hero to delete
  // - you don't send data as you did with put and post.
  // - you still send the httpOptions.

}
