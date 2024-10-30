import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../supabase.service';


@Component({
  selector: 'app-gift-idea-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gift-idea-list.component.html',
  styleUrl: './gift-idea-list.component.css'
})
export class GiftIdeaListComponent {
  giftIdeas: any[] = [];
  error: string | null = null;
  session: any;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    // Initialisation de la session lors de l'initialisation du composant
    this.session = this.supabase.session;

    // Gestion des changements de session
    this.supabase.authChanges((_, session) => {
      this.session = session;
    });

    console.log('this.session.user.id', this.session.user.id);
    
    this.fetchGiftIdeas();
  }

  async fetchGiftIdeas() {
    if (this.session) {
      const { data, error } = await this.supabase.getGiftIdeasForUser(this.session.user.id);
      console.log('data', data);

      if (error) {
        this.error = "Could not retrieve gift ideas.";
      } else {
        this.giftIdeas = data || [];
      }
    } else {
      this.error = "User is not logged in.";
    }
  }
}
