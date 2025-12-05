import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlumnosService } from '../../services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public fechaMaxima: Date = new Date();


  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public idUser: Number = 0;

  constructor(
    private router: Router,
    private location : Location,
    private alumnosService : AlumnosService,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,

  ) { }

  ngOnInit(): void {
    console.log("Datos recibidos en registro-alumno:", this.datos_user);

  if(this.datos_user && this.datos_user.tipo_usuario) {
    this.editar = true;
    this.alumno = { ...this.datos_user };
    this.idUser = this.datos_user.id;

    console.log("Modo edición - Admin data:", this.alumno);
  } else {
    this.alumno = this.alumnosService.esquemaAlumnos();
    this.alumno.rol = this.rol;
    this.token = this.facadeService.getSessionToken();
    console.log("Modo registro nuevo");
  }
  }

  public regresar(){
    this.location.back();
  }

  public registrar(): boolean {
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);

  if (Object.keys(this.errors).length > 0) {
    return false;
  }

  //Validar si las contraseñas coinciden
  if(this.alumno.password != this.alumno.confirmar_password){
    alert('Las contraseñas no coinciden');
    return false;
  }

  //Consumir servicio para registrar
  this.alumnosService.registrarAlumno(this.alumno).subscribe({
    next: (response:any) => {
      //Aqui va la ejecucion del servicio si todo es correcto
      alert('Alumno creado con exito');
      console.log("Alumno registrado",response);

      //Validar si se registro que entonces navegue a la lista de administradores
      if(this.token && this.token !== ""){
        this.router.navigate(['alumno']);
      }else{
      this.router.navigate(['/']);
      }
    },
    error: (error:any) => {
      if(error.status === 422){
        this.errors = error.error.errors;
      }else{
        alert('Error al registrar el alumno');
      }
    }
  });
  return true;
  }

  public actualizar(){
// Validación de los datos
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if(Object.keys(this.errors).length > 0){
      return ;
    }
    // Ejecutamos el servicio de actualización
    this.alumnosService.actualizarAlumno(this.alumno).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Alumno actualizado exitosamente");
        console.log("Alumno actualizado: ", response);
        this.router.navigate(["alumnos"]);
      },
      (error) => {
        // Manejar errores de la API
        alert("Error al actualizar alumno");
        console.error("Error al actualizar alumno: ", error);
      }
    );

  }

  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  //Función para detectar el cambio de fecha
public changeFecha(event: any){
  console.log("Evento de fecha:", event);

  if (event.value) {
    // Formatear la fecha como YYYY-MM-DD para Django
    const date = new Date(event.value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    this.alumno.fechaN = `${year}-${month}-${day}`;
    console.log("Fecha formateada para Django:", this.alumno.fechaN);
  }
}

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

}
