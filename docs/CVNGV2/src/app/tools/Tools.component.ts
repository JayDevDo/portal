import { Component, OnInit } from '@angular/core';
import { CVdataService } from '../cvdata.service'

@Component({
  selector: 'tools',
  templateUrl: './tools.component.html',
  styleUrls: [ './tools.component.css' ]
})

export class ToolsComponent implements OnInit {

  public toolsData;

  constructor( private _cvDataService: CVdataService ) { }

  ngOnInit() { 
    this.toolsData = this._cvDataService.getCVData()
      .subscribe( 
        (data)=>{
          data.forEach( 
            (dataItem)=>{
              console.log("this.toolsData Item", dataItem);  
              if(dataItem.id == "tools"){ 
                this.toolsData = dataItem ; 
                this.toolsData.id =this.toolsData.id.toUpperCase() ; 
              }  
            } 
          )
        }   
      );
  }
}
