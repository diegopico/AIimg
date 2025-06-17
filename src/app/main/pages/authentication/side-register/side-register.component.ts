import { Component, inject } from '@angular/core';
import { CoreService } from './../../../../shared/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../material.module';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';
import { UserService } from '../../../../shared/services/user.service';
import { User } from './../../../../shared/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-side-register',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, BrandingComponent,TranslateModule],
    templateUrl: './side-register.component.html'
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();
  
  #dataService = inject(UserService);
  public data: User;  
  
  public form = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]),
    email: new FormControl('', [Validators.required,Validators.minLength(2)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phoneNumber: new FormControl('',[Validators.required,Validators.minLength(1)]),
    companyName: new FormControl('', [Validators.required,Validators.minLength(2),Validators.maxLength(255)]),
    industry: new FormControl('', [Validators.required,Validators.maxLength(255)]),
  });

  
  constructor(
    private settings: CoreService, 
    private router: Router,
    private _authService: AuthService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) { 
   
  }
 

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form.controls['confirmPassword'].setValidators([
      Validators.required,
      this.password_Valid.bind(this.form)
    ]);

  }

  password_Valid(control: FormControl) : { [s:string]: any} {
    let form: any = this;
    //console.log(form.controls['confirmPassword'].errors);
    let valid:object={};
    if ( form.controls['confirmPassword'].value=='') {
      valid = { errors : true, msg: "Escriba contraseña" };
    }
    else if ( form.controls['confirmPassword'].value != form.controls['password'].value) {
      valid = { errors : true, different:true, msg: "Contraseñas diferentes" };
    }
    //console.log(this.f['confirmPassword'].errors);
    //console.log(form.controls['confirmPassword'].errors);
    return valid;
  }



  submit() {
     //console.log(this.form.value);
     this.data=this.form.value as User;
     this.data.role='Tenant Admin';
     this.#dataService.createUser(this.data).subscribe({
      next: (response) => {
        if (response.data) {
          this.snackBar.open('Usuario se creó correctamente', 'Close', {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });
        }
        this._authService.saveToken(response.data.token);
      },
      error: (e) => {
        console.error(e);
        //this.#notificationService.showErrorPopupResult('User or password is wrong');
        this.snackBar.open(e, 'Close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      },
      complete: () => {
        this.router.navigate(['/dashboards/dashboard1']);
      },
    });
    //this.router.navigate(['/dashboards/dashboard1']);
  }
}
