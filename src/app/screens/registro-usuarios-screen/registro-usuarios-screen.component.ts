import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MatRadioChange } from '@angular/material/radio';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { AlumnosScreenComponent } from '../alumnos-screen/alumnos-screen.component';
import { AlumnosService } from 'src/app/services/alumnos.service';


@Component({
  selector: 'app-registro-usuarios-screen',
  templateUrl: './registro-usuarios-screen.component.html',
  styleUrls: ['./registro-usuarios-screen.component.scss']
})
export class RegistroUsuariosScreenComponent implements OnInit {

  public tipo:string = "registro-usuarios";
  public user:any= {};
  public editar:boolean = false;
  public rol:string = "";
  public idUser:number = 0;

  //Banderas para el tipo de usuario
  public isAdmin:boolean = false;
  public isAlumno:boolean = false;
  public isMaestro:boolean = false;

  public tipo_user:string = "";

  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public facadeService: FacadeService,
    private administradoresService : AdministradoresService,
    private maestrosService : MaestrosService,
    private alumnosService: AlumnosService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
    console.log("Parámetros recibidos:", params);

    if(params['id'] && params['rol']) {
      this.idUser = Number(params['id']);
      this.rol = params['rol'];
      this.editar = true;

      console.log("Modo edición activado:", {
        id: this.idUser,
        rol: this.rol,
        editar: this.editar
      });

      this.obtenerUserByID();
    } else {
      console.log("Modo registro nuevo");
      this.editar = false;
    }
  });
  }

  // Función para conocer que usuario se ha elegido
  public radioChange(event: MatRadioChange) {
    if(event.value == "administrador"){
      this.isAdmin = true;
      this.isAlumno = false;
      this.isMaestro = false;
      this.tipo_user = "administrador";
    }else if (event.value == "alumno"){
      this.isAdmin = false;
      this.isAlumno = true;
      this.isMaestro = false;
      this.tipo_user = "alumno";
    }else if (event.value == "maestro"){
      this.isAdmin = false;
      this.isAlumno = false;
      this.isMaestro = true;
      this.tipo_user = "maestro";
    }
  }

  //Obtener usuario por ID
  public obtenerUserByID() {
    console.log("INICIANDO obtenerUserByID()");
    console.log("Rol:", this.rol);
    console.log("ID User:", this.idUser);

    if(this.rol == "Administrador"){
      console.log("Entrando en condición Administrador");

      this.administradoresService.obtenerAdminPorID(this.idUser).subscribe(
        (response:any) => {
          console.log("RESPUESTA DEL BACKEND:", response);

          this.user = {
            id: response.id,
            first_name: response.first_name || response.user?.first_name,
            last_name: response.last_name || response.user?.last_name,
            email: response.email || response.user?.email,
            clave_admin: response.clave_admin,
            telefono: response.telefono,
            rfc: response.rfc,
            edad: response.edad,
            ocupacion: response.ocupacion,
            tipo_usuario: 'administrador'
          };

          console.log("User final para formulario:", this.user);

          this.isAdmin = true;
          this.isAlumno = false;
          this.isMaestro = false;
          this.tipo_user = "administrador";

        },
        (error:any) => {
          console.log("Error en la petición:", error);
          alert("No se pudo obtener el administrador seleccionado");
        }
      );
    }else if(this.rol == "Maestro"){
      console.log("Entrando en condición Maestro");

      this.maestrosService.obtenerMaestroPorID(this.idUser).subscribe(
        (response:any) => {
          console.log("RESPUESTA DEL BACKEND:", response);

          this.user = {
            id: response.id,
            first_name: response.first_name || response.user?.first_name,
            last_name: response.last_name || response.user?.last_name,
            email: response.email || response.user?.email,
            clave_maestro: response.clave_maestro,
            telefono: response.telefono,
            fechaN : response.fechaN,
            rfc: response.rfc,
            cubiculo: response.cubiculo,
            area : response.area,
            materias_json: response.materias_json || '[]',
            tipo_usuario: 'maestro'
          };

          console.log("User final para formulario:", this.user);

          this.isAdmin = false;
          this.isAlumno = false;
          this.isMaestro = true;
          this.tipo_user = "maestro";

        },
        (error:any) => {
          console.log("Error en la petición:", error);
          alert("No se pudo obtener el maestro seleccionado");
        }
      );
    }
    else if(this.rol == "Alumno"){
      console.log("Entrando en condición alumno");

      this.alumnosService.obtenerAlumnoPorID(this.idUser).subscribe(
        (response:any) => {
          console.log("RESPUESTA DEL BACKEND:", response);

          this.user = {
            id: response.id,
            first_name: response.first_name || response.user?.first_name,
            last_name: response.last_name || response.user?.last_name,
            email: response.email || response.user?.email,
            clave_alumno: response.clave_alumno,
            telefono: response.telefono,
            fechaN : response.fechaN,
            rfc: response.rfc,
            edad: response.edad,
            ocupacion: response.ocupacion,
            curp: response.curp,
            tipo_usuario: 'alumno'
          };

          console.log("User final para formulario:", this.user);

          this.isAdmin = false;
          this.isAlumno = true;
          this.isMaestro = false;
          this.tipo_user = "alumno";

        },
        (error:any) => {
          console.log("Error en la petición:", error);
          alert("No se pudo obtener el alumno seleccionado");
        }
      );
    }
    else {
      console.log("Rol no reconocido:", this.rol);
    }

  }

  //Función para regresar a la pantalla anterior
  public goBack() {
    this.location.back();
  }


}
