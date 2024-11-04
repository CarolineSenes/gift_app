import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-gift-idea-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gift-idea-list.component.html',
  styleUrl: './gift-idea-list.component.css',
})
export class GiftIdeaListComponent {
  giftIdeas: any[] = [];
  error: string | null = null;
  session: any;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    // Initialisation de la session lors de l'initialisation du composant
    this.session = this.supabase.session;

    // Gestion des changements de session
    this.supabase.authChanges((_, session) => {
      this.session = session;
    });

    this.fetchGiftIdeas();
  }

  async fetchGiftIdeas() {
    if (this.session) {
      const { data, error } = await this.supabase.getGiftIdeasForUser(
        this.session.user.id
      );

      if (error) {
        this.error = 'Could not retrieve gift ideas.';
      } else {
        this.giftIdeas = data || [];
      }
    } else {
      this.error = 'User is not logged in.';
    }
  }

  onEditIdea(idea: any) {
    sessionStorage.setItem('selectedIdea', JSON.stringify(idea));
    this.router.navigate(['/gift-to-offer-form', idea.id]);
  }

  async onDeleteIdea(idea: any): Promise<void> {
    const { error } = await this.supabase.deleteGiftIdea(idea.id);
    if (!error) {
      this.giftIdeas = this.giftIdeas.filter(g => g.id !== idea.id);
    } else {
      console.error('Erreur lors de la suppression de l\'idée dans Supabase :', error);
    }
  }
}
