import {VenueDate} from './venue-date.model';
import {Locations} from './locations.model';
import {Media} from './media.model';

export interface Venue {
  lat: number;
  lng: number;
  title: string;
  isShown: boolean;
  location: Locations;
  dates: VenueDate;
  urls: URL[];
  media: Media[];
}
