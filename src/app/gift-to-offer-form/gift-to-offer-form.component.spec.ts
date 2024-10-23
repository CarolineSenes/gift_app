import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftToOfferFormComponent } from './gift-to-offer-form.component';

describe('GiftToOfferFormComponent', () => {
  let component: GiftToOfferFormComponent;
  let fixture: ComponentFixture<GiftToOfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftToOfferFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftToOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
