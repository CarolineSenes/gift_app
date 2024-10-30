import { Component } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  session: any;

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialisation de la session lors de l'initialisation du composant
    this.session = this.supabase.session;

    // Gestion des changements de session
    this.supabase.authChanges((_, session) => {
      this.session = session;
    });
  }

  navigateToGiftForm() {
    this.router.navigate(['/gift-to-offer-form']);
  }

  navigateToGiftList() {
    this.router.navigate(['/gift-list']);
  }

  navigateToAccount() {
    this.router.navigate(['/account']);
  }

  logout() {
    this.supabase.signOut().then(() => {
      // Redirection vers la page d'authentification après déconnexion
      this.router.navigate(['/auth']);
    });
  }
}
