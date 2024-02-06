import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavLogoComponent } from './theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';



import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { ToggleFullScreenDirective } from './theme/shared/components/full-screen/toggle-full-screen';
import { ConfiguracionesService } from './servicios/configuraciones.service';
import { ToastrModule } from 'ngx-toastr';
import { AlertasComponent } from './componentes/Entorno/alert/alertas/alertas.component';
import { InfoComponent } from './componentes/Entorno/alert/info/info.component';
import { WarningComponent } from './componentes/Entorno/alert/warning/warning.component';
import { DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTreeViewModule } from "devextreme-angular";


import { SupabaseClientOptions, createClient } from '@supabase/supabase-js';
import { IniciohistoriaComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Inicio/iniciohistoria.component';
import { MenuprincipalComponent } from './componentes/modules/Ambulatorio/historiasClinicas/menuPrincipal/menuprincipal.component';
import { CajaNumericaComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/componentes/recursos/cajaNumerica/caja-numerica/caja-numerica.component';
import { CheckBoxComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/componentes/recursos/checkBox/check-box/check-box.component';
import { ComboBoxComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/componentes/recursos/comboBox/combo-box/combo-box.component';
import { FechaComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/componentes/recursos/fecha/fecha/fecha.component';
import { GroupBoxComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/componentes/recursos/groupBox/group-box/group-box.component';
import { MemoComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/componentes/recursos/memo/memo/memo.component';
import { RadioButtonComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/componentes/recursos/radioButton/radio-button/radio-button.component';
import { RadioGroupComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/componentes/recursos/radioGroup/radio-group/radio-group.component';
import { TextBoxComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/componentes/recursos/textBox/text-box/text-box.component';
import { RenderizadorPrincipalComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/principal/renderizador-principal/renderizador-principal.component';
import { NavhistoriaComponent } from './componentes/modules/Ambulatorio/historiasClinicas/tabs/nav/navhistoria.component';
import { IncapacidadComponent } from './componentes/modules/Ambulatorio/historiasClinicas/tabs/tabsData/incapacidad/incapacidad.component';
import { RemisionComponent } from './componentes/modules/Ambulatorio/historiasClinicas/tabs/tabsData/referenciaPacientes/remision.component';
import { DynamicComponentDirective } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/directiva/dynamic-component.directive';
import { HistoriasComponent } from './componentes/modules/Parametros/historias/historias.component';

import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSidenavModule} from '@angular/material/sidenav';

import { environment } from 'src/environments/environment';

const supabaseClient = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY, {
  db: { schema: environment.SUPABASE_SCHEMA }
}) 
@NgModule({
  declarations: [
    AppComponent,
    GuestComponent,
    AdminComponent,
    ConfigurationComponent,
    NavBarComponent,
    NavigationComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavLogoComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    NavSearchComponent,
    ToggleFullScreenDirective,
    AlertasComponent,
    InfoComponent,
    WarningComponent,
    IniciohistoriaComponent,
    MenuprincipalComponent,
    CajaNumericaComponent,
    CheckBoxComponent,
    ComboBoxComponent,
    FechaComponent,
    GroupBoxComponent,
    MemoComponent,
    RadioButtonComponent,
    RadioGroupComponent,
    TextBoxComponent,
    RenderizadorPrincipalComponent,
    NavhistoriaComponent,
    IncapacidadComponent,
    RemisionComponent,
    DynamicComponentDirective,
    HistoriasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    DxSelectBoxModule,
    DxDataGridModule,
    MatTabsModule,
    MatExpansionModule,
    MatSidenavModule,
    DxDropDownBoxModule,
    DxTreeViewModule
  ],
  providers: [NavigationItem, ConfiguracionesService, { provide: 'SUPABASE_CLIENT', useValue: supabaseClient }],
  bootstrap: [AppComponent],
})
export class AppModule {}
