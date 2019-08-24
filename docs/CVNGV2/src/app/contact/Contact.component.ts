import { Component, OnInit } from '@angular/core';
import { CVdataService } from '../cvdata.service'

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: [ './contact.component.css' ]
})

export class ContactComponent implements OnInit {
  public contactData;
  private pageloc = location.href;

  constructor( private _cvDataService: CVdataService ) { }

  ngOnInit() { 
    this.contactData = this._cvDataService.getCVData()
      .subscribe( 
        (data)=>{
          data.forEach( 
            (dataItem)=>{
              console.log("this.contactData Item", dataItem );  
              if(dataItem.id == "contact"){ 
                this.contactData = dataItem ; 
                this.contactData.id = this.contactData.id.toUpperCase();
                this.contactData.data[2].value = ["<a href='", this.contactData.data[2].value ,"'>click to download</a>"].join("");
                this.contactData.data[3].value = this.pageloc ;
              }  
            } 
          )
        }
      );
  }
}
