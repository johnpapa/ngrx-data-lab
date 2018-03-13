'use strict'; // necessary for es6 output in node.js
import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';

describe('ngrx-data-lab App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  describe('Heroes', () => {
    const entityName = 'heroes';
    beforeEach(() => {
      page.navigateToHeroes();
    });
    runNavigationTests(entityName);
  });

  describe('Villains', () => {
    const entityName = 'villains';
    beforeEach(() => {
      page.navigateToVillains();
    });
    runNavigationTests(entityName);
  });

  function runNavigationTests(entityName: string) {
    it(`should navigate to ${entityName}`, () => {
      const link = page.getActiveLink();
      expect(link.isPresent()).toBe(true);
      expect(page.getListTitle().getText()).toMatch(
        new RegExp(entityName, 'i')
      );
    });

    it(`should have ${entityName} items > 0`, () => {
      expect(page.getListItems().count()).toBeGreaterThan(0);
    });

    describe('when selecting an item from list', () => {
      it(`should open detail`, () => {
        const { namePromise } = selectFirstItemInList();
        namePromise.then(name =>
          expect(page.getDetailTitle().getText()).toMatch('Details')
        );
      });

      it(`should have matching name in selected list and detail item`, () => {
        const { namePromise } = selectFirstItemInList();
        namePromise.then(name =>
          expect(page.getDetailNameInputValue()).toMatch(name)
        );
      });
    });

    function selectFirstItemInList() {
      let name: string;

      const firstItem = page.getListItems().first();
      const nameElement = page.getNameElementFromList();

      const namePromise = nameElement
        .getText()
        .then(text => {
          name = text;
          return firstItem.click();
        })
        .then(() => name);

      return {
        firstItem,
        nameElement,
        namePromise
      };
    }
  }
});
