import { Component } from '@angular/core';
import { FormComponent } from './form/form.component';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document/document.component';
import { ReviewComponent } from './review/review.component';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';
import { Helper } from '../../types/helper.interface';

@Component({
  selector: 'app-add-helper',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FormComponent, DocumentComponent, ReviewComponent],
  templateUrl: './add-helper.component.html',
  styleUrl: './add-helper.component.scss'
})
export class AddHelperComponent {
  showForm = true;
  showDocument = false;
  showReview = false;
  editMode: boolean = false;
  userId: number | null = null;
  
  helpers: Helper[] = [];
  helperForm: FormGroup;


  constructor(private router: Router, private route: ActivatedRoute, private helperDetailsService: GetHelperDetailsService) {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    if(this.userId) {
      this.editMode = true;
      // console.log('Edit mode is ON for user ID:', this.userId);

      const helper = this.helperDetailsService.helpers().find(h => h.id === Number(this.userId));

      // console.log('Found helper for editing:', helper);
      
      this.helperForm = new FormGroup({
        TypeOfService: new FormControl(helper?.occupation, [Validators.required]),
        Orgaization: new FormControl(helper?.organisationName, [Validators.required]),
        Name: new FormControl(helper?.fullname, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        Languages: new FormControl(helper?.languages?.[0] || '', [Validators.required]),
        Gender: new FormControl(helper?.gender, [Validators.required]),
        Phone: new FormControl(helper?.phone, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
        Email: new FormControl(helper?.email, [Validators.required, Validators.email]),
        VehicleType: new FormControl(helper?.vehicleType, [Validators.required]),
        image: new FormControl(helper?.image || null),
        pdf: new FormControl(null),
        additionalDocument: new FormControl(null)
      });

    } else {
      this.helperForm = new FormGroup({
        TypeOfService: new FormControl('', [Validators.required]),
        Orgaization: new FormControl('', [Validators.required]),
        Name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        Languages: new FormControl('', [Validators.required]),
        Gender: new FormControl('', [Validators.required]),
        Phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
        Email: new FormControl('', [Validators.required, Validators.email]),
        VehicleType: new FormControl('', [Validators.required]),
        image: new FormControl(null),
        pdf: new FormControl(null),
        additionalDocument: new FormControl(null)
      });
    }
  }
  


  handleNext() {
    
    if(this.showDocument) {
      this.showReview = true;
      this.showDocument = false; 
    }
  }

  next(){
    if(this.showForm){
      Object.keys(this.helperForm.controls).forEach(key => {
      this.helperForm.get(key)?.markAsTouched();
    });

    if (this.helperForm.valid) {
      this.showDocument = true;
      this.showForm = false;
    } else {
      console.log('Form is invalid - please fill all required fields');
      console.log('Form errors:', this.getFormValidationErrors());
    }
    }
  }

  getFormValidationErrors() {
    const formErrors: any = {};
    Object.keys(this.helperForm.controls).forEach(key => {
      const controlErrors = this.helperForm.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });
    return formErrors;
  }

  handlePrevious() {
    if (this.showDocument) {
      this.showForm = true;
      this.showDocument = false;
    } else if (this.showReview) {
      this.showDocument = true;
      this.showReview = false;
    }
  }

  goBack() {
    this.router.navigate(['/main']);
  }
}
