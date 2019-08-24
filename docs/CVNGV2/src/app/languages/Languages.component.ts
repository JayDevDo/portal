import { Component, OnInit } from '@angular/core';
import { CVdataService } from '../cvdata.service'

@Component({
  selector: 'languages',
  templateUrl: './languages.component.html',
  styleUrls: [ './languages.component.css' ]
})

export class LanguagesComponent implements OnInit  {

  public languagesData;

  constructor( private _cvDataService: CVdataService ) { }

  ngOnInit() { 
    this.languagesData = this._cvDataService.getCVData()
      .subscribe( 
        (data)=>{
          data.forEach( 
            (dataItem)=>{
              console.log("this.languagesData Item", dataItem);  
              if(dataItem.id == "languages"){ 
                this.languagesData = dataItem ; 
                this.languagesData.id =this.languagesData.id.toUpperCase() ; 
              }  
            } 
          )
        }   
      );
  }
}
