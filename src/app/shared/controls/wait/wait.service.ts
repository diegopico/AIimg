import { Injectable,TemplateRef} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { WaitComponent } from './wait.component';

export interface prmsSize{
  width         : string;
  height        : string;
}

@Injectable({providedIn: 'root'})
export class WaitService {

  public dialogRef:MatDialogRef<WaitComponent>;

  constructor( private dialog: MatDialog) {
  }

  public show(message:string,title?:string,buttons?:string){
      let dialogConfig = new MatDialogConfig();
      dialogConfig.backdropClass='g-transparent-backdrop';
      dialogConfig.data= {message: message};
      dialogConfig.panelClass= 'CssModalwait';  //esta clase esta en style.css
      dialogConfig.disableClose=false;
      dialogConfig.width='auto';
      dialogConfig.height='35px';
      let dialogwait=this.dialog.open(WaitComponent,dialogConfig);
      return dialogwait;
  }
}


