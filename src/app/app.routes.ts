import { Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AuthComponent } from './auth/auth.component';
import { GiftToOfferFormComponent } from './gift-to-offer-form/gift-to-offer-form.component';
import { AuthGuard } from './auth.guard';
import { GiftIdeaListComponent } from './gift-idea-list/gift-idea-list.component';

export const routes: Routes = [
  { path: '', component: GiftToOfferFormComponent, canActivate: [AuthGuard] }, // Garde la route par défaut sans redirectTo
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'gift-to-offer-form', component: GiftToOfferFormComponent, canActivate: [AuthGuard] },
  { path: 'gift-list', component: GiftIdeaListComponent, canActivate: [AuthGuard] },
];
