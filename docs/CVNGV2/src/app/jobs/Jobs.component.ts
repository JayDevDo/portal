import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICVData }                          from '../cvDataInterface';
import { CVService }                        from '../cv.service';
import { MatSliderModule }                  from '@angular/material';
import { FormsModule }                      from '@angular/forms';

@Component({
  selector: 'jobs',
  templateUrl: './jobs.component.html',
  styleUrls:  [ './jobs.component.css']
})

export class JobsComponent implements OnInit {
/* appComponentCV */
  public jobsData;
  public jobsDmnData;
  public jobsLocData;
  public jobsLngData;
  private lr = '\n';

  private actJob: number = -1;

  constructor( private _cvDataService: CVService ) { }

  ngOnInit(){
    this.jobsData = this._cvDataService.getCV()
      .subscribe( 
        (data)=>{
          this.jobsData     = data[0] ; 
          this.jobsData.id  = this.jobsData.id.toUpperCase() ;
          this.jobsDmnData  = data[1].data;
          this.jobsLocData  = data[2].data;
          this.jobsLngData  = data[3].data;
          console.log(
            "this.jobsData ",     this.jobsData.data ,
            "this.jobsDmnData ",  this.jobsDmnData ,
            "this.jobsLocData ",  this.jobsLocData ,
            "this.jobsLngData ",  this.jobsLngData 
          );
        }
      )
  }

  isActJob(jobNr){ return (jobNr === this.actJob); }
  setActJob(jobNr){
    if( jobNr == this.actJob ){ this.actJob = -1;
    }else{ this.actJob = jobNr; }
  }

  public jobFltrArr: boolean[]= [false,false,false,false,false,false,false,false,false,false,false,false,false];
  public resetFltrArr(){ 
    this.jobFltrArr = [false,false,false,false,false,false,false,false,false,false,false,false,false]; 
    this.clearFltrRes();
  }
  public jobFiltered = (jobId)=>{ return this.jobFltrArr[jobId] } 
  
  public fltrRes =   {
    hide:     true,
    key:      {"srchKey": 'none', "value": ''},
    found:    0 
  }

  public fltrAct = {
    hideFltrOps:  true,
    hideDmn:      true,
    hideLoc:      true,
    hideLng:      true,
    hideTml:      true
  }

  public changeFltrOpsState = ()=>{ 
    this.fltrAct.hideFltrOps = !this.fltrAct.hideFltrOps; 
    if(this.fltrAct.hideFltrOps){
      this.fltrAct.hideDmn = true;
      this.fltrAct.hideLoc = true;
      this.fltrAct.hideLng = true;
      this.fltrAct.hideTml = true;
    }
  }
  public changeShowDmn = ()=>{ 
    this.fltrAct.hideDmn = !this.fltrAct.hideDmn; 
    this.fltrAct.hideLoc = true;
    this.fltrAct.hideLng = true;
    this.fltrAct.hideTml = true;
  }
  public changeShowLoc = ()=>{ 
    this.fltrAct.hideLoc = !this.fltrAct.hideLoc;   
    this.fltrAct.hideDmn = true;
    this.fltrAct.hideLng = true;
    this.fltrAct.hideTml = true;
  }
  public changeShowLng = ()=>{ 
    this.fltrAct.hideLng = !this.fltrAct.hideLng; 
    this.fltrAct.hideDmn = true;
    this.fltrAct.hideLoc = true;
    this.fltrAct.hideTml = true;
  }
  public changeShowTml = ()=>{ 
    this.fltrAct.hideTml = !this.fltrAct.hideTml; 
    this.fltrAct.hideDmn = true;
    this.fltrAct.hideLoc = true;
    this.fltrAct.hideLng = true;
  }

  public clearFltrRes = ()=>{
    this.fltrRes =  {
      hide:     true,
      key:      {"srchKey": 'none', "value": ''},
      found:    0  
    }
  }

  public filterJobsByDomain(dmn){
    this.resetFltrArr();
    this.clearFltrRes();

    this.fltrRes.hide         = false;
    this.fltrRes.key.srchKey  = "domain";
    this.fltrRes.key.value    = dmn;

    for(let ji=0; ji < this.jobsData.data.length; ji++){
      if( this.jobsData.data[ji].jobDomain.includes(dmn)){ 
        this.jobFltrArr[ji] = false; 
        this.fltrRes.found++ ;
      }else{
        this.jobFltrArr[ji] = true; 
      }
    }
  }

  public filterJobsByLocation(loc){
    this.resetFltrArr();
    this.clearFltrRes();

    this.fltrRes.hide       = false;
    this.fltrRes.key.srchKey  = "Country";
    this.fltrRes.key.value    = loc;

    for(let ji=0; ji < this.jobsData.data.length; ji++){
      if( this.jobsData.data[ji].countryAndlocation.includes(loc)){ 
        this.jobFltrArr[ji] = false; 
        this.fltrRes.found++ ;
      }else{
        this.jobFltrArr[ji] = true; 
      }
    }
  }

  public filterJobsByLanguage(lng){
    this.resetFltrArr();
    this.clearFltrRes();

    this.fltrRes.hide       = false;
    this.fltrRes.key.srchKey  = "Language";
    this.fltrRes.key.value    = lng;

    for(let jl=0; jl < this.jobsData.data.length; jl++){
      if( this.jobsData.data[jl].languages.includes(lng)){ 
        this.jobFltrArr[jl] = false; 
        this.fltrRes.found++ ;
      }else{
        this.jobFltrArr[jl] = true; 
      }
    }
  }

  public filterJobsByPeriod(per){
    this.resetFltrArr();
    this.clearFltrRes();

    this.fltrRes.hide         = false;
    this.fltrRes.key.srchKey  = "Period";
    this.fltrRes.key.value    = per;

    for(let jp=0; jp < this.jobsData.data.length; jp++){
      let sd = parseInt(this.jobsData.data[jp].startDate.slice(0,4));
      let ed = parseInt(this.jobsData.data[jp].endDate.slice(0,4));
      console.log(
        "filterJobsByPeriod:", this.lr,
        "start date yr:", sd, 
        "period:", per,
        "end date yr:", ed
      
      )
      //  return (i >= minValueInclusive && i <= maxValueInclusive);
      if( per >= sd && per <= ed  ){ 
        this.jobFltrArr[jp] = false; 
        this.fltrRes.found++ ;
      }else{
        this.jobFltrArr[jp] = true; 
      }
    }
  }


  /* slider */
  public perSelected;
  changeValue(event) {
    this.perSelected = event.value;
    this.filterJobsByPeriod(this.perSelected );
}

  public value: number = 2000;
  public ticks: Object = { 
    placement: 'After', 
    thumbLabel: "thumbLabel",
    largeStep: 5, 
    smallStep: 1, 
    min: 1993,
    max: 2019 
  };

  public step: number = 10;

  public tooltip: Object = { 
    placement: 'Before', 
    isVisible: true, 
    showOn: 'Always' 
  };

}
