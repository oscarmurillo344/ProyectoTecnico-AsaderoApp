import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NuevoUsuario } from "../Modelos/nuevoUsuario";
import { LoginUsuario } from "../Modelos/loginUsuario";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Mensaje } from 'src/app/modulo-principal/Modelos/mensaje';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURL=environment.UrlDesarrollo+"auth/";

  constructor(private http:HttpClient) { }

  public nuevoUser(newUser:NuevoUsuario): Observable<any>{
    return this.http.post<any>(this.authURL+'nuevo',newUser);
  }

  public LogIn(login:LoginUsuario): Observable<any>{
   let params = new URLSearchParams();
   params.set("grant_type","password")
   params.set("username",login.username)
   params.set("password",login.password)
    return this.http.post<any>(environment.UrlDesarrollo+'oauth/token',params.toString());
  }

  public ListarUsuario():Observable<NuevoUsuario[]>{
    return this.http.get<NuevoUsuario[]>(this.authURL+'listaUsu');
  }

  public EliminarUser(id:number): Observable<Mensaje>{
    return this.http.delete<Mensaje>(this.authURL+'deleteuser/'+id);
  }
}

