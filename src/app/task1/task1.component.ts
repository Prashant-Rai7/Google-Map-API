import { Component, ElementRef, ViewChild } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-task1',
  templateUrl: './task1.component.html',
  styleUrls: ['./task1.component.css']
})
export class Task1Component {

  @ViewChild('searchBox', { static: false }) searchBox!: ElementRef;

  map: any;
  autocomplete: any;
  google: any;
  marker: any;

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    // Initialize map
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 8
    });


    // Create autocomplete search box.....................
    const input = document.getElementById('search-box') as HTMLInputElement;
    this.autocomplete = new (google as any).maps.places.Autocomplete(input);
    this.autocomplete.setFields(['geometry']);



    // Show current location on page load......................
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        this.map.setCenter(currentLocation);
        this.marker.setPosition(currentLocation);
        this.marker.setVisible(true);
      });
    }

    // MAke the marker drggable and Animated.........................
    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      anchorPoint: new google.maps.Point(0, -29)
    });

    // on click make Bounce Animation or null animation i.e, toggling
    this.marker.addListener('click', () => {
      this.toggleBounce();
    });

    //when marker is dragged, it shows new position
    this.marker.addListener('dragend', () => {
      const position = this.marker.getPosition();
      this.geocodeLatLng(position);
    });


    // Handle place selection from autocomplete.
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();   //it retrieves the selected place from autocomplete searchbox, The place variable stores the result.
      this.marker.setVisible(false);    //statement is used to hide the marker on the map temporarily. This is done to ensure that the marker is not visible if the selected place does not have a valid geometry.

      // Move map marker to selected location from autocomplete selected location.
      if (place.geometry && place.geometry.location) {
        this.map.setCenter(place.geometry.location);    //This moves the map view to the selected location
        this.marker.setPosition(place.geometry.location);   //It updates the position of the marker to the selected place's geometry location
        this.marker.setVisible(true);
      }
    });
  }

  //set Animation on marker.
  toggleBounce() {
    if (this.marker.getAnimation() !== null) {
      this.marker.setAnimation(null);
    } else {
      this.marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  //update address or Location
  geocodeLatLng(position: any) {
    const geocoder = new google.maps.Geocoder();  //converts coordinates into human readable format.
    geocoder.geocode({ location: position }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const address = results[0].formatted_address; //contains the human-readable address associated with the provided coordinates.
        const input = document.getElementById('search-box') as HTMLInputElement;
        input.value = address;  //here input value from search is updated with the generated address and show in searchbox.
        console.log(address)
      }
    });
  }
}













