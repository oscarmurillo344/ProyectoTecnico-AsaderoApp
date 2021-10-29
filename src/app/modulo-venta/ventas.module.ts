import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';


import { PagarService } from './Servicios/pagar.service';

import { PrincipalVentasComponent } from './Componentes/principal-ventas/principal-ventas.component';
import { FacturarVentasComponent } from './Componentes/facturar-ventas/facturar-ventas.component';
import { EliminarVentasComponent } from './Componentes/eliminar-ventas/eliminar-ventas.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../modulo-material/material.module';



@NgModule({
  declarations: [PrincipalVentasComponent, FacturarVentasComponent, EliminarVentasComponent],
  imports: [
    CommonModule,
    MaterialModule,
    VentasRoutingModule,
    FormsModule
    ],
  exports:[
    PrincipalVentasComponent
  ],
  providers:[
    PagarService
  ]
})
export class VentasModule { }
