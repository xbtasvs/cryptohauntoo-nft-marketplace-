import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRoutingModule } from './search-routing.module';
import { ItemComponent } from '../item/item.component';
import { SearchComponent } from './search.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    SearchComponent,
    ItemComponent
  ],
  imports: [
    LottieModule.forRoot({ player: playerFactory }),
    CommonModule,
    NgxPaginationModule,
    SearchRoutingModule,
  ],
  providers: [],
  bootstrap: [SearchComponent]
})
export class SearchModule { }
