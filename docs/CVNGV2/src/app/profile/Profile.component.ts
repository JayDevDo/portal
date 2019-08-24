import { Component, OnInit, Input } from '@angular/core';
import { CVdataService } from '../cvdata.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: [ './profile.component.css' ]
})

export class ProfileComponent implements OnInit {

  public profileData;

  constructor( private _cvDataService: CVdataService ) { }

  ngOnInit() { 
    this.profileData = this._cvDataService.getCVData()
      .subscribe( 
        (data)=>{
          data.forEach( 
            (dataItem)=>{
              console.log("this.profileData Item", dataItem);  
              if(dataItem.id == "profile"){ 
                this.profileData = dataItem ; 
                this.profileData.id = this.profileData.id.toUpperCase();
              }  
            } 
          )
        }   
      );
  }
}
