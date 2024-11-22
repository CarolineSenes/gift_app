import { Component, Input } from '@angular/core';
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
  @Input() googleAvatarUrl: string | null = null;

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
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
