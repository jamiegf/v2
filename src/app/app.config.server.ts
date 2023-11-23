import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideServerRendering } from '@angular/platform-server';
import { absoluteUrlInterceptor } from 'src/app/core/interceptors/absolute-url.interceptor';
import {
  ServerTimeoutService,
  TimeoutService,
} from 'src/app/core/services/ssr-guards/timeout.service';
import {
  HistoryService,
  ServerHistoryService,
} from 'src/app/core/services/system/history.service';
import {
  KeyListenerService,
  ServerKeyListenerService,
} from 'src/app/core/services/system/key-listener.service';
import {
  ServerStorageService,
  StorageService,
} from 'src/app/core/services/system/storage.service';
import {
  ServerTransferStateService,
  TransferStateService,
} from 'src/app/core/services/system/transfer-state.service';
import {
  ServerWindowService,
  WindowService,
} from 'src/app/core/services/system/window.service';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    {
      provide: KeyListenerService,
      useClass: ServerKeyListenerService,
    },
    {
      provide: TransferStateService,
      useClass: ServerTransferStateService,
    },
    {
      provide: StorageService,
      useClass: ServerStorageService,
    },
    {
      provide: WindowService,
      useClass: ServerWindowService,
    },
    {
      provide: TimeoutService,
      useClass: ServerTimeoutService,
    },
    {
      provide: HistoryService,
      useClass: ServerHistoryService,
    },
    provideServerRendering(),
    provideNoopAnimations(),
    provideHttpClient(withFetch(), withInterceptors([absoluteUrlInterceptor])),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
