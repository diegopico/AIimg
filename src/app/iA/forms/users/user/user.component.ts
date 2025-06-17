import { Component, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { iAglobalService, proceso } from 'src/app/iA/services/iAglobal.service';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/iA/services/user.service';
import { User } from 'src/app/iA/models/user';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CoreService } from 'src/app/shared/services/core.service';
import { WaitService } from 'src/app/shared/controls/wait/wait.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from 'src/app/main/layouts/full/shared/loading/loading.component';
import { Location } from '@angular/common'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  imports: [
    MaterialModule,
    MatIconModule,
    TablerIconsModule,
    CommonModule,
    TranslateModule,
    FormsModule, ReactiveFormsModule,
    MatDialogModule,
    LoadingComponent
  ],
})
export class UserComponent {
  #iAglobalService = inject(iAglobalService);
  #DataService = inject(UserService);
  
  public proceso: proceso | null;
  public loading: boolean;
  public currentTheme: 'light' | 'dark' = 'dark';

  public record: User;
  public id:string;
  public form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    role: new FormControl(''),
    isActive: new FormControl(true),
    phoneNumber: new FormControl('', [Validators.required]),
    userCompanyName: new FormControl('', [Validators.required]),
  });
  public listRole:Array<any>=[
    {id:1,name:'Admin'},
    {id:2,name:'Tenant Admin'}
  ]
  constructor(
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService,
    public coreService: CoreService,
    public waitService: WaitService,
    private location: Location) {
    this.proceso = this.#iAglobalService.getProceso();
    this.id='';
    //debugger
    if (this.proceso.Accion == 'Edit') {
      this.record = this.proceso.data as User;
      this.id=this.proceso.Ref!;// this.record.id;
    }
    if (this.proceso.Accion == 'New') {
      //this.record = null;
    }
    this.loadDataCtrs();    
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
  get f() {
    return this.form.controls;
  }
  
  loadDataCtrs() {
    let id:string = this.id;//this.record?.id!;
    if (this.proceso!.Accion == 'Edit') {
      this.loading = true;
      this.#DataService.getByUserId(id).subscribe({ 
        next: (response) => {
          if (response){
            this.record=response.data as User;
            console.log(this.record);
            this.setCtrls();
            this.loading = false;
          }
        },
        error: (e) => {
        },
        complete: () => {
        },
      })
    }
  }

  setCtrls(): void {
    if (this.record) {
      console.log(this.record);
      /*-------------------Tab General--------------------*/
      this.form.controls["firstName"].setValue(this.record.firstName);
      this.form.controls["lastName"].setValue(this.record.lastName);
      this.form.controls["email"].setValue(this.record.email);
      this.form.controls["phoneNumber"].setValue(this.record.phoneNumber);
      this.form.controls["role"].setValue(this.record.role);
      //this.form.controls["isActive"].setValue(this.record.isActive);
      //this.form.controls["userCompanyName"].setValue(this.record.userCompanyName);
    }
  }

  getCtrls():void{
    this.record =this.form.value as User;
    this.record.id=this.id;
    console.log(this.record);
  }

  onValidar():boolean{
    let validation:boolean=true;
    if (!this.record.firstName && validation) {
      this.snackBar.open('Nombres del usuario es requerido', 'Cerrar', { duration: 3000 });
      validation=false;
    }
    if (!this.record.lastName && validation) {
      this.snackBar.open('Apellidos de usuario es requerido', 'Cerrar', { duration: 3000 });
      validation=false;
    }
    if (!this.record.email && validation) {
      this.snackBar.open('Correo de usuario es requerido', 'Cerrar', { duration: 3000 });
      validation=false;
    }
    if (!this.record.phoneNumber && validation) {
      this.snackBar.open('Numero de celular es requerido', 'Cerrar', { duration: 3000 });
      validation=false;
    }
    /*
    if (!this.record.userCompanyName && validation) {
      this.snackBar.open('Nombre de Compañia es requerido', 'Cerrar', { duration: 3000 });
      validation=false;
    }
    */
    return validation;
  }
  onSave(): void {
    
    this.getCtrls();

    if (!this.onValidar()){
      return;
    }
    console.log('Guardando registro:', this.record);
    const wait = this.waitService.show('Guardando datos..');
    // Aquí iría el código para guardar en el servidor
    // this.#AgentService.saveCompanyAgent(this.record).subscribe(...)
    //return;
     this.#DataService.updateUser(this.id,this.record).subscribe({
      next: (response) => {
        if (response.data) {
          this.snackBar.open('Usuario se actualizó correctamente', 'Close', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
          wait.close();
        }
      },
      error: (e) => {
        console.error(e);
        this.snackBar.open(e, 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
        wait.close();
      },
      complete: () => {
        wait.close();
        //this.router.navigate(['/dashboards/dashboard1']);
        this.location.back();
      },
    });
  }

  onCancel():void{
    this.location.back();
  }
}
