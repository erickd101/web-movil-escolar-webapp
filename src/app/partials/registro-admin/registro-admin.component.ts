import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss']
})
export class RegistroAdminComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public admin:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private administradoresService: AdministradoresService,
    private facadeService: FacadeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log("Datos recibidos en registro-admin:", this.datos_user);

  if(this.datos_user && this.datos_user.tipo_usuario) {
    this.editar = true;
    this.admin = { ...this.datos_user };
    this.idUser = this.datos_user.id;

    console.log("Modo edición - Admin data:", this.admin);
  } else {
    this.admin = this.administradoresService.esquemaAdmin();
    this.admin.rol = this.rol;
    this.token = this.facadeService.getSessionToken();
    console.log("Modo registro nuevo");
  }
  }

  public regresar(){
    this.location.back();
  }

  public showPassword(){
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar(){
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

public registrar(): boolean {
  this.errors = {};
  this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);

  if (Object.keys(this.errors).length > 0) {
    return false;
  }

  //Validar si las contraseñas coinciden
  if(this.admin.password != this.admin.confirmar_password){
    alert('Las contraseñas no coinciden');
    return false;
  }

  //Consumir servicio para registrar administradores
  this.administradoresService.registrarAdmin(this.admin).subscribe({
    next: (response:any) => {
      //Aqui va la ejecucion del servicio si todo es correcto
      alert('Administrador creado con exito');
      console.log("Admin registrado",response);

      //Validar si se registro que entonces navegue a la lista de administradores
      if(this.token != ""){
        this.router.navigate(['administrador']);
      }else{
      this.router.navigate(['/']);
      }
    },
    error: (error:any) => {
      if(error.status === 422){
        this.errors = error.error.errors;
      }else{
        alert('Error al registrar el administrador');
      }
    }
  });
  return true;
}

  public actualizar(){
// Validación de los datos
    this.errors = {};
    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);
    if(Object.keys(this.errors).length > 0){
      return ;
    }
    // Ejecutamos el servicio de actualización
    this.administradoresService.actualizarAdmin(this.admin).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Administrador actualizado exitosamente");
        console.log("Administrador actualizado: ", response);
        this.router.navigate(["administrador"]);
      },
      (error) => {
        // Manejar errores de la API
        alert("Error al actualizar administrador");
        console.error("Error al actualizar administrador: ", error);
      }
    );

  }

  public soloLetras(event: KeyboardEvent){
    const charCode = event.key.charCodeAt(0);

    if(
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ){
      event.preventDefault();
    }
  }

}
