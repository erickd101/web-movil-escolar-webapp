import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit {

  public username:string = "";
  public password:string = "";
  public type: string = "password";
  public errors:any = {};
  public load:boolean = false;

  constructor(
    public router: Router,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
  }

  public login(){
    this.errors = {};
    this.errors = this.facadeService.validarLogin(this.username, this.password);
    if(Object.keys(this.errors).length > 0){
      return;
    }

    this.load = true;

    this.facadeService.login(this.username, this.password).subscribe(
      (response:any) => {
        //Guardar el token en el almacenamiento local - las cookies
        this.facadeService.saveUserData(response);
        //Redirigir segun el rol
        const role = response.rol;
        if(role === 'Administrador'){
          this.router.navigate(["/administrador"]);
        }else if(role === 'Maestro'){
          this.router.navigate(["/maestros"]);
        }else if(role === 'Alumno'){
          this.router.navigate(["/alumnos"]);
        }else {
          this.router.navigate(["home"]);
        }
        this.load = false;
      },
      (error:any) => {
        this.load = false;
        let errorMessage = "Credenciales inválidas. Por favor, inténtelo de nuevo";

        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }

        alert("Error en el login: " + errorMessage);
        this.errors.general = errorMessage;
      }
    );

  }

  public showPassword(){
    this.type = this.type === "password" ? "text" : "password";
  }

  public registrar(){
    this.router.navigate(["registro-usuarios"]);
  }
}
