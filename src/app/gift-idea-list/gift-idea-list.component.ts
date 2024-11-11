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
  isLoading = true;
  showLoadingMessage = false;
  loadingTimeout: any;
  giftIdeas: any[] = [];
  error: string | null = null;
  session: any;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    this.initializeSession();

    if (this.session) {
      this.startLoadingMessage();
      await this.fetchGiftIdeas();
      this.stopLoadingMessage();
    }
  }

  /**
   * Initializes the session on component load and listens for session changes.
   */
  initializeSession() {
    this.session = this.supabase.session;
    this.supabase.authChanges((_, session) => {
      this.session = session;
    });
  }

  /**
   * Starts a timeout to display the loading message if fetching data takes too long.
   */
  startLoadingMessage() {
    this.loadingTimeout = setTimeout(() => {
      this.showLoadingMessage = true;
    }, 500);
  }

  /**
   * Clears the loading timeout and hides the loading message after data is fetched.
   */
  stopLoadingMessage() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    this.isLoading = false;
    this.showLoadingMessage = false;
  }

  /**
   * Fetches gift ideas for the logged-in user from Supabase.
   */
  async fetchGiftIdeas() {
    const { data, error } = await this.supabase.getGiftIdeasForUser(
      this.session.user.id
    );

    if (error) {
      this.error = 'Could not retrieve gift ideas.';
    } else {
      this.giftIdeas = data || [];
    }
  }

  /**
   * Navigates to the gift idea edit form with the selected idea.
   */
  onEditIdea(idea: any) {
    sessionStorage.setItem('selectedIdea', JSON.stringify(idea));
    this.router.navigate(['/gift-to-offer-form', idea.id]);
  }

  /**
   * Deletes a specific gift idea from Supabase and updates the local list.
   */
  async onDeleteIdea(idea: any): Promise<void> {
    const { error } = await this.supabase.deleteGiftIdea(idea.id);
    if (!error) {
      this.giftIdeas = this.giftIdeas.filter((g) => g.id !== idea.id);
    } else {
      console.error(
        "Erreur lors de la suppression de l'idée dans Supabase :",
        error
      );
    }
  }
}
