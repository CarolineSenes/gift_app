import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loading = false;
  signInForm: any;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Initialisation du formulaire dans ngOnInit après que le formBuilder soit prêt
    this.signInForm = this.formBuilder.group({
      email: '',
    });
  }

  async onSubmit(): Promise<void> {
    await this.supabase.signInWithGoogle();
    // try {
    //   this.loading = true;
    //   const email = this.signInForm.value.email as string;
    //   const { error } = await this.supabase.signIn(email);
    //   if (error) throw error;

    //   alert('Check your email for the login link!');

    //   // Redirection après connexion
    //   const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    //   this.router.navigate([returnUrl]); // Redirige l'utilisateur vers la page demandée ou account
    // } catch (error) {
    //   if (error instanceof Error) {
    //     alert(error.message);
    //   }
    // } finally {
    //   this.signInForm.reset();
    //   this.loading = false;
    // }
  }

  // async signInWithGoogle() {
  //   await this.supabase.signInWithGoogle();
  // }
}
