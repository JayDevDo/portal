import { Component, OnInit } from '@angular/core';
import { CVService } from './cv.service';

@Component({
  selector: 'jobDomains',
  templateUrl: './jobDomains.component.html',
  styleUrls: [ './jobDomains.component.css' ]
})

export class JobDomainsComponent implements OnInit  {
  public jobDomainData;

  constructor( 
    private _cvDataService: CVService ) { }

  ngOnInit() { }

}
