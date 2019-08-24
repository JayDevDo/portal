import { Component, OnInit } from '@angular/core';
import { CVdataService } from '../cvdata.service';

@Component({
  selector: 'jobDomains',
  templateUrl: './jobDomains.component.html',
  styleUrls: [ './jobDomains.component.css' ]
})

export class JobDomainsComponent implements OnInit  {
  public jobDomainData;

  constructor( 
    private _cvDataService: CVdataService ) { }

  ngOnInit() { 
    this.jobDomainData = this._cvDataService.getCVData()
      .subscribe( 
        (data)=>{
          data.forEach( 
            (dataItem)=>{
              console.log("this.jobDomainData Item", dataItem );  
              if(dataItem.id == "jobDomains"){ 
                this.jobDomainData = dataItem ; 
                this.jobDomainData.id = this.jobDomainData.id.toUpperCase();
                this.jobDomainData.data.forEach(
                  (dv)=>{
                    dv.years  = Math.floor( dv.duration/12 ) ;
                    dv.months = dv.duration%12;
                  }
                );
              }
            }
          )
        }
      );
  }

}
