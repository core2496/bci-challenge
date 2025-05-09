import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { AppModule } from './app/app.module';
import { environment } from './environments/environments';

if (!environment.production) {
  console.log('Development environment');
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
