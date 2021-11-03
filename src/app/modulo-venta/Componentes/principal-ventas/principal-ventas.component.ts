import { Component, OnInit,AfterContentInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Inventario } from 'src/app/modulo-inventario/Modelos/inventario';
import { ListaProducto } from 'src/app/modulo-inventario/Modelos/lista-producto';
import { updatePollo } from 'src/app/modulo-inventario/Modelos/updatePollo';
import { InventarioService } from 'src/app/modulo-inventario/Servicios/inventario.service';
import { DataMenuService } from 'src/app/modulo-principal/Servicios/data-menu.service';
import { LocalstorageService } from 'src/app/modulo-principal/Servicios/localstorage.service';
import { TokenServiceService } from 'src/app/modulo-principal/Servicios/token-service.service';


@Component({
  selector: 'app-principal-ventas',
  templateUrl: './principal-ventas.component.html',
  styleUrls: ['./principal-ventas.component.css']
})
export class PrincipalVentasComponent implements OnInit, AfterContentInit{

  platos:Array<ListaProducto> = []
  bebidas:Array<ListaProducto> = []
  combos:Array<ListaProducto> = []
  porciones:Array<ListaProducto> = []
  carrito:Array<ListaProducto> = []
  productLista!:Array<Inventario>;
  update?:updatePollo;
  buscar:string='';
  displayedColumns:string[] = ['agregar', 'Nombre', 'sumar'];

  constructor(private mensaje:ToastrService,
              private __servicioPro:InventarioService,
              private token:TokenServiceService,
              private _dataMenu:DataMenuService,
              private local: LocalstorageService,
              )
  {}


  ngAfterContentInit() {
      setTimeout(() => {
        this._dataMenu.SetNombreUsuario(this.token.getUser());
        this._dataMenu.SetMenuLista(this.token.getAuth())
        if(this.token.getToken() && !this.token.TokenExpirado()){
          this._dataMenu.AbrirMenu()
          this._dataMenu.CambioDispositivo.emit(!this.detectarDispositivo())
        }
      });
    }

  ngOnInit() {
    if(this.local.GetStorage('DataCarrito'))this.carrito=this.local.GetStorage('DataCarrito');
    this.llenarListas();
    this.__servicioPro.listarpollo()
    .subscribe((data:updatePollo)=>{
       this._dataMenu.pollo=data.pollo;
       this._dataMenu.presa=data.presa;
       this.local.SetStorage("pollos",new updatePollo(this._dataMenu.pollo,this._dataMenu.presa));
     },()=> this.local.SetStorage("pollos",new updatePollo(0,0)))
  }

  detectarDispositivo():boolean{
    var valor:boolean=false;
      if( navigator.userAgent.match(/Android/i))
          valor=true
      if(navigator.userAgent.match(/webOS/i))
          valor=false
      if(navigator.userAgent.match(/iPhone/i))
        valor=true
    return valor
  }
  llenarListas():void
  {
    this.productLista=this.local.GetStorage("listaProducto");
    if(this.productLista){
      this.productLista=this.local.GetStorage("listaProducto");
      this.llenarTabla();
    }else{
    this.__servicioPro.listarInventartio()
    .subscribe((data:Inventario[]) => {
      this.local.SetStorage("listaProducto",data);
     this.productLista = data
     this.llenarTabla();
    });
    }
  }

    llenarTabla():void{
    for (let index = 0; index < this.productLista.length ;index++) {
      switch (this.productLista[index].producto.tipo) {
        case 'platos':
          this.platos.push(new ListaProducto(this.productLista[index].producto.id,
            this.productLista[index].producto.nombre,
            this.productLista[index].producto.tipo,
            this.productLista[index].cantidadExiste,
            this.productLista[index].producto.precio,
            this.productLista[index].producto.presa,
            this.productLista[index].extras
            ));
          break;

        case 'bebidas':
          this.bebidas.push(new ListaProducto(this.productLista[index].producto.id,
            this.productLista[index].producto.nombre,
            this.productLista[index].producto.tipo,
            this.productLista[index].cantidadExiste,
            this.productLista[index].producto.precio,
            this.productLista[index].producto.presa,
            this.productLista[index].extras
            ));
          break;

        case 'combos':
          this.combos.push(new ListaProducto(this.productLista[index].producto.id,
            this.productLista[index].producto.nombre,
            this.productLista[index].producto.tipo,
            this.productLista[index].cantidadExiste,
            this.productLista[index].producto.precio,
            this.productLista[index].producto.presa,
            this.productLista[index].extras
            ));
          break;

        case 'porciones':
          this.productLista[index].cantidad=1;
          this.porciones.push(new ListaProducto(this.productLista[index].producto.id,
            this.productLista[index].producto.nombre,
            this.productLista[index].producto.tipo,
            this.productLista[index].cantidadExiste,
            this.productLista[index].producto.precio,
            this.productLista[index].producto.presa,
            this.productLista[index].extras
            ));
          break;
      }
    }
  }

  sumar(val:number,plato:string):void{

     switch (plato) {
       case 'platos':
        this.platos[val].cantidad++;
         break;
       case 'bebidas':
        this.bebidas[val].cantidad++;
       break;
       case 'combos':
        this.combos[val].cantidad++;
        break;
        case 'porciones':
          this.porciones[val].cantidad++;
          break;
     }


  }
  restar(val:number,pla:string):void{
    switch (pla) {
      case 'platos':
        if(this.platos[val].cantidad > 1) this.platos[val].cantidad--;
        break;
      case 'bebidas':
        if(this.bebidas[val].cantidad > 1)this.bebidas[val].cantidad--;
      break;
      case 'combos':
        if(this.combos[val].cantidad > 1) this.combos[val].cantidad--;
       break;
       case 'porciones':
         if(this.porciones[val].cantidad > 1)this.porciones[val].cantidad--;
         break;
     }
  }

  AgregarCarrito(index:number,tipo:string):void{

    switch (tipo) {
      case 'platos':
          if(this.verificar(index,tipo))this.carrito.push(this.platos[index]);
          if(this.platos[index].cantidadExiste <= 0)this.mensaje.warning('Actualice inventario de '+this.platos[index].nombre,'Advertencia');
          else this.mensaje.success('Se agrego '+this.platos[index].nombre+' al carrito','Exitoso');
        break;

      case 'bebidas':
        if(this.verificar(index,tipo)) this.carrito.push(this.bebidas[index]);
        if(this.bebidas[index].cantidadExiste <= 0)this.mensaje.warning('Actualice inventario de '+this.bebidas[index].nombre,'Advertencia');
        else this.mensaje.success('Se agrego '+this.bebidas[index].nombre+' al carrito','Exitoso');
        break;

      case 'combos':
        if(this.verificar(index,tipo))this.carrito.push(this.combos[index])
        if(this.combos[index].cantidadExiste <= 0)this.mensaje.warning('Actualice inventario de '+this.combos[index].nombre,'Advertencia');
        else this.mensaje.success('Se agrego '+this.combos[index].nombre+' al carrito','Exitoso');
        break;

        case 'porciones':
          if(this.verificar(index,tipo))this.carrito.push(this.porciones[index])
          if(this.porciones[index].cantidadExiste <= 0)this.mensaje.warning('Actualice inventario de '+this.porciones[index].nombre,'Advertencia');
          else this.mensaje.success('Se agrego '+this.porciones[index].nombre+' al carrito','Exitoso');
          break;
    }
       this.local.SetStorage('DataCarrito',this.carrito);
       this._dataMenu.Notificacion.emit(1);
  }

  verificar(index:number,tipo:string):boolean
  {
    let val:boolean=true;
    if(this.local.GetStorage("DataCarrito")){
      switch (tipo) {
        case 'platos':
          this.carrito.forEach(car => {
           if(car.nombre===this.platos[index].nombre){
             car.cantidad+=this.platos[index].cantidad;
             val=false;
             this.local.SetStorage('DataCarrito',this.carrito);
           }
          });
          break;

        case 'bebidas':
     this.carrito.forEach(car => {
      if(car.nombre===this.bebidas[index].nombre){
        car.cantidad+=this.bebidas[index].cantidad;
        val=false;
        this.local.SetStorage('DataCarrito',this.carrito);
      }
     });
          break;

          case 'combos':
            this.carrito.forEach(car => {
              if(car.nombre===this.combos[index].nombre){
                car.cantidad+=this.combos[index].cantidad;
                val=false;
                this.local.SetStorage('DataCarrito',this.carrito);
              }
             });
             break;
          case 'porciones':
            this.carrito.forEach(car => {
              if(car.nombre===this.porciones[index].nombre){
                car.cantidad+=this.porciones[index].cantidad;
                val=false;
                this.local.SetStorage('DataCarrito',this.carrito);
              }
             });
             break;
      }
    }
    return val;
  }

}
