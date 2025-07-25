import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
 
  @Input() documentForm!: FormGroup;

  constructor() {
    
  }

  onFileChange(event: any, field: string) {

    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('Selected file:', file);
      this.documentForm.get(field)?.setValue(file);
    }
  }

  onSubmit() {
    if (this.documentForm.valid) {
      
    } else {
      console.log('Form is invalid - please fill all required fields');
    }
  }
}
