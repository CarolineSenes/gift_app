import { Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AuthComponent } from './auth/auth.component';
import { GiftToOfferFormComponent } from './gift-to-offer-form/gift-to-offer-form.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: GiftToOfferFormComponent, canActivate: [AuthGuard] }, // Garde la route par défaut sans redirectTo
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] }, // Route protégée par le AuthGuard
  { path: 'auth', component: AuthComponent }, // Route d'authentification sans garde
  { path: 'gift-to-offer-form', component: GiftToOfferFormComponent, canActivate: [AuthGuard] }, // Protégé par le AuthGuard
];
