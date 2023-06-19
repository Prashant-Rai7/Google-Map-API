
import { Component, ElementRef, ViewChild } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-task2',
  templateUrl: './task2.component.html',
  styleUrls: ['./task2.component.css']
})
export class Task2Component {
  // obtain references to specific elements in the component's template.
  @ViewChild('mapContainer', { static: false })mapContainer!: ElementRef;
  @ViewChild('fromInput', { static: false }) fromInput!: ElementRef;
  @ViewChild('toInput', { static: false }) toInput!: ElementRef;

  fromLocation!: string;
  toLocation!: string;
  map: any;
  directionsService: any;
  directionsRenderer: any;
  fromAutocomplete: any;
  toAutocomplete: any;
  distance: string = '';
  duration: string = '';
  fromSearchBox!: any;
  toSearchBox!: any;

  constructor() {
    //These are objects for handling directions.
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  ngAfterViewInit() {
    const mapOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 10
    };
    // Initialize map
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.directionsRenderer.setMap(this.map);



    // Create Autocomplete search box for FROM and TO location................
    const frominput = document.getElementById('fromSearchBox') as HTMLInputElement;
    this.toAutocomplete = new (google as any).maps.places.Autocomplete(frominput);
    this.toAutocomplete.setFields(['geometry']);

    const toinput = document.getElementById('toSearchBox') as HTMLInputElement;
    this.toAutocomplete = new (google as any).maps.places.Autocomplete(toinput);
    this.fromAutocomplete.setFields(['geometry']);

  }



  onSubmit() {
    //if from and to location is valid and not undefined.
    if (this.fromLocation && this.toLocation) {
      this.calculateRoute();
    }
  }

  //Calculate Route b/w To and From Location using calculateDistanceAndDuration() method.
  calculateRoute() {
    // to set the origin and destination location route path and driving mode.
    const request = {
      origin: this.fromLocation,
      destination: this.toLocation,
      travelMode: 'DRIVING'
    };
    //set Route if status ok with result
    this.directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        this.calculateDistanceAndDuration(result);
      }
    });
  }

  // Place marker for the "From" location (A) by calling placeMarker() fxn
  onFromLocationInput() {
    this.fromLocation = this.fromInput.nativeElement.value;
    this.placeMarker(this.fromLocation);
  }

  // Place marker for the "To" location (B) by calling placeMarker() fxn
  onToLocationInput() {
    this.toLocation = this.toInput.nativeElement.value;
    this.placeMarker(this.toLocation);
  }

  //It sets the
  placeMarker(location: string) {
    if (location) {
      // Geocoder class convert addresses into geographic coordinates (latitude and longitude) and vice versa
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results: any, status: any) => {
        if (status === 'OK') {
          // retrieves the geographic coordinates first value
          const position = results[0].geometry.location;
          // It moves the map's view to focus on the specified location i.e, geocoded position.
          this.map.setCenter(position);
        }
      });
    }
  }

    calculateDistanceAndDuration(response: any) {
    const route = response.routes[0];
    let totalDistance = 0;
    let totalDuration = 0;

    for (let i = 0; i < route.legs.length; i++) {
      //distance value from i to final point length is added in totalDistance variable
      totalDistance += route.legs[i].distance.value;
      //duration value from i to final point length is added in totalDuration variable
      totalDuration += route.legs[i].duration.value;
    }
    console.log(totalDistance+"...................mtr")
    console.log(totalDuration+"....................sec")

    this.distance = (totalDistance / 1000).toFixed(2) + ' km';
    this.duration = (totalDuration / 3600).toFixed(0) + ' Hr';

    console.log(this.distance+"...................km")
    console.log(this.duration+"....................hr")
  }
}
