import { Component } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-helper',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-helper.component.html',
  styleUrl: './add-helper.component.scss'
})
export class AddHelperComponent {

  constructor(private router: Router) {}

  helperForm = new FormGroup({
    TypeOfService: new FormControl('', [Validators.required]),
    Orgaization: new FormControl('', [Validators.required]),
    Name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    Languages: new FormControl('', [Validators.required]),
    Gender: new FormControl('', [Validators.required]),
    Phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Vehicle: new FormControl('', [Validators.required]),

  });

  handleSubmit() {
    if (this.helperForm.valid) {
      const formData = this.helperForm.value;
      console.log('Form Submitted', formData);
      // Here you can add the logic to send the form data to your backend or service
      // After successful submission, navigate back to main page
      this.router.navigate(['/main']);
    } else {
      console.log('Form is invalid');
    }
  }

  goBack() {
    this.router.navigate(['/main']);
  }
}
