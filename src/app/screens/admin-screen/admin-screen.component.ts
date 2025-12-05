import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  // Variables y métodos del componente
  public name_user:string = "";
  public token: string = "";
  public lista_admins:any[]= [];
  public rol: string = "";

  constructor(
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private router: Router,
        public dialog: MatDialog

  ) { }

  ngOnInit(): void {
    // Lógica de inicialización aquí
    this.name_user = this.facadeService.getUserCompleteName();

    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    // Obtenemos los administradores
    this.obtenerAdmins();
  }

  //Obtener lista de usuarios
  public obtenerAdmins(){
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response)=>{
        this.lista_admins = response;
        console.log("Lista users: ", this.lista_admins);
      }, (error)=>{
        alert("No se pudo obtener la lista de administradores");
      }
    );
  }

  public goEditar(idUser: number){
  console.log("Navegando a editar admin ID:", idUser);

  this.router.navigate(['/registro-usuarios'], {
    queryParams: {
      id: idUser,
      rol: 'Administrador'
    }
  });
  }

 public delete(idUser: number) {
     // Administrador puede eliminar cualquier maestro
     // Maestro solo puede eliminar su propio registro
     const userIdSession = Number(this.facadeService.getUserId());
     if (this.rol === 'Administrador' || (this.rol === 'Maestro' && userIdSession === idUser)) {
       //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
       const dialogRef = this.dialog.open(EliminarUserModalComponent,{
         data: {id: idUser, rol: 'Administrador'}, //Se pasan valores a través del componente
         height: '288px',
         width: '328px',
       });

     dialogRef.afterClosed().subscribe(result => {
       if(result.isDelete){
         console.log("Administrador eliminado");
         alert("Administrador eliminado correctamente.");
         //Recargar página
         window.location.reload();
       }else{
         alert("Administrador no se ha podido eliminar.");
         console.log("No se eliminó el administrador");
       }
     });
     }else{
       alert("No tienes permisos para eliminar este administrador.");
     }
   }




}
