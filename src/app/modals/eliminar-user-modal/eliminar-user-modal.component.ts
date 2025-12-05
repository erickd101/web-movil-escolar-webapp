import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-eliminar-user-modal',
  templateUrl: './eliminar-user-modal.component.html',
  styleUrls: ['./eliminar-user-modal.component.scss']
})
export class EliminarUserModalComponent implements OnInit {

  public rol: string = "";
  public titulo: string = "";
  public mensaje: string = "";

  constructor(
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
    private materiasService: MateriasService,
    private dialogRef: MatDialogRef<EliminarUserModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.rol = this.data.rol;

    // Personalizar mensaje según el tipo
    switch(this.rol) {
      case 'Administrador':
        this.titulo = 'Eliminar Administrador';
        this.mensaje = '¿Estás seguro de que deseas eliminar este administrador?';
        break;
      case 'Maestro':
        this.titulo = 'Eliminar Maestro';
        this.mensaje = '¿Estás seguro de que deseas eliminar este maestro?';
        break;
      case 'Alumno':
        this.titulo = 'Eliminar Alumno';
        this.mensaje = '¿Estás seguro de que deseas eliminar este alumno?';
        break;
      case 'Materia':
        this.titulo = 'Eliminar Materia';
        this.mensaje = '¿Estás seguro de que deseas eliminar esta materia?';
        break;
      default:
        this.titulo = 'Eliminar';
        this.mensaje = '¿Estás seguro de que deseas eliminar este elemento?';
    }
  }

  public cerrar_modal(){
    this.dialogRef.close({isDelete:false});
  }

  public eliminarUser(){
    if(this.rol == "Administrador"){
      // Entonces elimina un administrador
      this.administradoresService.eliminarAdmin(this.data.id).subscribe(
        (response)=>{
          console.log(response);
          this.dialogRef.close({isDelete:true});
        }, (error)=>{
          this.dialogRef.close({isDelete:false});
        }
      );

    }else if(this.rol == "Maestro"){
      // Entonces elimina un maestro
      this.maestrosService.eliminarMaestro(this.data.id).subscribe(
        (response)=>{
          console.log(response);
          this.dialogRef.close({isDelete:true});
        }, (error)=>{
          this.dialogRef.close({isDelete:false});
        }
      );

    }else if(this.rol == "Alumno"){
      // Entonces elimina un alumno
      this.alumnosService.eliminarAlumno(this.data.id).subscribe(
        (response:any)=>{
          console.log(response);
          this.dialogRef.close({isDelete:true});
        }, (error:any)=>{
          this.dialogRef.close({isDelete:false});
        }
      );
    }else if(this.rol == "Materia"){
      // Entonces elimina una materia
      this.materiasService.eliminarMateria(this.data.id).subscribe(
        (response:any)=>{
          console.log(response);
          this.dialogRef.close({isDelete:true});
        }, (error:any)=>{
          this.dialogRef.close({isDelete:false});
        }
      );
    }

  }

}
