
import { Component, ElementRef, ViewChild } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-task2',
  templateUrl: './task2.component.html',
  styleUrls: ['./task2.component.css']
})
export class Task2Component {

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
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  ngAfterViewInit() {
    const mapOptions = {
      center: { lat: 0, lng: 0 },
      zoom: 10
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.directionsRenderer.setMap(this.map);



    // Create autocomplete search box................
    const frominput = document.getElementById('fromSearchBox') as HTMLInputElement;
    this.toAutocomplete = new (google as any).maps.places.Autocomplete(frominput);
    this.toAutocomplete.setFields(['geometry']);

    const toinput = document.getElementById('toSearchBox') as HTMLInputElement;
    this.toAutocomplete = new (google as any).maps.places.Autocomplete(toinput);
    this.fromAutocomplete.setFields(['geometry']);

  }






  onSubmit() {
    console.log(this.fromLocation,"..................")
    console.log(this.toLocation,"..................")

    //if from and to location is valid and not undefined
    if (this.fromLocation && this.toLocation) {
      this.calculateRoute();
    }
  }


  // to set the origin and destination location route path and driving mode
  calculateRoute() {
    const request = {
      origin: this.fromLocation,
      destination: this.toLocation,
      travelMode: 'DRIVING'
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
        this.calculateDistanceAndDuration(result);
      }
    });
  }

  onFromLocationInput() {
    // Place marker for the "From" location (A)
    this.fromLocation = this.fromInput.nativeElement.value;
    this.placeMarker(this.fromLocation);
  }

  onToLocationInput() {
    // Place marker for the "To" location (B)
    this.toLocation = this.toInput.nativeElement.value;
    this.placeMarker(this.toLocation);
  }

  placeMarker(location: string) {
    if (location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results: any, status: any) => {
        if (status === 'OK') {
          const position = results[0].geometry.location;
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
      totalDistance += route.legs[i].distance.value;
      totalDuration += route.legs[i].duration.value;
    }

    this.distance = (totalDistance / 1000).toFixed(2) + ' km';
    this.duration = (totalDuration / 3600).toFixed(0) + ' Hr';
  }
}
