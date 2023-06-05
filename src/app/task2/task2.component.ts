// import { Component, ElementRef, ViewChild } from '@angular/core';
// declare var google: any;

// @Component({
//   selector: 'app-task2',
//   templateUrl: './task2.component.html',
//   styleUrls: ['./task2.component.css']
// })
// export class Task2Component {

//   @ViewChild('fromSearchBox', { static: false }) fromSearchBox!: ElementRef;
//   @ViewChild('toSearchBox', { static: false }) toSearchBox!: ElementRef;

//   map: any;
//   fromAutocomplete: any;
//   toAutocomplete: any;
//   fromLocation: any;
//   toLocation: any;
//   directionsService: any;
//   directionsRenderer: any;
//   distance: string = '';
//   duration: string = '';

//   constructor() {
//     this.directionsService = new google.maps.DirectionsService();
//     this.directionsRenderer = new google.maps.DirectionsRenderer();
//   }

//   ngOnInit() {
//     this.initMap();
//   }

//   initMap() {
//     // Initialize map
//     this.map = new google.maps.Map(document.getElementById('map'), {
//       center: { lat: 0, lng: 0 },
//       zoom: 8
//     });
//     console.log("from.........",this.fromLocation)
//     console.log("to..........",this.toLocation)


//     // Initialize directions service and renderer
//     this.directionsService = new google.maps.DirectionsService();
//     this.directionsRenderer = new google.maps.DirectionsRenderer();
//     this.directionsRenderer.setMap(this.map);


//     // Create autocomplete search box................
//     const frominput = document.getElementById('fromSearchBox') as HTMLInputElement;
//     this.toAutocomplete = new (google as any).maps.places.Autocomplete(frominput);
//     this.toAutocomplete.setFields(['geometry']);

//     const toinput = document.getElementById('toSearchBox') as HTMLInputElement;
//     this.toAutocomplete = new (google as any).maps.places.Autocomplete(toinput);
//     this.fromAutocomplete.setFields(['geometry']);



//     // Event listeners for place selection
//     this.fromAutocomplete.addListener('place_changed', () => {
//       this.fromLocation = this.fromAutocomplete.getPlace();
//       this.showRoute();
//     });

//     this.toAutocomplete.addListener('place_changed', () => {
//       this.toLocation = this.toAutocomplete.getPlace();
//       this.showRoute();
//     });
//   }


//   showRoute() {
//     console.log("from.........",this.fromLocation)
//     console.log("to..........",this.toLocation)

//     if (this.fromLocation && this.toLocation) {
//       const origin = this.fromLocation.geometry.location;
//       const destination = this.toLocation.geometry.location;

//       console.log(origin, destination)

//       // Update map bounds to include both origin and destination
//       const bounds = new google.maps.LatLngBounds();
//       bounds.extend(origin);
//       bounds.extend(destination);
//       this.map.fitBounds(bounds);

//       // Calculate and display route
//       const request = {
//         origin: origin,
//         destination: destination,
//         travelMode: google.maps.TravelMode.DRIVING,
//         // travelMode: 'DRIVING'
//       };

//       this.directionsService.route(request, (response: any, status: any) => {
//         if (status === 'OK') {
//           this.directionsRenderer.setDirections(response);
//           this.calculateDistanceAndDuration(response);
//         }
//       });
//     }
//   }

//   onFromLocationInput() {
//     // Place marker for the "From" location
//     this.fromLocation = this.fromAutocomplete.nativeElement.value;
//     this.placeMarker(this.fromLocation);
//     console.log(this.fromLocation,"..................")
//   }

//   onToLocationInput() {
//     // Place marker for the "To" location
//     this.toLocation = this.toAutocomplete.nativeElement.value;
//     this.placeMarker(this.toLocation);
//     console.log(this.toLocation,"..................")

//   }

//   placeMarker(location: string) {
//     if (location) {
//       const geocoder = new google.maps.Geocoder();
//       geocoder.geocode({ address: location }, (results: any, status: any) => {
//         if (status === 'OK') {
//           const position = results[0].geometry.location;
//           const marker = new google.maps.Marker({
//             position: position,
//             map: this.map,
//           });
//           this.map.setCenter(position);
//         }
//       });
//     }
//   }



//   calculateDistanceAndDuration(response: any) {
//     const route = response.routes[0];
//     let totalDistance = 0;
//     let totalDuration = 0;

//     for (let i = 0; i < route.legs.length; i++) {
//       totalDistance += route.legs[i].distance.value;
//       totalDuration += route.legs[i].duration.value;
//     }

//     this.distance = (totalDistance / 1000).toFixed(2) + ' km';
//     this.duration = (totalDuration / 60).toFixed(0) + ' min';
//   }
// }




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
    this.fromAutocomplete = new google.maps.places.Autocomplete(this.fromInput.nativeElement);
    this.toAutocomplete = new google.maps.places.Autocomplete(this.toInput.nativeElement);
  }


    // // Create autocomplete search box................
    // const fromInput = this.fromSearchBox.nativeElement;
    // const toInput = this.toSearchBox.nativeElement;
    // this.fromAutocomplete = new google.maps.places.Autocomplete(fromInput);
    // this.toAutocomplete = new google.maps.places.Autocomplete(toInput);
    // this.fromAutocomplete.setFields(['geometry']);
    // this.toAutocomplete.setFields(['geometry']);



  onSubmit() {
    if (this.fromLocation && this.toLocation) {
      this.calculateRoute();
    }
  }

  calculateRoute() {
    const request = {
      origin: this.fromLocation,
      destination: this.toLocation,
      travelMode: 'DRIVING'
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
      }
    });
  }

  onFromLocationInput() {
    // Place marker for the "From" location
    this.fromLocation = this.fromInput.nativeElement.value;
    this.placeMarker(this.fromLocation);
  }

  onToLocationInput() {
    // Place marker for the "To" location
    this.toLocation = this.toInput.nativeElement.value;
    this.placeMarker(this.toLocation);
  }

  placeMarker(location: string) {
    if (location) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results: any, status: any) => {
        if (status === 'OK') {
          const position = results[0].geometry.location;
          const marker = new google.maps.Marker({
            position: position,
            map: this.map,
          });
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
    this.duration = (totalDuration / 60).toFixed(0) + ' min';
  }
}
