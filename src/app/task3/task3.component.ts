import { AfterViewInit, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

declare var google: any;

@Component({
  selector: 'app-task3',
  templateUrl: './task3.component.html',
  styleUrls: ['./task3.component.css']
})
export class Task3Component implements AfterViewInit {
  map: any;
  drawingManager: any;
  polygon: any;
  isInZone: boolean = false;
  cordsArray: any = [];
  marker: any;
  autocomplete: any;

  constructor(private toastr: ToastrService){}

  ngAfterViewInit() {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5
    });

    const input = document.getElementById('input') as HTMLInputElement;
    this.autocomplete = new google.maps.places.Autocomplete(input);

    this.autocomplete.addListener('place_changed', () => {
      const place: any = this.autocomplete.getPlace();    //retrieves the selected place

      if (!place.geometry) {
        console.error('No geometry found for place:', place);
        return;
      }

      // Move map marker to selected location
      if (place.geometry && place.geometry.location) {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(12); // Increase the zoom level
        this.marker.setPosition(place.geometry.location);
        this.marker.setVisible(true);
      }
    });

    // Show current location on page load with Pin
    // The code checks if the browser supports geolocation using navigator.geolocation.
    if (navigator.geolocation) {
      // to get the current location coordinates
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        // map's center is set to the current location, and the marker is positioned and shown at that location
        this.map.setCenter(currentLocation);
        this.marker.setPosition(currentLocation);
        this.marker.setVisible(true);
      });
    }

    // make marker draggable and enable animation
    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      anchorPoint: new google.maps.Point(0, -29)
    });

    // to draw the polygon on the map
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      // drawing manager is set to allow users to draw polygons on the map
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      }
    });
    // The drawing manager is associated with the map using setMap(this.map)
    this.drawingManager.setMap(this.map);

    // When a polygon is drawn on the map, the callback function is executed.
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        // The function checks if the drawn overlay is a polygon, clears any existing polygon, and assigns the new polygon to this.polygon.
        if (this.polygon) {
          this.polygon.setMap(null);
        }
        console.log(event);

        this.polygon = event.overlay;
        console.log(this.polygon);
      }
    });
  }

  checkLocation() {
    // It uses the google.maps.Geocoder to geocode the input location into coordinates
    const geocoder = new google.maps.Geocoder();
    const input = document.getElementById('input') as HTMLInputElement;
    console.log('checkLocation.......' + input.value);

    geocoder.geocode({ address: input.value }, (results: any, status: any) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        // to determine if they are within the polygon
        this.isInZone = google.maps.geometry.poly.containsLocation(location, this.polygon);

        if (this.isInZone) {
          // this.toastr.success('Your entered location belongs to the drawn zone');
          alert("Your entered location belongs to the drawn zone'")
        } else {
          // this.toastr.error('Sorry! Entered location doesnt belong to the drawn zone');
          alert("Sorry! Entered location doesnt belong to the drawn zone")
        }
      } else {
        // this.toastr.error('Geocode was not successful for the following reason: ' + status, 'Error');
        alert("Geocode was not successful for the following reason"+ status+ 'Error')
      }
    });
  }

}
