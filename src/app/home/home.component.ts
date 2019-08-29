import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../environments/environment';
import {MapsService} from '../services/maps.service';
import {GeolocationModel} from '../models/geolocation.model';
import {Subscription} from 'rxjs';
import {LatLngLiteral, MouseEvent} from '@agm/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  locationInitial: LatLngLiteral = null;
  locationSelected: LatLngLiteral = null;
  venueForm: FormGroup;

  private address = null;
  private subscriptions: Subscription[] = [];

  constructor(private mapsService: MapsService,
              private fb: FormBuilder) {
  }

  /**
   * On init
   */
  ngOnInit() {
    this.getIpLocation();
    this.createForm()
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  /**
   * Get current ip location for initial map zoom
   */
  getIpLocation(){
    this.subscriptions.push(
      this.mapsService.getIpLocation().subscribe((geolocation: GeolocationModel) => {
        this.locationInitial = {
          lat: geolocation.latitude,
          lng: geolocation.longitude,
        };
      })
    );
  }

  /**
   * Create form
   */
  createForm(){
    this.venueForm = this.fb.group({
        address: [{
          value: this.address,
          disabled: this.address ? null : false
        }, Validators.required],
        posLatitude: [{
          value: this.locationInitial ? this.locationInitial.lat : null,
          disabled: true
        }, [Validators.required, Validators.pattern(/^-?([+-]?([0-9]*[.])?[0-9]+)?$/)]],
        posLongitude: [{
          value: this.locationInitial ? this.locationInitial.lat : null,
          disabled: true
        }, [Validators.required, Validators.pattern(/^-?([+-]?([0-9]*[.])?[0-9]+)?$/)]],
    })
  }

  /**
   * Pin selected location and get address from Google Geocode API
   *
   * @param location: MouseEvent
   */
  onLocationChosen(location: MouseEvent){
    if(location && location.coords) {
      this.locationSelected = location.coords;

      this.subscriptions.push(
        this.mapsService.getGoogleMapAddress(this.locationSelected.lat, this.locationSelected.lng).subscribe((data: any) => {
          this.venueForm.controls['posLatitude'].setValue(this.locationSelected.lat);
          this.venueForm.controls['posLongitude'].setValue(this.locationSelected.lng);
          this.venueForm.controls['address'].setValue(data.results[0].formatted_address);
        })
      );
    }
  }
}
