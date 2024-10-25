import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from './supabase.service'; 
import { CommonModule } from '@angular/common';
import { AccountComponent } from "./account/account.component";
import { AuthComponent } from "./auth/auth.component";
import { NavbarComponent } from "./navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, AccountComponent, AuthComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kdoApp';
  session: any; // Déclaration explicite avec `any` ou le type que tu utilises pour la session

  constructor(private readonly supabase: SupabaseService) {}

  ngOnInit() {
    // Initialisation de la session lors de l'initialisation du composant
    this.session = this.supabase.session;

    // Gestion des changements de session
    this.supabase.authChanges((_, session) => {
      this.session = session;
    });
  }
}
