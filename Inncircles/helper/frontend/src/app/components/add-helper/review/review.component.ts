import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AvatarService } from '../../../services/avatar.service';
import { AddHelperService } from '../../../services/add-helper.service';

interface Helper {
  id: number;
  occupation: string;
  organisationName: string;
  fullname: string;
  languages: string[];
  gender: string;
  phone: string;
  email: string;
  vehicleType: string;
  joinedOn?: string | null;
  image?: File | string | null;
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {
   @Input() formData!: FormGroup;

   imgUrl: string = 'https://via.placeholder.com/150';
   helper!: Helper;

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

      this.helper = {
        id: 0, 
        occupation: this.formData.get('TypeOfService')?.value || '',
        organisationName: this.formData.get('Orgaization')?.value || '',
        fullname: this.formData.get('Name')?.value || '',
        languages: [this.formData.get('Languages')?.value || ''],
        gender: this.formData.get('Gender')?.value || '',
        phone: this.formData.get('Phone')?.value || '',
        email: this.formData.get('Email')?.value || '',
        vehicleType: this.formData.get('Vehicle')?.value || '',
        joinedOn: new Date().toLocaleDateString() ,
        image: imageVal || null
      };
    }

   next(){
      this.addHelperService.addHelper(this.helper);
   }
}

  // Email
  // : 
  // "22311a12p3@suh.edu.in"
  // Gender
  // : 
  // "male"
  // Languages
  // : 
  // "english"
  // Name
  // : 
  // "AJAY PADIGELA"
  // Orgaization
  // : 
  // "spring-helpers"
  // Phone
  // : 
  // "8985803272"
  // TypeOfService
  // : 
  // "driver"
  // Vehicle
  // : 
  // "scooter"