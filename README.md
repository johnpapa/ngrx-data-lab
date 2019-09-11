# NgRx Data Lab

Want to learn how to use NgRx without all of the boilerplate? Try out [NgRx Data](https://github.com/johnpapa/angular-ngrx-data) with our quickstart!

## QuickStart

This quick start begins with a working angular app that has CRUD operations for heroes and villain entities. This app uses traditional services and techniques to get and save the heroes and villains. In this quick start you will add NgRx and NgRx Data to the app.

> What are we doing? Great question! We're going to start with a reactive Angular app and add NgRx to it, using the NgRx Data library.
>
> Later you may wish to read the online official documentation for [Ngrx](https://ngrx.io/docs) and [Ngrx Data](https://ngrx.io/guide/data)

## Let's go

Try these steps yourself on your computer, or if you prefer follow along [here on StackBlitz](https://stackblitz.com/github/johnpapa/ngrx-data-lab?file=quickstart.md).

> If you don't want to try the steps yourself, you can jump right to the solution by cloning the `finish` branch.

### Step 1 - Get the app and install NgRx

The app uses a traditional data service to get the heroes and villains. We'll be adding NgRx and NgRx Data to this application.

```bash
git clone https://github.com/johnpapa/ngrx-data-lab.git
cd ngrx-data-lab
npm install
npm i @ngrx/effects @ngrx/entity @ngrx/store @ngrx/data @ngrx/store-devtools --save
```

### Step 2 - Create the NgRx App Store

We start by creating the NgRx store module for our application. Execute the following code to generate the module and import it into our root NgModule.

```bash
ng g m store/app-store --flat -m app --spec false
```

First we set up NgRx itself by importing the NgRx store, effects, and the dev tools. Replace the contents of `app-store.module.ts` with the following code.

```typescript
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    environment.production ? [] : StoreDevtoolsModule.instrument()
  ]
})
export class AppStoreModule {}
```

### Step 3 - Define the entities for our store

Next we define the entities in our store by creating a plain TypeScript file named `entity-metadata.ts` in the `store` folder.

We need to tell NgRx Data about our entities so we create an `EntityMetadataMap` and define a set of properties, one for each entity name.

> We have two entities: Hero and Villain. As you might imagine, we add one line of code for every additional entity. That's it!

Add the following code in the `entity-metadata.ts` to define our entities:

```typescript
import { EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Hero: {},
  Villain: {}
};

// because the plural of "hero" is not "heros"
const pluralNames = { Hero: 'Heroes' };

export const entityConfig = {
  entityMetadata,
  pluralNames
};
```

Notice we export the entity configuration. We'll be importing that into our entity store in a moment.

### Step 4 - Import the entity store into the app store

Return to the `app-store.module.ts` file.

We need to add the entity configuration that we just created in the previous step, and put it into the root store for NgRx. We do this by importing the `entityConfig` and then passing it to the `EntityDataModule.forRoot()` function.

Add the following two lines of code to import the symbols into `app-store.module.ts`.

```typescript
import { entityConfig } from './entity-metadata';
import { EntityDataModule } from '@ngrx/data';
```

Then add the following line into the `imports` array of `@NgModule`.

```typescript
  EntityDataModule.forRoot(entityConfig),
```

### Step 5 - Simplify the Hero and Villain data services

NgRx Data handles getting and saving our data for us.
Everything our app needs to do can be handled by a sub-class of the `EntityCollectionService` that you customize for each entity type.

In this demo, we don't have to customize the services at all.

For `Hero`, replace the contents of `heroes/hero.service.ts` with the following code.

```typescript
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from '@ngrx/data';
import { Hero } from '../core';

@Injectable({ providedIn: 'root' })
export class HeroService extends EntityCollectionServiceBase<Hero> {
  constructor(factory: EntityCollectionServiceElementsFactory) {
    super('Hero', factory);
  }
}
```

For `Villain`, replace the contents of `villains/villain.service.ts` with the following code.

```typescript
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from '@ngrx/data';
import { Villain } from '../core';

@Injectable({ providedIn: 'root' })
export class VillainService extends EntityCollectionServiceBase<Villain> {
  constructor(factory: EntityCollectionServiceElementsFactory) {
    super('Villain', factory);
  }
}
```

### Step 6 - Refactor the Container Component to use Observables

Our component currently uses an array of heroes. We switch to an _Observable_ of the heroes array so we can observe and display the changes made in the NgRx store.

Open the `heroes.component.ts` file and modify the `heroes` array to be an `Observable<Hero[]>`.

```typescript
heroes$: Observable<Hero[]>;
```

Modify the `loading` property to be an `Observable<boolean>`.

```typescript
loading$: Observable<boolean>;
```

Add the import for Observable to the top of the file.

```typescript
import { Observable } from 'rxjs';
```

We need to listen for the stream of hereos. Set your new `heroes$` property to the Observable returned from the `heroeService.entities$`

```typescript
constructor(private heroService: HeroService) {
  this.heroes$ = heroService.entities$;
}
```

Here is the fun part, all of our logic in the component becomes simpler.

The `add`, `delete`, `getHeroes`, and `update` methods get a whole lot simpler, and shorter as NgRx Data handles these common operations. Replace your similar methods with the following ones.

```typescript
add(hero: Hero) {
  this.heroService.add(hero);
}

delete(hero: Hero) {
  this.heroService.delete(hero);
  this.close();
}

getHeroes() {
  this.heroService.getAll();
  this.close();
}

update(hero: Hero) {
  this.heroService.update(hero);
}
```

The only change to our template is to look at the observable of `heroes$` instead of the former array of heroes. Change the `*ngIf` by adding the `async` pipe and labelling the result as `heroes`.

```html
<div *ngIf="heroes$ | async as heroes"></div>
```

Also find the `loading` refernce in this template file and change it to the following:

```html
<mat-spinner
  *ngIf="loading$ | async;else heroList"
  mode="indeterminate"
  color="accent"
></mat-spinner>
```

Now repeat these steps for the `VillainsComponent`.

### Step 7 - Run it

Run the app!

```bash
ng serve -o
```

### Step 8 - Verify the Redux actions are being dispatched

In the Chrome browser, open the DevTools and select the Redux tab to view the Redux plugin.

In the application, add, update, and remove heroes and villains. As you do this, notice the actions being dispatched in the [Redux Devtools](https://github.com/zalmoxisus/redux-devtools-extension)

## What we did

In retrospect, here are the changes we made to our app to add NgRx via the NgRx Data library.

- installed our dependencies
- added these files `store/app-store.module.ts` and `store/entity-metadata.ts`
- told NgRx and NgRx Data about our entities
- refactored and simplified our data services `heroes/hero.service.ts` and `villains/villain.service.ts`
- refactored and simplified our container components `heroes/heroes.component.ts` and `villains/villains.component.ts`

## What we accomplished

OK, but why? Why did we do this? Why should I care?

We just added the redux pattern to our app and configured it for two entities. Your app may have dozens or even hundreds of entities. Now imagine what you would need to do to support all of those entities with this pattern. With NgRx Data you add a single line of code to `store/entity-store.module.ts` for each entity and that's it! You heard that right, one line!

NgRx Data provides all commonly used selectors, actions, action creators, reducers, and effects out of the box.

It is only natural that our apps may not follow the exact conventions that NgRx Data uses. That's OK! If your entity needs a different reducer or effect, you can replace those via configuration. If your web API url doesn't follow the pattern `/api/heroes`, that's OK! Just override the convention with your own configuration. All of the custom tweaks that you want are available to you when you need them.

## Bonus: re-enable toast notifications for NgRx Data

When we migrated to _NgRx Data_, we lost the toast notifications that were part of the services. We can restore notifications with these easy steps.

### Bonus Step 1 - Add a _NgrxDataToastService_

Create a `ngrx-data-toast.service.ts` file using the following CLI command

```bash
ng g s store/ngrx-data-toast -m store/app-store --spec false
```

### Bonus Step 2 - Show toasts on success and error actions

The service listens to the _NgRx Data_ `EntityActions` observable, which publishes all _NgRx Data_ entity actions.

We'll only notify the user about HTTP success and failure so we use the RxJs `pipe` operator and then we filter for entity operation names that end in "\_SUCCESS" or "\_ERROR".

The subscribe method raises a toast message for those actions (`toast.openSnackBar()`).

```javascript
import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import {
  EntityAction,
  EntityCacheAction,
  ofEntityOp,
  OP_ERROR,
  OP_SUCCESS
} from '@ngrx/data';
import { filter } from 'rxjs/operators';
import { ToastService } from '../core/toast.service';

/** Report @ngrx/data success/error actions as toast messages * */
@Injectable({ providedIn: 'root' })
export class NgrxDataToastService {
  constructor(actions$: Actions, toast: ToastService) {
    actions$
      .pipe(
        ofEntityOp(),
        filter(
          (ea: EntityAction) =>
            ea.payload.entityOp.endsWith(OP_SUCCESS) ||
            ea.payload.entityOp.endsWith(OP_ERROR)
        )
      )
      // this service never dies so no need to unsubscribe
      .subscribe(action =>
        toast.openSnackBar(
          `${action.payload.entityName} action`,
          action.payload.entityOp
        )
      );

    actions$
      .pipe(
        ofType(
          EntityCacheAction.SAVE_ENTITIES_SUCCESS,
          EntityCacheAction.SAVE_ENTITIES_ERROR
        )
      )
      .subscribe((action: any) =>
        toast.openSnackBar(
          `${action.type} - url: ${action.payload.url}`,
          'SaveEntities'
        )
      );
  }
}
```

### Bonus Step 3 - Connect the toastService to the Store

Add the following import to `app-store.module.ts`

```typescript
import { NgrxDataToastService } from './ngrx-data-toast.service';
```

Inject the new service into the constructor for `AppStoreModule`

```typescript
  constructor(toastService: NgrxDataToastService) {}
```

While the module class doesn't use the toast service, the act of injecting it causes that service to be created and start listening for NgRx Data events.

### Bonus Step 4 - Run it

Run the app!

```bash
ng serve -o
```
