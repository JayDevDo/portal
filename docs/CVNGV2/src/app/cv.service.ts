import { Injectable }   from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { ICVData }      from './cvDataInterface';
import { Observable }   from 'rxjs/Observable';

@Injectable({ providedIn: 'root' })

export class CVService {
    private _url: string = 'assets/cvNGv2.json';
    constructor( private http: HttpClient ) { }
    getCV(): Observable<ICVData[]>{ return this.http.get<ICVData[]>(this._url); }
}
