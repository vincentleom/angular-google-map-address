import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GeolocationModel} from '../models/geolocation.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private http: HttpClient, ) { }

  /**
   * Return lat&lng via ip location
   *
   */
  getIpLocation(): Observable<GeolocationModel>{
    return this.http.get<GeolocationModel>(`https://api.ipdata.co/?api-key=${environment.ipGeolocationApiKey}`);
  }

  /**
   * Return Google Map Address via latitude and longitude
   *
   * @param lat: number
   * @param lng: number
   */
  getGoogleMapAddress(lat: number, lng: number): Observable<any>{
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapApiKey}`);
  }
}
