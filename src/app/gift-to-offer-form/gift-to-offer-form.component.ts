import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SupabaseService } from '../supabase.service';


@Component({
  selector: 'app-gift-to-offer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gift-to-offer-form.component.html',
  styleUrl: './gift-to-offer-form.component.css'
})
export class GiftToOfferFormComponent {
  gift_ideas_form: FormGroup; // Déclare le formulaire sans l'initialiser ici
  offeredOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  session: any;
  submissionSuccess: boolean = false;

  constructor(
    private readonly fb: FormBuilder, // Le formBuilder est initialisé ici
    private readonly supabase: SupabaseService,
  ) {
    // Initialisation du formulaire
    this.gift_ideas_form = this.fb.group({
      person_name: [''],
      idea: [''],
      price: [''],
      link: [''],
      occasion: [''],
      is_offered: [false],
    });
  }

  ngOnInit() {
    // Initialisation de la session lors de l'initialisation du composant
    this.session = this.supabase.session;

    // Gestion des changements de session
    this.supabase.authChanges((_, session) => {
      this.session = session;
    });
  }


  // Fonction de soumission du formulaire
  async onSubmit() {
    if (this.gift_ideas_form.valid) {
      const formData = this.gift_ideas_form.value;
      try {
        const result = await this.supabase.addGiftIdea(formData);
        console.log('Résultat de l’insertion:', result);

        if (result) {
          console.log('Données envoyées avec succès :', result);
          this.submissionSuccess = true;
          this.gift_ideas_form.reset();
        }
      } catch (error) {
        console.error('Erreur lors de l’envoi des données :', error);
        this.submissionSuccess = false;
      }
    } else {
      console.log('Formulaire invalide');
      this.submissionSuccess = false;
    }
  }
}
