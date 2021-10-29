import { Component, OnInit } from '@angular/core';
import { DataMenuLista } from '../../Modelos/DataMenuLista';
import MenuLista from '../../Modelos/MenuList';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DataMenuService } from '../../Servicios/data-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

    notificacion:number = 1
    ListaMenu:Array<MenuLista> = DataMenuLista
    cerrarNav: boolean = false
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
    public _DataMenu:DataMenuService
  ) { }

  ngOnInit(): void {
    this.isHandset$.subscribe((data: boolean) => {
        if (this._DataMenu.EstadoMenu())
        this.cerrarNav = data
        else this.cerrarNav = false
    })
    this._DataMenu.MenuLista.subscribe( (data:string[]) => this.ComprobarMenu(data))
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

}
