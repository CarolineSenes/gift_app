import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { GiftIdea } from '../models/gift-idea-model';

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
  giftIdeas: GiftIdea[] = [];
  uniquePersonNames: string[] = [];
  selectedPerson: string | null = null;
  filteredGiftIdeas: GiftIdea[] = [];
  isDropdownOpen = false;
  error: string | null = null;
  session: any;

  constructor(private supabase: SupabaseService, private router: Router) {}

  async ngOnInit() {
    this.initializeSession();

    if (this.session) {
      this.startLoadingMessage();
      await this.fetchGiftIdeas();
      this.filteredGiftIdeas = this.giftIdeas;
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
      this.uniquePersonNames = [
        ...new Set(
          this.giftIdeas
            .map((idea) => idea.person_name)
            .filter((name): name is string => name !== undefined)
        ),
      ];
    }
  }

  /**
   * Filters the gift ideas based on the selected person's name.
   * Updates the filteredGiftIdeas array to display only the items for the selected person.
   *
   * @param person - The name of the person whose gift ideas are to be displayed.
   */
  selectPerson(person: string): void {
    this.selectedPerson = person;
    this.filteredGiftIdeas = this.giftIdeas.filter(
      (idea) => idea.person_name === person
    );
    this.isDropdownOpen = false;
  }

  /**
   * Resets the filter applied to the gift ideas.
   * Clears the selectedPerson and restores the full list of gift ideas.
   */
  resetFilter(): void {
    this.selectedPerson = null;
    this.filteredGiftIdeas = this.giftIdeas;
    this.isDropdownOpen = false;
  }

  /**
   * Toggles the dropdown state.
   */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Navigates to the gift idea edit form with the selected idea.
   */
  onEditIdea(idea: GiftIdea) {
    sessionStorage.setItem('selectedIdea', JSON.stringify(idea));
    this.router.navigate(['/gift-to-offer-form', idea.id]);
  }

  /**
   * Deletes a specific gift idea from Supabase and updates the local list.
   */
  async onDeleteIdea(idea: GiftIdea): Promise<void> {
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
