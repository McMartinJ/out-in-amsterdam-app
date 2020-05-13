import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, interval, Observable} from 'rxjs';
import {Venue} from '../../models/venue.model';
import {Event} from '../../models/event.model';
import {BackendDataService} from './backend-data.service';
import {startWith, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private venuesObservable: BehaviorSubject<Venue[]> = new BehaviorSubject([]);
  //
  // private eventsObservable: BehaviorSubject<Event[]> = new BehaviorSubject([]);

  constructor(private backendDataService: BackendDataService) {
    // this.loadInitialData();
  }

  // loadInitialData - in case of changing data

  // loadInitialData() {
  //   interval(60000) // seconds
  //     .pipe(
  //       startWith(0),
  //       switchMap(() => this.backendDataService.getVenuesData())
  //     )
  //     .subscribe((venues: Venue[]) => {
  //       this.venuesObservable.next(venues);
  //     });
  //   interval(60000) // seconds
  //     .pipe(
  //       startWith(0),
  //       switchMap(() => this.backendDataService.getEventsData())
  //     )
  //     .subscribe((events: Event[]) => {
  //       this.eventsObservable.next(events);
  //     });
  // }

  getVenuesData(): Observable<Venue[]> {
    return this.backendDataService.getVenuesData();
  }

  getEventsData(): Observable<Event[]> {
    return this.backendDataService.getEventsData();
  }
}
