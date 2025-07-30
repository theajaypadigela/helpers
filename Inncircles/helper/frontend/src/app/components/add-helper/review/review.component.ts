import { Component, OnInit, Inject } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AvatarService } from '../../../services/avatar.service';
import { AddHelperService } from '../../../services/add-helper.service';
import { Helper } from '../../../types/helper.interface';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {
   @Input() formData!: FormGroup;
   @Output() previousStep = new EventEmitter<void>();
    @Output() nextEvent = new EventEmitter<void>();

   imgUrl: string = 'https://via.placeholder.com/150';
   helper!: Helper;
   isLoading: boolean = false;
   pdfFileName: string = '';

    constructor(
      private avatarService: AvatarService,
      private addHelperService: AddHelperService,
      private dialog: MatDialog
    ) {}

    ngOnInit() {
      const imageVal = this.formData.get('image')?.value;
      if (imageVal instanceof File) {
        this.imgUrl = URL.createObjectURL(imageVal);
      } else if (typeof imageVal === 'string' && imageVal) {
        this.imgUrl = this.avatarService.getAvatarImagePath(imageVal);
      } else {
        this.imgUrl = this.avatarService.generateAvatarUrl(this.formData.get('Name')?.value || 'Unknown');
      }

      const pdfVal = this.formData.get('pdf')?.value;
      if (pdfVal instanceof File) {
        this.pdfFileName = pdfVal.name;
      }
      const additionalVal = this.formData.get('additionalDocument')?.value;
      
      this.helper = {
        id: 0, 
        occupation: this.formData.get('TypeOfService')?.value || '',
        organisationName: this.formData.get('Orgaization')?.value || '',
        fullname: this.formData.get('Name')?.value || '',
        languages: [this.formData.get('Languages')?.value || ''],
        gender: this.formData.get('Gender')?.value || '',
        phone: this.formData.get('Phone')?.value || '',
        email: this.formData.get('Email')?.value || '',
        vehicleType: this.formData.get('VehicleType')?.value || '',
        JoinedOn: new Date(),
        image: imageVal || null,
        pdf: pdfVal || null,
        additionalDocument: additionalVal || null
      };
    }

   addHelper(){
      this.isLoading = true;
      // console.log('Submitting helper data:', this.helper);
      this.addHelperService.addHelper(this.helper).subscribe({
        next: (response: any) => {
          // console.log('Helper added successfully:', response);
          this.isLoading = false;
          this.openSuccessDialog();
        },
        error: (error: any) => {
          console.error('Error adding helper:', error);
          this.isLoading = false;
        }
      });
   }

   openSuccessDialog() {
      const dialogRef = this.dialog.open(HelperSuccessDialogComponent, {
        width: '400px',
        disableClose: true,
        data: { message: `${this.formData.get('Name')?.value || 'Helper'} added !` }
      });
      dialogRef.afterClosed().subscribe(() => {
        this.nextEvent.emit();
      });
   }

   goToPrevious() {
      this.previousStep.emit();
   }

}

@Component({
  selector: 'app-helper-success-dialog',
  template: `
    <h1 mat-dialog-title>Success</h1>
    <div mat-dialog-content>
      <p>Helper added successfully!</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="closeDialog()">OK</button>
    </div>
  `,
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
})
export class HelperSuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<HelperSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
