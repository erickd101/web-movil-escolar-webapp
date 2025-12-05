import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-modal',
  templateUrl: './editar-modal.component.html',
  styleUrls: ['./editar-modal.component.scss']
})
export class EditarModalComponent implements OnInit {

  public titulo: string = "";
  public mensaje: string = "";
  public tipo: string = "";

  constructor(
    private dialogRef: MatDialogRef<EditarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.tipo = this.data.tipo || 'elemento';

    switch(this.tipo) {
      case 'Administrador':
        this.titulo = 'Actualizar Administrador';
        this.mensaje = 'Estás a punto de actualizar los datos de este administrador. ¿Estás seguro de continuar?';
        break;
      case 'Maestro':
        this.titulo = 'Actualizar Maestro';
        this.mensaje = 'Estás a punto de actualizar los datos de este maestro. ¿Estás seguro de continuar?';
        break;
      case 'Alumno':
        this.titulo = 'Actualizar Alumno';
        this.mensaje = 'Estás a punto de actualizar los datos de este alumno. ¿Estás seguro de continuar?';
        break;
      case 'Materia':
        this.titulo = 'Actualizar Materia';
        this.mensaje = 'Estás a punto de actualizar los datos de esta materia. ¿Estás seguro de continuar?';
        break;
      default:
        this.titulo = 'Actualizar';
        this.mensaje = 'Estás a punto de actualizar este elemento. ¿Estás seguro de continuar?';
    }

    if (this.data.titulo) this.titulo = this.data.titulo;
    if (this.data.mensaje) this.mensaje = this.data.mensaje;
  }

  public cerrar_modal(){
    this.dialogRef.close({confirmado: false});
  }

  public confirmarEdicion(){
    this.dialogRef.close({confirmado: true});
  }
}
