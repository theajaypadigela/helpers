import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../../../services/avatar.service';
import { AddHelperService } from '../../../services/add-helper.service';
import { Helper } from '../../../types/helper.interface';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {
   @Input() formData!: FormGroup;

   imgUrl: string = 'https://via.placeholder.com/150';
   helper!: Helper;
   isLoading: boolean = false;
   pdfFileName: string = '';

    constructor(private avatarService: AvatarService, private addHelperService: AddHelperService) {}

    ngOnInit() {
      const imageVal = this.formData.get('image')?.value;
      if (imageVal instanceof File) {
        this.imgUrl = URL.createObjectURL(imageVal);
      } else if (typeof imageVal === 'string' && imageVal) {
        this.imgUrl = this.avatarService.getAvatarImagePath(imageVal);
      } else {
        this.imgUrl = this.avatarService.generateAvatarUrl(this.formData.get('Name')?.value || 'Unknown');
      }

      // Handle PDF file name display
      const pdfVal = this.formData.get('pdf')?.value;
      if (pdfVal instanceof File) {
        this.pdfFileName = pdfVal.name;
      }
      // Handle Additional Document if provided
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
        joinedOn: new Date().toLocaleDateString(),
        image: imageVal || null,
        pdf: pdfVal || null,
        additionalDocument: additionalVal || null
      };
    }

   next(){
      this.isLoading = true;
      console.log('Submitting helper data:', this.helper);
      this.addHelperService.addHelper(this.helper).subscribe({
        next: (response: any) => {
          console.log('Helper added successfully:', response);
          this.isLoading = false;
          // You can add navigation or success message here
        },
        error: (error: any) => {
          console.error('Error adding helper:', error);
          this.isLoading = false;
        }
      });
   }
}