import { Component, OnInit, Input, Output } from '@angular/core';
import { ICVData }                          from './cvDataInterface';
import { CVService }                        from './cv.service';

@Component({
  selector: 'cvngv2',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})

export class AppComponent implements OnInit {

  public appComponentCV;

  constructor( 
    private _cvService: CVService
  ) { }

  ngOnInit() { 
    this.appComponentCV = this._cvService.getCV()
      .subscribe( 
        (data)=>{
            this.appComponentCV = data;
            console.log("this.appComponentCV data", this.appComponentCV );  
        } 
      )
  }

  public title = "Jay's CV presented with Angular 8.1.3" ;

}