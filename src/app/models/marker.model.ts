import {EventDate} from './event-date.model';

export interface Marker {
  lat: number;
  lng: number;
  isShown: boolean;
  title: string;
  dates: EventDate;
  distanceFromVenue: number;
}
