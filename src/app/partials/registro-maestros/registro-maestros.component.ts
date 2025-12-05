import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public fechaMaxima: Date = new Date();


  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public maestro:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;


  //Para el select
  public areas: any[] = [
    {value: '1', viewValue: 'Desarrollo Web'},
    {value: '2', viewValue: 'Programación'},
    {value: '3', viewValue: 'Bases de datos'},
    {value: '4', viewValue: 'Redes'},
    {value: '5', viewValue: 'Matemáticas'},
  ];

  public materias:any[] = [
    {value: '1', nombre: 'Aplicaciones Web'},
    {value: '2', nombre: 'Programación 1'},
    {value: '3', nombre: 'Bases de datos'},
    {value: '4', nombre: 'Tecnologías Web'},
    {value: '5', nombre: 'Minería de datos'},
    {value: '6', nombre: 'Desarrollo móvil'},
    {value: '7', nombre: 'Estructuras de datos'},
    {value: '8', nombre: 'Administración de redes'},
    {value: '9', nombre: 'Ingeniería de Software'},
    {value: '10', nombre: 'Administración de S.O.'},
  ];

  constructor(
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private maestrosService : MaestrosService,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
    console.log("Datos recibidos en registro-maestros:", this.datos_user);

    if(this.datos_user && this.datos_user.tipo_usuario) {
        // MODO EDICIÓN
        this.editar = true;
        this.idUser = this.datos_user.id;
        this.maestro = JSON.parse(JSON.stringify(this.datos_user));
        //  PROCESAR MATERIAS_JSON CON LÓGICA CORREGIDA
        if (this.maestro.materias_json) {

            let materiasProcesadas: any[] = [];

            if (typeof this.maestro.materias_json === 'string') {
                try {
                    const parsed = JSON.parse(this.maestro.materias_json);

                    //  ASIGNACIÓN DIRECTA - SIN CONDICIONES COMPLEJAS
                    materiasProcesadas = Array.isArray(parsed) ? parsed : [];
                } catch (e) {

                    materiasProcesadas = [];
                }
            } else if (Array.isArray(this.maestro.materias_json)) {

                materiasProcesadas = this.maestro.materias_json;
            }

            // ASIGNAR DIRECTAMENTE SIN MÁS VALIDACIONES
            this.maestro.materias_json = materiasProcesadas;

        } else {
            this.maestro.materias_json = [];
        }


        //  VERIFICACIÓN INMEDIATA DE LAS MATERIAS
        setTimeout(() => {

            if (this.maestro.materias_json && Array.isArray(this.maestro.materias_json)) {
                this.materias.forEach(materia => {
                    const seleccionada = this.revisarSeleccion(materia.nombre);
                    console.log(`   - ${materia.nombre}: ${seleccionada ? ' SELECCIONADA' : ' NO SELECCIONADA'}`);
                });
            }
        }, 0);

    } else {
        // MODO REGISTRO NUEVO
        this.maestro = this.maestrosService.esquemaMaestros();
        this.maestro.rol = this.rol;
        this.token = this.facadeService.getSessionToken();
        this.maestro.materias_json = [];
        console.log(" Modo registro nuevo");
    }
}


  public regresar(){
    this.location.back();
  }

    public registrar(): boolean {
          this.errors = {};
          this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

        if (Object.keys(this.errors).length > 0) {
          return false;
        }

        //Validar si las contraseñas coinciden
        if(this.maestro.password != this.maestro.confirmar_password){
          alert('Las contraseñas no coinciden');
          return false;
        }

        //Consumir servicio para registrar administradores
        this.maestrosService.registrarMaestro(this.maestro).subscribe({
          next: (response:any) => {
            //Aqui va la ejecucion del servicio si todo es correcto
            alert('Maestro creado con exito');
            console.log("Maestro registrado",response);

            //Validar si se registro que entonces navegue a la lista de administradores
            if(this.token != ""){
              this.router.navigate(['maestro']);
            }else{
            this.router.navigate(['/']);
            }
          },
          error: (error:any) => {
            if(error.status === 422){
              this.errors = error.error.errors;
            }else{
              alert('Error al registrar al maestro');
            }
          }
        });
        return true;
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

  if (event.value) {
    // Formatear la fecha
    const date = new Date(event.value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    this.maestro.fechaN = `${year}-${month}-${day}`;
  }
}

public checkboxChange(event: any) {
   

    // Asegurar que materias_json sea un array
    if (!this.maestro.materias_json) {
        this.maestro.materias_json = [];
    }

    const materiaValue = event.source.value.toString();

    if (event.checked) {
        // Agregar si no existe
        if (!this.maestro.materias_json.includes(materiaValue)) {
            this.maestro.materias_json.push(materiaValue);
        }
    } else {
        // Remover si existe
        const index = this.maestro.materias_json.indexOf(materiaValue);
        if (index > -1) {
            this.maestro.materias_json.splice(index, 1);
        }
    }

}



  public revisarSeleccion(materiaValue: string){


    if (!this.maestro.materias_json || !Array.isArray(this.maestro.materias_json)) {
        return false;
    }

    // Convertir a string para comparación segura
    const materiaValueStr = materiaValue.toString();
    const existe = this.maestro.materias_json.some((materia: any) =>
        materia.toString() === materiaValueStr
    );

    return existe;
  }

  public actualizar(){
// Validación de los datos
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if(Object.keys(this.errors).length > 0){
      return ;
    }
    // Ejecutamos el servicio de actualización
    this.maestrosService.actualizarMaestro(this.maestro).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Maestro actualizado exitosamente");
        console.log("Maestro actualizado: ", response);
        this.router.navigate(["maestro"]);
      },
      (error) => {
        // Manejar errores de la API
        alert("Error al actualizar maestro");
        console.error("Error al actualizar maestro: ", error);
      }
    );

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
