import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  exports: [
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ]
})
export class MaterialModule { }
