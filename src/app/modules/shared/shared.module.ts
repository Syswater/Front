import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LateralBarComponent } from './lateral-bar/lateral-bar.component';
import { IconComponent } from './icon/icon.component';
import { ModalComponent } from './modal/modal.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    LateralBarComponent,
    IconComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    LateralBarComponent,
    ModalComponent,
    IconComponent
  ]
})
export class SharedModule { }
