import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { DataMenuService } from 'src/app/modulo-principal/Servicios/data-menu.service';
import { TokenServiceService } from 'src/app/modulo-principal/Servicios/token-service.service';
import { jwtDTO } from '../../Modelos/jwt-to';
import { LoginUsuario } from '../../Modelos/loginUsuario';
import { AuthService } from '../../Servicios/auth.service';

@Component({
  selector: 'vista-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  UserForm: FormGroup;
  Validar: boolean=false;
  hide=true;
  roles:string[]=[];

  constructor(private route:Router,
            private mensaje:ToastrService,
            private token:TokenServiceService,
            private Servicio_login:AuthService,
            public _dataMenu:DataMenuService)
    {
   this.UserForm=this.crearFormulario();
   }

  ngOnInit() {
   setTimeout( ()=>  this._dataMenu.CerrarMenu())
  }

  ngOnDestroy(): void {
    setTimeout( ()=>  this._dataMenu.AbrirMenu())
  }

  crearFormulario(){
    return new FormGroup({
     usuario: new FormControl('',Validators.required),
     contrasena: new FormControl('',Validators.required)
    });
  }

  LogIn(): void{
    if(this.UserForm.valid){
    var loginusu =new LoginUsuario(this.minuscula(this.UserForm.value.usuario),this.UserForm.value.contrasena);
     this.Servicio_login.LogIn(loginusu).subscribe(
        (data: jwtDTO) => {
        this.Validar=false;
        this.token.setToken("")
        var Usuario = this.token.ObtenerData()
        this.token.setUser(Usuario.user_name)
        this.token.setAuth(Usuario.authorities)
        this.mensaje.success("sesión iniciada","información");
        this.route.navigate(["ventas/inicio"])
    }, ()=> this.Validar = true)
    }else{
      this.mensaje.info("Formulario invalido", "Informacion")
    }
  }

  public minuscula(texto:string):string{
   return texto.toLocaleLowerCase();
  }

}
