import { Component } from '@angular/core';
import { FormComponent } from './form/form.component';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentComponent } from './document/document.component';
import { ReviewComponent } from './review/review.component';

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


  constructor(private router: Router) {}

  helperForm = new FormGroup({
    TypeOfService: new FormControl('', [Validators.required]),
    Orgaization: new FormControl('', [Validators.required]),
    Name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    Languages: new FormControl([], [Validators.required]),
    Gender: new FormControl('', [Validators.required]),
    Phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Vehicle: new FormControl('', [Validators.required]),

  });

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
    }
    }
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
