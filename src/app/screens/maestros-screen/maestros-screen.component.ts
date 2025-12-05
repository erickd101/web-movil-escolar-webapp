import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-maestros-screen',
  templateUrl: './maestros-screen.component.html',
  styleUrls: ['./maestros-screen.component.scss']
})
export class MaestrosScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_maestros: any[] = [];
  public sortOption: string = 'clave_maestro';

  displayedColumns: string[] = ['clave_maestro', 'nombre', 'email', 'fechaN', 'telefono', 'rfc', 'cubiculo', 'area', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosUsuario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public facadeService: FacadeService,
    public maestrosService: MaestrosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();

    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    this.obtenerMaestros();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        console.log("Lista users: ", this.lista_maestros);

        if (this.lista_maestros.length > 0) {
          this.lista_maestros.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });

          this.dataSource.data = this.lista_maestros as DatosUsuario[];

          setTimeout(() => {
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
          });
        }
      }, (error:any) => {
        console.error("Error al obtener la lista de maestros: ", error);
        alert("No se pudo obtener la lista de maestros");
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortData() {
    const data = this.lista_maestros.slice();

    if (this.sortOption === 'clave_maestro') {
      data.sort((a, b) => a.clave_maestro.localeCompare(b.clave_maestro));
    } else if (this.sortOption === 'nombre') {
      data.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else if (this.sortOption === 'apellido') {
      data.sort((a, b) => a.last_name.localeCompare(b.last_name));
    }

    this.dataSource.data = data;
  }

 public goEditar(idUser: number) {
    const userIdSession = Number(this.facadeService.getUserId());

    // Administrador puede editar cualquier maestro
    // Maestro solo puede editar su propio registro
    if (this.rol === 'Administrador' || (this.rol === 'Maestro' && userIdSession === idUser)) {
      console.log("Navegando a editar maestro ID:", idUser);

      this.router.navigate(['/registro-usuarios'], {
        queryParams: {
          id: idUser,
          rol: 'Maestro'
        }
      });
    } else {
      alert("No tienes permisos para editar este maestro.");
    }
  }

  public delete(idUser: number) {
    // Administrador puede eliminar cualquier maestro
    // Maestro solo puede eliminar su propio registro
    const userIdSession = Number(this.facadeService.getUserId());
    if (this.rol === 'Administrador' || (this.rol === 'Maestro' && userIdSession === idUser)) {
      //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idUser, rol: 'Maestro'}, //Se pasan valores a través del componente
        height: '288px',
        width: '328px',
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Maestro eliminado");
        alert("Maestro eliminado correctamente.");
        //Recargar página
        window.location.reload();
      }else{
        alert("Maestro no se ha podido eliminar.");
        console.log("No se eliminó el maestro");
      }
    });
    }else{
      alert("No tienes permisos para eliminar este maestro.");
    }
  }


}

export interface DatosUsuario {
  id: number,
  clave_maestro: string;
  first_name: string;
  last_name: string;
  email: string;
  fechaN: string,
  telefono: string,
  rfc: string,
  cubiculo: string,
  area: string,
}
