import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { IvyCarouselModule } from 'dist';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, IvyCarouselModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
