import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class CVdataService {

  private _url: string = 'assets/cvNGv2.json';

  constructor( private http: HttpClient ) { }

  getCVData(): Observable<any[]> {
    let tmpArr = this.http.get<any[]>(this._url);
    return tmpArr;
  } 
}
