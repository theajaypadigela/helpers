import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateHelperService } from '../../../services/update-helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @Input() formGroup!: FormGroup;
  @Output() next = new EventEmitter<void>();
  @Input() editMode: boolean = false;

  userId: number = 0;
  isLanguageDropdownOpen: boolean = false;

  constructor(private updateHelperService: UpdateHelperService,  private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.userId = Number(params['id']);
    });
  }

  onNext(): void {
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key)?.markAsTouched();
    });
    
    if (this.formGroup.valid) {
      this.next.emit();
    } else {
      this.showValidationErrorMessage();
    }
  }
  handleUpdate(): void {
    console.log("update called", this.formGroup.value);

    if (this.formGroup.valid) {
      this.updateHelperService.updateHelper(this.userId, this.formGroup.value, this.formGroup.get('image')?.value, this.formGroup.get('pdf')?.value)
        .subscribe({
          next: (response) => {
            console.log('Helper updated successfully:', response);
            this.showSuccessMessage();
            this.router.navigate(['/main']);
          },
          error: (error) => {
            console.error('Error updating helper:', error);
            this.showErrorMessage();
          }
        });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
      console.log('Form errors:', this.getFormValidationErrors());
      this.showValidationErrorMessage();
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

  onFileSelected(event: Event, type: 'pdf' | 'image'): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('Selected file:', file);
      this.formGroup.get(type)?.setValue(file);
    }
  }

  toggleLanguageDropdown(): void {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
  }

  onLanguageChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
    const currentLanguages = this.formGroup.get('Languages')?.value || [];
    
    let updatedLanguages: string[];
    
    if (checkbox.checked) {
      if (!currentLanguages.includes(value)) {
        updatedLanguages = [...currentLanguages, value];
      } else {
        updatedLanguages = currentLanguages;
      }
    } else {
      updatedLanguages = currentLanguages.filter((lang: string) => lang !== value);
    }
    
    this.formGroup.get('Languages')?.setValue(updatedLanguages);
  }

  isLanguageSelected(language: string): boolean {
    const currentLanguages = this.formGroup.get('Languages')?.value || [];
    return currentLanguages.includes(language);
  }

  getSelectedLanguagesText(): string {
    const currentLanguages = this.formGroup.get('Languages')?.value || [];
    if (currentLanguages.length === 0) {
      return 'Select languages';
    } else if (currentLanguages.length === 1) {
      return this.capitalizeFirst(currentLanguages[0]);
    } else {
      return `${currentLanguages.length} languages selected`;
    }
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private showSuccessMessage(): void {
    this.snackBar.open('✔ Changes saved!', '✖', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(): void {
    this.snackBar.open('Error updating helper. Please try again.', '✖', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  private showValidationErrorMessage(): void {
    this.snackBar.open('Please fill in all required fields.', '✖', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['warning-snackbar']
    });
  }
}
