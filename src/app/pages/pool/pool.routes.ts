import { Route } from '@angular/router';
import { HowToPlayComponent } from 'src/app/pages/pool/how-to-play/how-to-play.component';
import { PaymentComponent } from 'src/app/pages/pool/payment/payment.component';
import { paymentGuard } from 'src/app/pages/pool/payment/payment.guard';
import { QaComponent } from 'src/app/pages/pool/qa/qa.component';
import { ResultComponent } from 'src/app/pages/pool/result/result.component';
import { resultResolver } from 'src/app/pages/pool/result/result.resolver';
import { SummaryComponent } from 'src/app/pages/pool/summary/summary.component';

export const POOL_ROUTES: Route[] = [
  {
    path: 'qa',
    component: QaComponent,
  },
  {
    path: 'how-to-play',
    component: HowToPlayComponent,
  },
  {
    path: 'summary',
    component: SummaryComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [paymentGuard],
  },
  {
    path: 'result',
    component: ResultComponent,
    resolve: { results: resultResolver },
  },
];
