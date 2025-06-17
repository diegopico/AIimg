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
import { changePassword } from 'src/app/shared/models/user';

@Component({
  selector: 'app-changepassword',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
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
export class ChangepasswordComponent {
  #iAglobalService = inject(iAglobalService);
  #DataService = inject(UserService);
  
  public proceso: proceso | null;
  public loading: boolean;
  
  public record: changePassword;
  public form = new FormGroup({
    currentPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  constructor(
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public translate: TranslateService,
    public coreService: CoreService,
    public waitService: WaitService,
    private location: Location) {
    this.proceso = this.#iAglobalService.getProceso();
    //this.id=this.proceso.Ref!;// this.record.id;
  }

  ngOnInit(): void {
    // Validador para contraseña de confirmación
    this.form.controls['confirmNewPassword'].setValidators([
      Validators.required,
      Validators.minLength(6),
      this.password_Valid.bind(this.form)
    ]);
    
    // Validador para nueva contraseña
    this.form.controls['newPassword'].setValidators([
      Validators.required,
      Validators.minLength(6),
      this.newPasswordDifferent.bind(this.form)
    ]);
    
    // Activar validación cuando cambie la nueva contraseña
    this.form.controls['newPassword'].valueChanges.subscribe(() => {
      this.form.controls['confirmNewPassword'].updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
  }
  get f() {
    return this.form.controls;
  }
  
  password_Valid(control: FormControl): { [s: string]: any } | null {
    let form: any = this;
    
    // Si el campo está vacío, dejamos que el validador required se encargue
    if (!control.value) {
      return null;
    }
    
    // Verificamos si las contraseñas coinciden
    if (control.value !== form.controls['newPassword'].value) {
      return { different: true, msg: "Las contraseñas no coinciden" };
    }
    
    // Si todo está bien, devolvemos null (válido)
    return null;
  }

  // Validador para verificar que la nueva contraseña sea diferente de la actual
  newPasswordDifferent(control: FormControl): { [s: string]: any } | null {
    let form: any = this;
    
    if (!control.value) {
      return null;
    }
    
    // Verificamos que la nueva contraseña sea diferente de la actual
    if (control.value === form.controls['currentPassword'].value) {
      return { sameAsCurrent: true, msg: "La nueva contraseña debe ser diferente a la actual" };
    }
    
    return null;
  }

  
  onValidar(): boolean {
    // Marcar todos los controles como touched para activar mensajes de error
    Object.keys(this.form.controls).forEach(key => {
      // Usar type assertion para solucionar el error de índice tipo string
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
    
    // Verificar si el formulario es válido
    return this.form.valid;
  }

  getCtrls():void{
    this.record =this.form.value as changePassword;
    //this.record.id=this.id;
    console.log(this.record);
  }
  onSave(): void {
    this.getCtrls();

    if (!this.onValidar()) {
      // Mostrar mensaje de error
      this.snackBar.open('Por favor corrija los errores en el formulario', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
      return;
    }
    
    console.log('Guardando registro:', this.record);
    const wait = this.waitService.show('Guardando nueva contraseña..');
    this.#DataService.changepwd(this.record).subscribe({
      next: (response) => {
        if (response.data) {
          this.snackBar.open('Contraseña se actualizó correctamente', 'Close', {
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
