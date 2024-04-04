import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LateralBarComponent } from './lateral-bar/lateral-bar.component';
import { IconComponent } from './icon/icon.component';

@NgModule({
  declarations: [
    LateralBarComponent,
    IconComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LateralBarComponent
  ]
})
export class SharedModule { }
