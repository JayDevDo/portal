import { Component, OnInit } from '@angular/core';
import { CVdataService } from '../cvdata.service'

@Component({
  selector: 'jobLocations',
  templateUrl: './jobLocations.component.html',
  styleUrls: [ './jobLocations.component.css' ]
})

export class JobLocationsComponent implements OnInit {
  public jobLocationData;

  constructor( private _cvDataService: CVdataService ) { }

  ngOnInit() { 
    this.jobLocationData = this._cvDataService.getCVData()
      .subscribe( 
        (data)=>{
          data.forEach( 
            (dataItem)=>{
              console.log("this.jobLocationData Item", dataItem );  
              if(dataItem.id == "jobLocations"){ 
                this.jobLocationData = dataItem ; 
                this.jobLocationData.id = this.jobLocationData.id.toUpperCase();
              }  
            } 
          )
        }
      );
  }
}

/*
  this.jobLocationData.data.forEach(
    (dv)=>{
      dv.years  = Math.floor( dv.duration/12 ) ;
      dv.months = dv.duration%12;
    }
  );
*/