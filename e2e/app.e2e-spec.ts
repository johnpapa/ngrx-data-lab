'use strict'; // necessary for es6 output in node.js
import { AppPage } from './app.po';

describe('ngrx-data-lab App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  describe('Heroes', () => {
    beforeEach(() => {
      page.navigateToHeroes();
    });
    runAllComponentTests('heroes');
  });

  describe('Villains', () => {
    beforeEach(() => {
      page.navigateToVillains();
    });
    runAllComponentTests('villains');
  });

  function runAllComponentTests(entityName: string) {
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

    it(`should open detail when item is selected`, () => {
      page
        .getListItems()
        .first()
        .click()
        .then(item =>
          expect(page.getDetailTitle().getText()).toMatch('Details')
        );
    });
  }
});
