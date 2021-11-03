import { Component, OnInit } from '@angular/core';
import { DataMenuLista } from '../../Modelos/DataMenuLista';
import MenuLista from '../../Modelos/MenuList';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DataMenuService } from '../../Servicios/data-menu.service';
import { LocalstorageService } from '../../Servicios/localstorage.service';
import { LoadingService } from '../../Servicios/loading.service';
import { ListaProducto } from 'src/app/modulo-inventario/Modelos/lista-producto';

@Component({
  selector: 'app-root',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

    notificacion:number = 0
    ListaMenu:Array<MenuLista> = DataMenuLista
    DataCarrito!:Array<ListaProducto>;
    cerrarNav: boolean = false
    VerCargar = this.cargando.$cargando
    isHandset$: Observable<boolean> = this.breakpointObserver.observe([
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ]).pipe(
      map(result => result.matches),
      shareReplay()
    );
    VerMenu$ = this._DataMenu.VerMenu

  constructor(
    private breakpointObserver: BreakpointObserver,
    public _DataMenu:DataMenuService,
    private local:LocalstorageService,
    public cargando:LoadingService
  ) { }

  ngOnInit(): void {
    this.isHandset$.subscribe((data: boolean) => {
        if (this._DataMenu.EstadoMenu())
        this.cerrarNav = data
        else this.cerrarNav = false
    })
    this._DataMenu.MenuLista.subscribe( (data:string[]) => this.ComprobarMenu(data))
    this._DataMenu.Notificacion.subscribe(()=>this.verificarNotificacion())
    this._DataMenu.CambioDispositivo.subscribe((data:boolean)=>this.cerrarNav = data)
  }

  verificarNotificacion(){
    this.notificacion=0;
   if(this.local.GetStorage('DataCarrito') != null){
     this.DataCarrito=this.local.GetStorage('DataCarrito');
     for(var i=0;i<this.DataCarrito.length && this.DataCarrito!=null;i++){
       this.notificacion+=this.DataCarrito[i].cantidad
     }
    }
}
  ComprobarMenu(roles:string []): void{
    this.ListaMenu.forEach( (data2:MenuLista, index:number) => {
      let detener = true
     for (let i=0; i < data2.permisos.length && detener ; i++){
           if(roles.includes(data2.permisos[i])){
            this.ListaMenu[index].default = true
            detener = false
           }else this.ListaMenu[index].default = false
      }
    })
  }

  onActivate($event: Event): void{
   console.log($event)
  }

  onDeactivate($event: Event): void {
    console.log($event)
  }

  logOut(): void{
    this.local.RemoveAll()
    this._DataMenu.CerrarMenu()
  }

}
