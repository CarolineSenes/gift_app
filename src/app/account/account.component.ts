import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthSession } from '@supabase/supabase-js';
import { Profile, SupabaseService } from '../supabase.service';
import { AvatarComponent } from "../avatar/avatar.component";

@Component({
  selector: 'app-account',
  standalone: true, // Mode standalone activé
  imports: [CommonModule, ReactiveFormsModule, AvatarComponent], // Ajout des modules nécessaires
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  loading = false;
  profile!: Profile;
  session: any; // Déclaration explicite avec `any` ou le type que tu utilises pour la session

  updateProfileForm: any; // Déclare le formulaire sans initialisation ici

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder // Le formBuilder est initialisé ici
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire dans ngOnInit après que formBuilder soit prêt
    this.updateProfileForm = this.formBuilder.group({
      username: '',
      website: '',
      avatar_url: '',
    });

        // Initialisation de la session lors de l'initialisation du composant
        this.session = this.supabase.session;

        // Gestion des changements de session
        this.supabase.authChanges((_, session) => {
          this.session = session;
        });
    

    this.getProfile();
  }

  async getProfile() {
    try {
      this.loading = true;

      const { user } = this.session;
      const { data: profile, error, status } = await this.supabase.profile(user);

      if (error && status !== 406) {
        throw error;
      }

      if (profile) {
        this.profile = profile;
        const { username, website, avatar_url } = this.profile;
        this.updateProfileForm.patchValue({
          username,
          website,
          avatar_url,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true;
      const { user } = this.session;

      const username = this.updateProfileForm.value.username as string;
      const website = this.updateProfileForm.value.website as string;
      const avatar_url = this.updateProfileForm.value.avatar_url as string;

      const { error } = await this.supabase.updateProfile({
        id: user.id,
        username,
        website,
        avatar_url,
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      this.loading = false;
    }
  }

  async signOut() {
    await this.supabase.signOut();
  }

  get avatarUrl() {
    return this.updateProfileForm.value.avatar_url as string
  }

  async updateAvatar(event: string): Promise<void> {
    this.updateProfileForm.patchValue({
      avatar_url: event,
    })
    await this.updateProfile()
  }
}
