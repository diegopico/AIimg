import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title?:string;
  message?:string;
}

@Component({
  selector: 'wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.css']
})

export class WaitComponent implements OnInit {
  constructor(
              public dialogRef: MatDialogRef<WaitComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData){
  }
  ngOnInit() {
  }
}
