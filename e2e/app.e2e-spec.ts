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

    it(`should open detail when item is selected`, () => {
      let name: string;

      const firstItem = page.getListItems().first();
      const nameElement = page.getNameElementFromList();

      nameElement
        .getText()
        .then(text => {
          name = text;
          return firstItem.click();
        })
        .then(() => expect(page.getDetailTitle().getText()).toMatch('Details'))
        .then(() => expect(page.getDetailNameInputValue()).toMatch(name));
    });
  }
});
