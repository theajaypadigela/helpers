import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-helper-success-dialog-component',
  standalone: true,
  imports: [QRCodeModule, MatDialogModule, MatButtonModule],
  templateUrl: './helper-success-dialog-component.component.html',
  styleUrl: './helper-success-dialog-component.component.scss'
})
export class HelperSuccessDialogComponentComponent {
  constructor(
    public dialogRef: MatDialogRef<HelperSuccessDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; qrCodeValue: string }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
