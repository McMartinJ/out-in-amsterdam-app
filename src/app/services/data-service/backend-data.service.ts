import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Venue} from '../../models/venue.model';
import {Event} from '../../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class BackendDataService {

  constructor(private http: HttpClient) {
  }

  getVenuesData(): Observable<Venue[]> {
    return this.http.get<Venue[]>('/assets/data/establishment-data.json', {responseType: 'json'});
  }

  getEventsData(): Observable<Event[]> {
    return this.http.get<Event[]>('/assets/data/events-data.json', {responseType: 'json'});
  }
}
