# OutInAmsterdamApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.5.

## Comments

Requirement-wise I think I met every single one of them. I reckon there could be some optimization surrounding cycles, how some data is assigned. All and all... what a fun project! I had some nice breakthroughs and at the end was pretty pleased with how it had turned out.

Application tested on Chrome, MS Edge, Firefox, Opera and Internet Explorer with difficulties to run it only on the last one. \
As for map component I opted to use the Angular Google Maps module and it is set up with my personal API Key. To assign your own key go to `index.html` and change `YOUR_API_KEY` to one you get from [Google Cloud Platform.](https://developers.google.com/maps/documentation/javascript/get-api-key) Do not forget to enable your Maps JavaScript API.
```
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

## Setting up the environment

[Node.js and npm set-up.](https://www.sitepoint.com/beginners-guide-node-package-manager/) \
It is necessary for you to run some `npm install` commands as the project in this repository is devoid of some of the crucial modules.

`npm i @angular/cli` \
`npm i @angular/flex-layout` \
`npm i @angular/google-maps` \
`npm i @angular/cdk` \
`npm i @angular/animations` \
`npm i @angular/common` \
`npm i @angular/material` \
`npm i @angular/core` \
`npm i @angular/youtube-player`

## Task requirements

### Main task
Attached you should find a JSON dataset from "Out in Amsterdam". This dataset contains information on various venues - restaurants, cafes and bars - in and around the city of Amsterdam. You should produce an application to display the venues in a tabular format that allows you to filter the venues in various ways:

·        By name. Note: you should be able to search by substring.

·        By city. It should be possible to select several cities at once.

·        By start year.

·        By postcode.

In the table, you should be able to view the following information about each venue.

·        Name

·        City

·        Postcode

·        Address

·        Start year

You should also be able to click on a venue to reveal some more details about it - it's full name and full address, URL and any pictures which are available.

### Bonus task 1
Each venue in the dataset should also have a latitude and longitude. Implement a map view that allows you to view the venues

·        The map view should also support the features defined in the table view - filtering the venues and clicking a venue to view more details about it

·        Provide a method to switch between viewing the tabular and map views.

·        When a venue is selected highlight it somehow on the map view

 

### Bonus task 2
You should also find the "Events in Amsterdam" data set attached. Modify the application so that when a venue is selected the user can see any events which are nearby (< 1km) the selected venue - again in both map and tabular views.

·        Events on the map view should be easily distinguishable from venues

·        Events on the tabular view should be ordered by the distance from the venue

·        Allow filtering the event list by:

·        name

·        year and month of the event

### Non-functional requirements
·        The application should work in modern browsers

·        Use the latest Angular(7+) (Angular CLI for easy scaffolding is recommended)

·        Feel free to use additional libraries like Bootstrap, lodash, jQuery, etc.

·        To run the application we recommend Angular CLI's ng serve, but feel free to use e.g. NodeJS with http-server, etc.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
