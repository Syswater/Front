import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LateralBarComponent } from './lateral-bar/lateral-bar.component';
import { IconComponent } from './icon/icon.component';
import { ModalComponent } from './modal/modal.component';
import { MaterialModule } from '../material/material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { CircleButtonComponent } from './circle-button/circle-button.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { FormatNumberPipe } from './pipes/format-number.pipe';
import { ScrolldetectorDirective } from './directives/scrolldetector.directive';
import { OnlyNumbersAndDashesDirective } from './directives/only-numbers-and-dashes.directive';

@NgModule({
  declarations: [
    LateralBarComponent,
    IconComponent,
    ModalComponent,
    SpinnerComponent,
    CircleButtonComponent,
    ConfirmationComponent,
    FormatNumberPipe,
    ScrolldetectorDirective,
    OnlyNumbersAndDashesDirective,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    LateralBarComponent,
    ModalComponent,
    IconComponent,
    SpinnerComponent,
    CircleButtonComponent,
    ConfirmationComponent,
    FormatNumberPipe,
    ScrolldetectorDirective,
    OnlyNumbersAndDashesDirective
  ]
})
export class SharedModule { }
