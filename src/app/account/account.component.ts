import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Profile, SupabaseService } from '../supabase.service';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvatarComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  loading = false;
  profile!: Profile;
  session: any;

  updateProfileForm: any;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initializing the form
    this.updateProfileForm = this.formBuilder.group({
      username: '',
      website: '',
      avatar_url: '',
    });

    // Session initialization
    this.session = this.supabase.session;

    // Managing session changes
    this.supabase.authChanges((_, session) => {
      this.session = session;
    });

    this.getProfile();
  }

  /**
   * Retrieves the user's profile from the Supabase service and updates the profile form.
   *
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async getProfile() {
    try {
      this.loading = true;

      const { user } = this.session;
      const {
        data: profile,
        error,
        status,
      } = await this.supabase.profile(user);

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

  /**
   * Updates the user's profile in the Supabase service.
   *
   * @return {Promise<void>} A promise that resolves when the profile update operation is complete.
   */
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

  /**
   * Retrieves the avatar URL from the reactive profile form.
   *
   * @return {string} The URL of the user's avatar.
   */
  get avatarUrl() {
    return this.updateProfileForm.value.avatar_url as string;
  }

  /**
   * Updates the avatar URL in the reactive profile form and saves the updated profile.
   *
   * @param {string} event - The new avatar URL to set in the profile.
   * @return {Promise<void>} A promise that resolves when the profile update is complete.
   */
  async updateAvatar(event: string): Promise<void> {
    this.updateProfileForm.patchValue({
      avatar_url: event,
    });
    await this.updateProfile();
  }
}
