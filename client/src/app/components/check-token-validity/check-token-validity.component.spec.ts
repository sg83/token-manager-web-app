import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTokenValidityComponent } from './check-token-validity.component';

describe('CheckTokenValidityComponent', () => {
  let component: CheckTokenValidityComponent;
  let fixture: ComponentFixture<CheckTokenValidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckTokenValidityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckTokenValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
