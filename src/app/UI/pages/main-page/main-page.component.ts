import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Venue} from '../../../models/venue.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataService} from '../../../services/data-service/data.service';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MapInfoWindow, MapMarker} from '@angular/google-maps';
import {MatDialog} from '@angular/material/dialog';
import {AdditionalInfoDialog} from '../../dialogs/additional-info/additional-info.dialog';
import {Event} from '../../../models/event.model';
import {Marker} from '../../../models/marker.model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {

  @ViewChild('venuePaginator', {static: false}) paginatorVenue: MatPaginator;
  @ViewChild('eventPaginator', {static: false}) paginatorEvent: MatPaginator;
  @ViewChild(MatSort, {static: false}) sortEvent: MatSort;

  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;

  venues: Venue[] = [];
  events: Event[] = [];

  cityNames: string[] = [];
  uniqueCityNames: string[] = [];

  filteredEvents: Marker[] = [];

  filterVenueText = '';
  filterEventText = '';

  filterVenueParams = {search: '', cityList: []};
  filterEventParams = {search: ''};

  displayedVenueColumns: string[] = ['title', 'city', 'zipcode', 'adress', 'startdate'];
  displayedEventColumns: string[] = ['title', 'dates', 'distanceFromVenue'];

  venueSource: MatTableDataSource<Venue>;
  eventSource: MatTableDataSource<Marker>;

  venueSubscription: Subscription;
  eventSubscription: Subscription;

  // Amsterdam Centraal position
  centerLatitude = 52.379189;
  centerLongitude = 4.899431;

  zoom = 15;
  radius = 1000;

  center: google.maps.LatLngLiteral;
  venueMarkerOptions = {draggable: false, icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'};
  eventMarkerOptions = {draggable: false, icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'};

  venueMarkerPositions: google.maps.LatLngLiteral[] = [];

  markers: Marker[] = [];

  selectedVenue: Venue = null;

  tabSelector = 0;

  isVenueSelected: boolean;

  emitter: EventEmitter<any> = new EventEmitter();

  constructor(private dataService: DataService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initializeVenueTable();
    this.initializeEventTable();
    this.initializeMap();

  }

  ngOnDestroy(): void {
    this.venueSubscription.unsubscribe();
    this.eventSubscription.unsubscribe();
  }

  initializeMap() {
    this.isVenueSelected = false;
    this.center = {
      lat: this.centerLatitude,
      lng: this.centerLongitude,
    };
  }

  initializeVenueTable() {
    this.venueSubscription = this.dataService.getVenuesData().subscribe((data: Venue[]) => {

      this.venues = data;

      for (const venue of this.venues) {

        if (!venue.dates.startdate) {
          venue.dates.startdate = 'Not specified';
        }

        if (this.cityNames.indexOf(venue.location.city) === -1) {
          this.cityNames.push(venue.location.city);
        }

        this.venueMarkerPositions.push({
          lat: this.parseAndReplace(venue.location.latitude),
          lng: this.parseAndReplace(venue.location.longitude),
        });
      }

      this.venueSource = new MatTableDataSource(this.venues);
      this.venueSource.paginator = this.paginatorVenue;
      this.venueSource.filterPredicate = (resource, filter): boolean => {
        return this.filterVenue(resource, JSON.parse(filter));
      };
    });
  }

  initializeEventTable() {
    this.eventSubscription = this.dataService.getEventsData().subscribe((data: Event[]) => {

      this.events = data;

      for (const event of this.events) {

        if (!event.dates.startdate) {
          event.dates.startdate = event.dates.singles[0];
        }

        this.markers.push({
          lat: this.parseAndReplace(event.location.latitude),
          lng: this.parseAndReplace(event.location.longitude),
          isShown: false,
          title: event.title,
          dates: event.dates,
          distanceFromVenue: null
        });
      }

      this.eventSource = new MatTableDataSource(this.markers);
      this.eventSource.paginator = this.paginatorEvent;
      this.eventSource.sort = this.sortEvent;
      this.eventSource.filterPredicate = (resource, filter): boolean => {
        return this.filterEvent(resource, JSON.parse(filter));
      };
    });
  }

  // replaces comma with a dot and makes it a float
  parseAndReplace(text: string) {
    return parseFloat(text.replace(',', '.'));
  }

  getVenueDialogFromMarker(latitude: number, longitude: number) {
    let numberOfDialogsToOpen = 1;

    for (const venue of this.venues) {
      if (this.parseAndReplace(venue.location.latitude) === latitude && this.parseAndReplace(venue.location.longitude) === longitude) {
        this.openVenueDialogInMap(venue, numberOfDialogsToOpen);
        numberOfDialogsToOpen = 0;
      }
    }
  }

  getFilteredVenuePositions() {
    if (this.selectedVenue !== null) {
      const selectedVenueCoordinates: Venue = {
        lat: this.parseAndReplace(this.selectedVenue.location.latitude),
        lng: this.parseAndReplace(this.selectedVenue.location.longitude),
        isShown: true,
        title: this.selectedVenue.title,
        dates: this.selectedVenue.dates,
        location: this.selectedVenue.location,
        media: this.selectedVenue.media,
        urls: this.selectedVenue.urls,
      };
      return [selectedVenueCoordinates];
    }
    return this.venueMarkerPositions.filter((position, index): boolean => {
      return this.filterVenue(this.venues[index], this.filterVenueParams);
    });
  }

  filterVenue(resource, filter) {
    const {search = '', cityList = []} = (filter);

    return (resource.title.toLowerCase().includes(search) ||
      resource.location.zipcode.toLowerCase().includes(search) ||
      resource.dates.startdate.toLowerCase().includes(search) ||
      resource.location.adress.toLowerCase().includes(search)) &&
      (cityList.includes(resource.location.city) ||
        cityList.length === 0);
  }

  filterEvent(resource, filter) {
    const {search = ''} = (filter);

    return (resource.title.toLowerCase().includes(search) ||
      resource.dates.startdate.toLowerCase().includes(search));
  }

  applyVenueFilter(filterValue: string) {
    this.venueMarkerOptions.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    Object.values(this.markers).forEach(value => {
      value.isShown = true;
      value.distanceFromVenue = null;
    });
    this.selectedVenue = null;
    this.filterVenueText = filterValue;
    this.isVenueSelected = false;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.filterVenueParams = ({search: filterValue, cityList: this.uniqueCityNames});
    this.venueSource.filter = JSON.stringify(this.filterVenueParams);
  }

  applyEventFilter(filterValue: string) {
    this.filterEventText = filterValue;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.filterEventParams = ({search: filterValue});
    this.eventSource.filter = JSON.stringify(this.filterEventParams);
  }

  applyCityFilter() {
    this.applyVenueFilter(this.filterVenueText);
    this.emitter.emit();
  }

  clearFilters() {
    this.venueMarkerOptions.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    this.selectedVenue = null;
    this.isVenueSelected = false;
    this.uniqueCityNames = [];
    this.applyVenueFilter('');
    this.applyEventFilter('');
    this.filteredEvents = [];
    this.eventSource.data = this.markers;
    this.eventSource.sort = this.sortEvent;
    Object.values(this.markers).forEach(value => {
      value.isShown = true;
      value.distanceFromVenue = null;
    });
  }

  openVenueDialog(venue) {
    this.isVenueSelected = true;
    this.tabSelector = 0;

    const dialogRef = this.dialog.open(AdditionalInfoDialog, {
      width: '1000px',
      data: [venue, 0]
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        Object.values(this.markers).forEach(value => {
          value.isShown = true;
          value.distanceFromVenue = null;
        });
        this.venueMarkerOptions.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
        this.center = {
          lat: this.parseAndReplace(venue.location.latitude),
          lng: this.parseAndReplace(venue.location.longitude)
        };
        this.eventSource.data = this.markers;
        this.filterEventMarkers();
        this.selectedVenue = data;
        this.selectTab(2);
      } else {
        this.isVenueSelected = false;
      }
    });
  }

  openVenueDialogInMap(venue, numberOfDialogToOpen) {
    if (numberOfDialogToOpen === 1) {
      this.isVenueSelected = true;

      const dialogRef = this.dialog.open(AdditionalInfoDialog, {
        width: '1000px',
        data: [venue, 1],
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.center = {
            lat: this.parseAndReplace(venue.location.latitude),
            lng: this.parseAndReplace(venue.location.longitude)
          };
          this.eventSource.data = this.markers;
          this.filterEventMarkers();
          this.selectedVenue = data;
        } else {
          this.venueMarkerOptions.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
          this.selectedVenue = null;
          this.isVenueSelected = false;
        }
      });
    }
  }

  filterEventMarkers() {
    Object.values(this.markers).forEach(value => {
      value.isShown = false;
      const distance = this.getDistanceBetween(value.lat, value.lng, this.center.lat, this.center.lng);
      if (distance < this.radius) {
        if (distance === 0) {
          value.isShown = false;
          this.venueMarkerOptions.icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
        } else {
          value.isShown = distance < this.radius;
        }
        value.distanceFromVenue = Math.round(distance);
        this.filteredEvents.push(value);
      }
    });
    this.eventSource.data = this.filteredEvents;
    this.filteredEvents = [];
  }

  getDistanceBetween(lat1, long1, lat2, long2) {
    const from = new google.maps.LatLng(lat1, long1);
    const to = new google.maps.LatLng(lat2, long2);

    return google.maps.geometry.spherical.computeDistanceBetween(from, to);
  }

  selectTab(index: number): void {
    this.tabSelector = index;
  }

  showAllVenues() {
    this.venueMarkerOptions.icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    this.selectedVenue = null;
    this.isVenueSelected = false;
    this.filteredEvents = [];
    this.eventSource.data = this.markers;
  }
}
