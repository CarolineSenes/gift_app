import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const session = await this.supabase.getSession(); // Récupère la session

    if (session) {
      return true; // Si authentifié, l'accès est autorisé
    } else {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url }}); // Redirige vers /auth avec l'URL demandée
      return false;
    }
  }
}
