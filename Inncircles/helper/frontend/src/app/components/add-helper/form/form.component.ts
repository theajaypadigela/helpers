import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateHelperService } from '../../../services/update-helper.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @Input() formGroup!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Input() editMode: boolean = false;

  userId: number = 0;

  constructor(private updateHelperService: UpdateHelperService,  private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.userId = Number(params['id']);
    });
  }

  onNext(): void {
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.markAsTouched();
    });
    this.next.emit();
  }
  handleUpdate(): void {
    console.log("update called", this.formGroup.value);

    if (this.formGroup.valid) {
      this.updateHelperService.updateHelper(this.userId, this.formGroup.value, this.formGroup.get('image')?.value, this.formGroup.get('pdf')?.value)
        .subscribe({
          next: (response) => {
            console.log('Helper updated successfully:', response);
            this.router.navigate(['/main']);
          },
          error: (error) => {
            console.error('Error updating helper:', error);
          }
        });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
      console.log('Form errors:', this.getFormValidationErrors());
    }
  }

  getFormValidationErrors() {
    const formErrors: any = {};
    Object.keys(this.formGroup.controls).forEach(key => {
      const controlErrors = this.formGroup.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });
    return formErrors;
  }

  onFileSelected(event: Event, type: 'image' | 'pdf'): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('Selected file:', file);
      this.formGroup.get(type)?.setValue(file);
    }
  }
}
