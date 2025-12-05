import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarModalComponent } from 'src/app/modals/editar-modal/editar-modal.component';


@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_materia: any = {};
  @Input() esEdicion: boolean = false;


  public materia:any = {};
  public errors:any = {};
  public editar: boolean = false;
  public token: string = "";
  public idMateria: Number = 0;

  //Lista de maestros para el select de profesor asignado
  public listaMaestros: any[] = [];

  //Para el select de programa educativo
  public programasEducativos: any[] = [
    {value: 'Ingeniería en Ciencias de la Computación', viewValue: 'Ingeniería en Ciencias de la Computación'},
    {value: 'Licenciatura en Ciencias de la Computación', viewValue: 'Licenciatura en Ciencias de la Computación'},
    {value: 'Ingeniería en Tecnologías de la Información', viewValue: 'Ingeniería en Tecnologías de la Información'},
  ];

  //Para los checkbox de días
  public diasSemana:any[] = [
    {value: 'Lunes', nombre: 'Lunes'},
    {value: 'Martes', nombre: 'Martes'},
    {value: 'Miércoles', nombre: 'Miércoles'},
    {value: 'Jueves', nombre: 'Jueves'},
    {value: 'Viernes', nombre: 'Viernes'},
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private materiasService : MateriasService,
    private maestrosService : MaestrosService,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {

    // Cargar lista de maestros
    this.cargarMaestros();

    if(this.datos_materia && this.datos_materia.id) {

        this.editar = true;
        this.idMateria = this.datos_materia.id;
        this.materia = JSON.parse(JSON.stringify(this.datos_materia));

        // PROCESAR DIAS_JSON
        if (this.materia.dias_json) {
            let diasProcesados: any[] = [];

            if (typeof this.materia.dias_json === 'string') {
                try {
                    const parsed = JSON.parse(this.materia.dias_json);
                    diasProcesados = Array.isArray(parsed) ? parsed : [];
                } catch (e) {
                    diasProcesados = [];
                }
            } else if (Array.isArray(this.materia.dias_json)) {
                diasProcesados = this.materia.dias_json;
            }


            this.materia.dias_json = diasProcesados;

        } else {
            this.materia.dias_json = [];
        }


    if (this.materia.profesor && this.materia.profesor.id) {
      this.materia.profesor_id = Number(this.materia.profesor.id);
      console.log("Profesor ID asignado (como número):", this.materia.profesor_id);
    } else if (this.materia.profesor_id) {
      this.materia.profesor_id = Number(this.materia.profesor_id);
    }

    // CORRECCIÓN para las horas: quitar segundos
    if (this.materia.hora_i && this.materia.hora_i.includes(':')) {
      this.materia.hora_i = this.materia.hora_i.substring(0, 5);
    }

    if (this.materia.hora_f && this.materia.hora_f.includes(':')) {
      this.materia.hora_f = this.materia.hora_f.substring(0, 5);
    }


    setTimeout(() => {
      if (this.materia.dias_json && Array.isArray(this.materia.dias_json)) {
        this.diasSemana.forEach(dia => {
          const seleccionada = this.revisarSeleccionDia(dia.nombre);
        });
      }
    }, 0);

  } else {
    // Registro nuevo
    this.materia = this.materiasService.esquemaMateria();
    this.token = this.facadeService.getSessionToken();
    this.materia.dias_json = [];
    console.log("Modo registro nuevo");
  }

  }


  public cargarMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe({
      next: (response: any) => {
        this.listaMaestros = response;
      },
      error: (error: any) => {
        console.error("Error al cargar maestros:", error);
        alert("Error al cargar la lista de maestros");
      }
    });
  }

    // Método para convertir formato de hora
  private formatTimeForBackend(timeString: string): string {
    if (!timeString) return '';

    console.log("DEBUG - Formateando hora:", timeString);

    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return timeString;
    }

    if (timeString.match(/^\d{2}:\d{2}$/)) {
      return timeString + ':00';
    }

    try {
      const [time, modifier] = timeString.split(' ');
      let [hours, minutes] = time.split(':');

      if (modifier === 'PM' && hours !== '12') {
        hours = String(parseInt(hours, 10) + 12);
      }
      if (modifier === 'AM' && hours === '12') {
        hours = '00';
      }

      hours = hours.padStart(2, '0');
      minutes = minutes.padStart(2, '0');

      const formattedTime = `${hours}:${minutes}:00`;

      return formattedTime;
    } catch (error) {
      console.error("Error convirtiendo hora:", error);
      return timeString;
    }
  }


  public regresar(){
    this.location.back();
  }

  public registrar(): boolean {
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materia, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // Convertir campos y formatear horas
    this.materia.seccion = parseInt(this.materia.seccion);
    this.materia.creditos = parseInt(this.materia.creditos);
    this.materia.profesor_id = parseInt(this.materia.profesor_id);

    // Fortamer horas para el backend
    if (this.materia.hora_i) {
      this.materia.hora_i = this.formatTimeForBackend(this.materia.hora_i);
    }

    if (this.materia.hora_f) {
      this.materia.hora_f = this.formatTimeForBackend(this.materia.hora_f);
    }


    this.materiasService.registrarMateria(this.materia).subscribe({
      next: (response:any) => {
        alert('Materia creada con éxito');
        this.router.navigate(['lista-materias']);
      },
      error: (error:any) => {
        console.error("Error al registrar materia:", error);
        if(error.status === 422){
          this.errors = error.error.errors;
        }else if(error.status === 400){
          alert(error.error.error || 'Error al registrar la materia');
        }else{
          alert('Error al registrar la materia');
        }
      }
    });
    return true;
  }



  //Detecta cambios en checkbox
  public checkboxChangeDias(event: any) {


    if (!this.materia.dias_json) {
        this.materia.dias_json = [];
    }

    const diaValue = event.source.value.toString();

    if (event.checked) {

        if (!this.materia.dias_json.includes(diaValue)) {
            this.materia.dias_json.push(diaValue);
        }
    } else {

        const index = this.materia.dias_json.indexOf(diaValue);
        if (index > -1) {
            this.materia.dias_json.splice(index, 1);
        }
    }

  }

  public revisarSeleccionDia(diaValue: string){


    if (!this.materia.dias_json || !Array.isArray(this.materia.dias_json)) {
        return false;
    }

    // Convertir a string para comparación
    const diaValueStr = diaValue.toString();
    const existe = this.materia.dias_json.some((dia: any) =>
        dia.toString() === diaValueStr
    );

    return existe;
  }

  public actualizar() {
    // Primero validación de los datos
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // Abrir modal de confirmación
    const dialogRef = this.dialog.open(EditarModalComponent, {
      data: {
        tipo: 'Materia',
        titulo: 'Actualizar Materia',
        mensaje: `¿Estás seguro de actualizar la materia "${this.materia.name}" (NRC: ${this.materia.nrc})?`
      },
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmado) {

        // Convertir campos numéricos
        this.materia.seccion = parseInt(this.materia.seccion);
        this.materia.creditos = parseInt(this.materia.creditos);
        this.materia.profesor_id = parseInt(this.materia.profesor_id);

        // Ejecutamos el servicio de actualización
        this.materiasService.actualizarMateria(this.materia).subscribe(
          (response) => {
            alert("Materia actualizada exitosamente");
            console.log("Materia actualizada: ", response);
            this.router.navigate(["materias"]);
          },
          (error) => {
            console.error("Error al actualizar materia: ", error);
            if (error.status === 400) {
              alert(error.error.error || 'Error al actualizar la materia');
            } else {
              alert("Error al actualizar materia");
            }
          }
        );
      } else {
        console.log("Usuario canceló la edición");
      }
    });
  }

  // Validación de inputs
  public soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 48 && charCode <= 57) &&
      charCode !== 8 &&
      charCode !== 9 &&
      charCode !== 37 &&
      charCode !== 39
    ) {
      event.preventDefault();
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

  // Validación de salón
  public alfanumericoConEspacios(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      !(charCode >= 48 && charCode <= 57) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }

  // Función para formatear hora
  public formatearHora(event: any, campo: string) {
    let valor = event.target.value;

    valor = valor.replace(/[^0-9:]/g, '');
    if (valor.length === 2 && !valor.includes(':')) {
      valor = valor + ':';
    }
    if (valor.length > 5) {
      valor = valor.substring(0, 5);
    }

    this.materia[campo] = valor;
  }
}
