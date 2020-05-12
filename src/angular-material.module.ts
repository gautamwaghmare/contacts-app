import { NgModule } from '@angular/core';

import { 
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTooltipModule,
    MatTableModule
  } from '@angular/material'


@NgModule({
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatRadioModule,
        MatTooltipModule,
        MatTableModule
    ]
})
export class AngularMaterialModule {}