import {EventDate} from './event-date.model';
import {Locations} from './locations.model';

export interface Event {
  title: string;
  location: Locations;
  dates: EventDate;
}
