# NgRx Data Lab

Want to learn how to use NgRx without all of the boilerplate? Try out [ngrx-data](https://github.com/johnpapa/angular-ngrx-data) with our quickstart!

## QuickStart

This quick start begins with a working angular app that has CRUD operations for heroes and villain entities. This app uses traditional services and techniques to get and save the heroes and villains. In this quick start you will add NgRx and ngrx-data to the app.

> What are we doing? Great question! We're going to start with a reactive Angular app and add ngrx to it, using the ngrx-data library.

## Let's go

Try these steps yourself on your computer, or if you prefer follow along [here on StackBlitz](https://stackblitz.com/github/johnpapa/ngrx-data-lab?file=quickstart.md).

### Step 1 - Get the app and install ngrx

The app uses a traditional data service to get the heroes and villains. We'll be adding ngrx and ngrx-data to this application.

```bash
git clone https://github.com/johnpapa/ngrx-data-lab.git
cd ngrx-data-lab
npm install
npm i @ngrx/effects @ngrx/entity @ngrx/store @ngrx/store-devtools ngrx-data --save
```

### Step 2 - Create the NgRx App Store

We start by creating the NgRx store module for our application. Execute the following code to generate the module and import it into our root NgModule.

```bash
ng g m store/app-store --flat -m app
```

First we set up NgRx itself by importing the NgRx store, effects, and the dev tools. Replace the contents of `app-store.module.ts` with the following code.

```typescript
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
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

We need to tell ngrx-data about our entities so we create an `EntityMetadataMap` and define a set of properties, one for each entity name.

> We have two entities: Hero and Villain. As you might imagine, we add one line of code for every additional entity. That's it!

Add the following code in the `entity-metadata.ts` to define our entities:

```typescript
import { EntityMetadataMap } from 'ngrx-data';

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

We need to add the entity configuration that we just created in the previous step, and put it into the root store for NgRx. We do this by importing the `entityConfig` and then passing it to the `NgrxDataModule.forRoot()` function.

Add the following two line of code to import the symbols.

```typescript
import { DefaultDataServiceConfig, NgrxDataModule } from 'ngrx-data';
import { entityConfig } from './entity-metadata';
```

Then add the following line intot he `imports` array.

```typescript
  NgrxDataModule.forRoot(entityConfig),
```

### Step 5 - Simplify the Hero and Villain data services

ngrx-data handles getting and saving our data for us. Replace the contents of `heroes/hero.service.ts` with the following code.

```typescript
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from 'ngrx-data';
import { Hero } from '../core';

@Injectable({ providedIn: 'root' })
export class HeroService extends EntityCollectionServiceBase<Hero> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Hero', serviceElementsFactory);
  }
}
```

Replace the contents of `villains/villain.service.ts` with the following code.

```typescript
import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from 'ngrx-data';
import { Villain } from '../core';

@Injectable({ providedIn: 'root' })
export class VillainService extends EntityCollectionServiceBase<Villain> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Villain', serviceElementsFactory);
  }
}
```

### Step 6 - Remove unused service

You may be wondering what happened to the `ReactiveDataService` in `reactive-data.service.ts`. It is no longer needed since our app is using ngrx-data! So we can remove this file from our app and remove the reference to it in `core/index.ts`.

### Step 7 - Run it

Run the app!

```bash
ng serve -o
```

## What we did

In retrospect, here are the changes we made to our app to add NgRx via the ngrx-data library.

* installed our dependencies
* added these files `store/app-store.module.ts` and `store/entity-store.module.ts`
* told NgRx and ngrx-data about our entities
* refactored and simplified our data services `heroes/hero.service.ts` and `villains/villain.service.ts`
* removed obsolete `core/reactive-data.service.ts`

## What we accomplished

OK, but why? Why did we do this? Why should I care?

We just added the redux pattern to our app and configured it for two entities. Your app may have dozens or even hundreds of entities. Now imagine what you would need to do to support all of those entities with this pattern. With ngrx-data you add a single line of code to `store/entity-store.module.ts` for each entity and that's it! You heard that right, one line!

ngrx-data provides all commonly used selectors, actions, action creators, reducers, and effects out of the box.

It is only natural that our apps may not follow the exact conventions that ngrx-data uses. That's OK! If your entity needs a different reducer or effect, you can replace those via configuration. If your web API url doesn't follow the pattern `/api/heroes`, that's OK! Just override the convention with your own configuration. All of the custom tweaks that you want are available to you when you need them.

## Bonus: re-enable toast notifications for ngrx-data

When we migrated to _ngrx-data_, we lost the toast notifications that were part of the `ReactiveDataService` (now deleted). We can restore notifications with these easy, one-time steps.

### Bonus Step 1 - Add a _NgrxDataToastService_

Create a `ngrx-data-toast.service.ts` file using the following CLI command

```bash
ng g s store/ngrx-data-toast -m store/entity-store --spec false
```

### Bonus Step 2 - Show toasts on success and error actions

The service listens to the _ngrx-data_ `EntityActions` observable, which publishes all _ngrx-data_ entity actions.

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
} from 'ngrx-data';
import { filter } from 'rxjs/operators';
import { ToastService } from '../core/toast.service';

/** Report ngrx-data success/error actions as toast messages * */
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

### Bonus Step 3 - instantiate `NgrxDataToastService` at startup

We need to make sure our new toast service loads.

Replace the code in `entity-store.modules.ts` with the following code.

```javascript
import { NgModule } from '@angular/core';
import { EntityMetadataMap, NgrxDataModule } from 'ngrx-data';
import { NgrxDataToastService } from './ngrx-data-toast.service';

export const entityMetadata: EntityMetadataMap = {
  Hero: {},
  Villain: {}
};

// because the plural of "hero" is not "heros"
export const pluralNames = { Hero: 'Heroes' };

@NgModule({
  imports: [
    NgrxDataModule.forRoot({
      entityMetadata: entityMetadata,
      pluralNames: pluralNames
    })
  ],
  providers: [NgrxDataToastService]
})
export class EntityStoreModule {
  constructor(private toast: NgrxDataToastService) {}
}
```
