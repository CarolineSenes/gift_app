import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SupabaseService } from './supabase.service'; 
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kdoApp';
  isAuthenticated = false;
  session: any;
  googleAvatarUrl: string | null = null;

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    // Vérifie l'état de la session actuelle
    this.supabase.getSession().then((session) => {
      this.session = session;
      this.isAuthenticated = !!session;
      this.googleAvatarUrl = session?.user?.user_metadata?.['avatar_url'] || null;
    });

    // Gestion des changements de session
    this.supabase.authChanges((_, session) => {
      this.isAuthenticated = !!session;
      this.googleAvatarUrl = session?.user?.user_metadata?.['avatar_url'] || null;
    });
  }
}
