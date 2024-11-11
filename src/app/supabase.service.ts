import { Injectable } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { GiftIdea } from './models/gift-idea-model';

export interface Profile {
  id?: string;
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async signInWithGoogle(): Promise<void> {
    try {
      await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: '/' } // Remplacez par l'URL de redirection souhaitée
      });
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google:', error);
    }
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };

    return this.supabase.from('profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }

  // Méthode asynchrone pour obtenir la session
  async getSession(): Promise<AuthSession | null> {
    const { data } = await this.supabase.auth.getSession();
    this._session = data.session;
    return this._session;
  }

  // Fonction pour insérer les données dans la table `gift_ideas`
  async addGiftIdea(giftData: GiftIdea) {
    // Récupérer l'ID de l'utilisateur authentifié
    const user = this.session?.user.id;

    if (!user) {
      throw new Error('Utilisateur non authentifié.');
    }

    const { data, error } = await this.supabase
      .from('gift_ideas')
      .insert([{ ...giftData, user_id: user }]);

    if (error) {
      console.error('Erreur lors de l’insertion:', error);
      return null;
    }

    return data;
  }

  async updateGiftIdea(id: number, data: GiftIdea) {
    // Récupérer l'ID de l'utilisateur authentifié
    const user = this.session?.user.id;

    if (!user) {
      throw new Error('Utilisateur non authentifié.');
    }

    const { data: result, error } = await this.supabase
      .from('gift_ideas')
      .update(data)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return result;
  }

  // Récupérer les idées de cadeaux pour l'utilisateur connecté
  async getGiftIdeasForUser(userId: string) {
    const { data, error } = await this.supabase
      .from('gift_ideas')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  }

  // Supprimer une idée de cadeau pour l'utilisateur connecté
  async deleteGiftIdea(id: number): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase
      .from('gift_ideas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erreur lors de la suppression de l'idée :", error);
    }

    return { data, error };
  }
}
