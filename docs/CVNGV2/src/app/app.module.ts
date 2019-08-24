import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import 'hammerjs';
import { MatTabsModule , MatSliderModule} from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CVdataService } from './cvdata.service';
import { CVService } from './cv.service';
// import { Observable }   from 'rxjs/Observable';

import { AppComponent } from './app.component';
import { ContactComponent } from './contact/Contact.component';
import { EducationComponent } from './education/Education.component';
import { JobDomainsComponent } from './jobDomains/JobDomains.component';
import { JobLocationsComponent } from './jobLocations/JobLocations.component';
import { JobsComponent } from './jobs/Jobs.component';
import { LanguagesComponent } from './languages/Languages.component';
import { ProfileComponent } from './profile/Profile.component';
import { ToolsComponent } from './tools/Tools.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile',    component: ProfileComponent },
  { path: 'jobs',       component: JobsComponent },
  { path: 'domains',    component: JobDomainsComponent },
  { path: 'languages',  component: LanguagesComponent },
  { path: 'education',  component: EducationComponent },
  { path: 'locations',  component: JobLocationsComponent },
  { path: 'tools',      component: ToolsComponent },
  { path: 'contact',    component: ContactComponent }
];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    MatSliderModule,
    NoopAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [
    AppComponent, 
    ContactComponent,
    EducationComponent,
    JobDomainsComponent,
    JobLocationsComponent,
    JobsComponent,
    LanguagesComponent,
    ProfileComponent,
    ToolsComponent
  ],
  
  providers:[
    CVdataService, 
    CVService
  ],
  
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
