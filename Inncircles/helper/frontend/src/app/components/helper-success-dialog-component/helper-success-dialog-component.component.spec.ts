import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperSuccessDialogComponentComponent } from './helper-success-dialog-component.component';

describe('HelperSuccessDialogComponentComponent', () => {
  let component: HelperSuccessDialogComponentComponent;
  let fixture: ComponentFixture<HelperSuccessDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperSuccessDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelperSuccessDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
