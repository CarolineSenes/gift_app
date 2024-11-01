import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gift-to-offer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gift-to-offer-form.component.html',
  styleUrl: './gift-to-offer-form.component.css',
})
export class GiftToOfferFormComponent implements OnInit {
  gift_ideas_form: FormGroup; // Déclare le formulaire sans l'initialiser ici
  offeredOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  session: any;
  submissionSuccess: boolean = false;
  idea: any;

  constructor(
    private readonly fb: FormBuilder, // Le formBuilder est initialisé ici
    private readonly supabase: SupabaseService,
    private router: Router,
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

    this.loadCurrentGift();
  }

  private loadCurrentGift() {
    const storedIdea = sessionStorage.getItem('selectedIdea');
    if (storedIdea) {
      this.idea = JSON.parse(storedIdea);
      sessionStorage.removeItem('selectedIdea'); // Nettoyage après récupération

      // Initialisation du formulaire avec les données de l'idée
      this.gift_ideas_form.patchValue({
        person_name: this.idea.person_name,
        idea: this.idea.idea,
        price: this.idea.price,
        link: this.idea.link,
        occasion: this.idea.occasion,
        is_offered: this.idea.is_offered,
      });
    } else {
      console.warn('Aucune idée trouvée, redirection vers la liste');
      this.router.navigate(['/gift-idea-list']); // Redirection si aucun objet `idea` n’est trouvé
    }
  }

  async onSubmit() {
    if (this.gift_ideas_form.valid) {
      if (this.gift_ideas_form.get('id')) {
        // Mise à jour de l'idée existante
        console.log('UPDATE');
      } else {
        // Création d'une nouvelle idée
        const formData = this.gift_ideas_form.value;
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
    } else {
      this.submissionSuccess = false;
    }
  }
}
