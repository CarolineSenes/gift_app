import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftIdeaListComponent } from './gift-idea-list.component';

describe('GiftIdeaListComponent', () => {
  let component: GiftIdeaListComponent;
  let fixture: ComponentFixture<GiftIdeaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftIdeaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftIdeaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
