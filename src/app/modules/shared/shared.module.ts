import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LateralBarComponent } from './lateral-bar/lateral-bar.component';
import { IconComponent } from './icon/icon.component';
import { ModalComponent } from './modal/modal.component';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    LateralBarComponent,
    IconComponent,
    ModalComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    LateralBarComponent,
    ModalComponent,
    IconComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
