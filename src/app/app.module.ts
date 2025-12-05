import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatRadioButton, MatRadioModule} from '@angular/material/radio';
import { RegistroAlumnosComponent } from './partials/registro-alumnos/registro-alumnos.component';
import { RegistroMaestrosComponent } from './partials/registro-maestros/registro-maestros.component';
import { RegistroAdminComponent } from './partials/registro-admin/registro-admin.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';



// Paginación
import { MatPaginatorModule } from '@angular/material/paginator'
import {MatPaginatorIntl} from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './shared/spanish-paginator-intl';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { AlumnosScreenComponent } from './screens/alumnos-screen/alumnos-screen.component';
import { MaestrosScreenComponent } from './screens/maestros-screen/maestros-screen.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { NavbarUserComponent } from './partials/navbar-user/navbar-user.component';
import { SidebarComponent } from './partials/sidebar/sidebar.component'
import { MatDialogModule } from '@angular/material/dialog';
import { EliminarUserModalComponent } from './modals/eliminar-user-modal/eliminar-user-modal.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';
import { NgChartsModule } from 'ng2-charts';
import { RegistroMateriasComponent } from './partials/registro-materias/registro-materias.component';
import { MateriasScreenComponent } from './screens/materias-screen/materias-screen.component';
import { RegistroMateriasScreenComponent } from './screens/registro-materias-screen/registro-materias-screen.component';
import { EditarModalComponent } from './modals/editar-modal/editar-modal.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    RegistroUsuariosScreenComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    RegistroAlumnosComponent,
    RegistroMaestrosComponent,
    RegistroAdminComponent,
    HomeScreenComponent,
    AlumnosScreenComponent,
    MaestrosScreenComponent,
    AdminScreenComponent,
    NavbarUserComponent,
    SidebarComponent,
    EliminarUserModalComponent,
    GraficasScreenComponent,
    RegistroMateriasComponent,
    MateriasScreenComponent,
    RegistroMateriasScreenComponent,
    EditarModalComponent,
    EditarModalComponent
  ],
  imports: [
    MatSidenavModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    NgChartsModule,
    MatMenuModule,
    NgxMaterialTimepickerModule,

  ],
  exports:[ MatButtonModule,
    MatDividerModule,
    MatIconModule,
  MatMenuModule],
  providers: [CookieService,
              provideNgxMask(),
              {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
              { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl()  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
