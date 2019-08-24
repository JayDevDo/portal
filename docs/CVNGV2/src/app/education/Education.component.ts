import { Component, OnInit } from '@angular/core';
import { CVdataService } from '../cvdata.service'

@Component({
  selector: 'education',
  templateUrl: './education.component.html',
  styleUrls: [ './education.component.css' ]
})

export class EducationComponent implements OnInit {

  public educationData;

  constructor( private _cvDataService: CVdataService ) { }

  ngOnInit() { 
    this.educationData = this._cvDataService.getCVData()
      .subscribe( 
        (data)=>{
          data.forEach( 
            (dataItem)=>{
              console.log("this.educationData Item", dataItem);  
              if(dataItem.id == "education"){ 
                this.educationData = dataItem ; 
                this.educationData.id =this.educationData.id.toUpperCase() ; 
              }  
            } 
          )
        }   
      );
  }
}
