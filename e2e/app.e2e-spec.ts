'use strict'; // necessary for es6 output in node.js
import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';

describe('ngrx-data-lab App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  // describe('async', () => {
  //   it('should work', async () => {
  //     await page.navigateToHeroes();
  //     expect(await page.getListTitle().getText()).toMatch('Heroes');
  //   });
  // });

  // describe('Heroes', () => {
    const entityName = 'heroes';
    beforeEach(async () => {
      await page.navigateToHeroes();
    });
    runNavigationTests(entityName);
  });

  describe('Villains', () => {
    const entityName = 'villains';
    beforeEach(async () => {
      await page.navigateToVillains();
    });
    runNavigationTests(entityName);
  });

  function runNavigationTests(entityName: string) {
    it(`should navigate to ${entityName}`, async () => {
      const link = page.getActiveLink();
      expect(await link.isPresent()).toBe(true);
      expect(await page.getListTitle().getText()).toMatch(
        new RegExp(entityName, 'i')
      );
    });

    it(`should have ${entityName} items > 0`, async () => {
      expect(await page.getListItems().count()).toBeGreaterThan(0);
    });

    describe('when selecting an item from list', () => {
      it(`should open detail`, async () => {
        await page.selectFirstItemInList();
        expect(await page.getDetailTitle().getText()).toMatch('Details');
      });

      it(`should have matching name in selected list and detail item`, async () => {
        const { name } = await page.selectFirstItemInList();
        expect(await page.getDetailNameInputValue()).toMatch(name);
      });
    });
  }
});
