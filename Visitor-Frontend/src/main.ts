//Angular application execution starts from main.ts, where bootstrapApplication initializes the root component.

import { bootstrapApplication } from '@angular/platform-browser'; //defined in node modules @angular/platform-browser package.

import { appConfig } from './app/app.config'; //Registers global services like:Router,HttpClient,Guards

import { AppComponent } from './app/app.component'; //a class decorated with @Component, which defines the root component of the application.

bootstrapApplication(AppComponent, appConfig)

  .catch((err) => console.error(err));



  //whn u do ng new project-name

  /*src/
 ├── main.ts //entry point of the application
 ├── index.html //html file that loads the application
 ├── app/
 │    ├── app.component.ts, html, css //root ui
 │    ├── app.config.ts      //global services
 │    ├── app.routes.ts*/    //navigation routes