import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';
import { GiftIdea } from '../models/gift-idea-model';

@Component({
  selector: 'app-gift-to-offer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gift-to-offer-form.component.html',
  styleUrl: './gift-to-offer-form.component.css',
})
export class GiftToOfferFormComponent implements OnInit {
  gift_ideas_form: FormGroup;
  offeredOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  session: any;
  submissionSuccess: boolean = false;
  idea: GiftIdea = {
    id: 0,
    idea: '',
    link: '',
    price: null,
    occasion: '',
    person_name: '',
    is_offered: false,
    offered_date: null,
    offered_from: '',
  };
  isOffered = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly supabase: SupabaseService,
    private router: Router
  ) {
    // Initializing the form
    this.gift_ideas_form = this.fb.group({
      person_name: [''],
      idea: [''],
      price: null,
      link: [''],
      occasion: [''],
      is_offered: [false],
      offered_date: null,
      offered_from: [''],
    });
  }

  ngOnInit() {
    // Session initialization during component initialization
    this.session = this.supabase.session;

    // Managing session changes
    this.supabase.authChanges((_, session) => {
      this.session = session;
    });

    this.loadCurrentGift();
  }

  private loadCurrentGift() {
    const storedIdea = sessionStorage.getItem('selectedIdea');
    if (storedIdea) {
      this.idea = JSON.parse(storedIdea);
      sessionStorage.removeItem('selectedIdea'); // Cleaning after recovery

      // Checking if `is_offered` is set, and updating `isOffered`
      if (this.idea.is_offered !== undefined) {
        this.isOffered = this.idea.is_offered;
      }

      // Initializing the form with the idea data
      this.gift_ideas_form.patchValue({
        person_name: this.idea.person_name,
        idea: this.idea.idea,
        price: this.idea.price,
        link: this.idea.link,
        occasion: this.idea.occasion,
        is_offered: this.idea.is_offered,
        offered_date: this.idea.offered_date,
        offered_from: this.idea.offered_from,
      });
    } else {
      console.warn('Aucune idée de cadeau trouvée, redirection vers la liste');
      // this.router.navigate(['/gift-list']); // Redirection if no `idea` object is found
    }
  }

  /**
   * Handles the toggle event for the "Was offered?" checkbox.
   * Updates the `isOffered` state based on the checkbox value.
   * If the checkbox is unchecked, it resets the additional fields
   * (`offered_date` and `offered_from`) in the form to empty values.
   *
   * @param event - The event triggered by the checkbox change.
   */
  onToggleOffered(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isOffered = checkbox.checked; // Updates status
    if (!this.isOffered) {
      // Resets additional fields if checkbox is unchecked
      this.gift_ideas_form.patchValue({
        offered_date: '',
        offered_from: '',
      });
    }
  }

  async onSubmit() {
    if (this.gift_ideas_form.valid) {
      const formData = this.gift_ideas_form.value;

      if (this.idea && this.idea.id) {
        // Update of existing idea
        try {
          const result = await this.supabase.updateGiftIdea(
            this.idea.id,
            formData
          );

          if (result) {
            this.submissionSuccess = true;
            console.log('Idea updated successfully');
            this.gift_ideas_form.reset();
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour :', error);
          this.submissionSuccess = false;
        }
      } else {
        // Creating a new idea
        try {
          const result = await this.supabase.addGiftIdea(formData);

          if (result) {
            this.submissionSuccess = true;
            this.gift_ideas_form.reset();
          }
        } catch (error) {
          this.submissionSuccess = false;
        }
      }
      this.gift_ideas_form.reset();
      this.router.navigate(['/gift-list']);
    } else {
      this.submissionSuccess = false;
    }
  }
}
