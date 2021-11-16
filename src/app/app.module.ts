import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HauntooModule } from './hauntoo/hauntoo.module';
import { SearchModule } from './search/search.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';

export function playerFactory() {
  return player;
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    LottieModule.forRoot({ player: playerFactory }),
    AppRoutingModule,
    SearchModule,
    HauntooModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
