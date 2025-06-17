import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-imagen-viewer',
  templateUrl: './imagen-viewer.component.html',
  styleUrls: ['./imagen-viewer.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class ImagenViewerComponent {
  zoom: number = 1;

  constructor(
    public dialogRef: MatDialogRef<ImagenViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }
  ) {}

  zoomIn() {
    this.zoom += 0.2;
  }

  zoomOut() {
    if (this.zoom > 0.4) this.zoom -= 0.2;
  }

  close() {
    this.dialogRef.close();
  }
} 