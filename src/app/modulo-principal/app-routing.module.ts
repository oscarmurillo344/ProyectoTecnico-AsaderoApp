import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'auth', loadChildren: () => import('../modulo-usuario/usuario.module').then(m => m.UsuarioModule)},
  {path: 'ventas', loadChildren: () => import('../modulo-venta/ventas.module').then(m => m.VentasModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
