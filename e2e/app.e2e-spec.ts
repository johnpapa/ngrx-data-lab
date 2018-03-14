'use strict'; // necessary for es6 output in node.js
import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';

describe('ngrx-data-lab App', () => {
  let page: AppPage;

  beforeEach(() => (page = new AppPage()));

  describe('Heroes', () => {
    const entityName = 'heroes';
    beforeEach(async () => await page.navigateToHeroes());
    runNavigationTests(entityName);
  });

  describe('Villains', () => {
    const entityName = 'villains';
    beforeEach(async () => await page.navigateToVillains());
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

    it(`should remove item when deleted`, async () => {
      const originalListCount = await page.getListItems().count();
      await page.deleteFirstListItem();
      expect(await page.getListItems().count()).toEqual(originalListCount - 1);
    });

    describe(`when selecting an item from ${entityName} list`, () => {
      it(`should open detail`, async () => {
        await page.selectFirstItemInList();
        expect(await page.getDetailTitle().getText()).toMatch('Details');
      });

      it(`should have matching name in selected list and detail item`, async () => {
        const { name: originalListName } = await page.selectFirstItemInList();
        expect(await page.getDetailNameInputValue()).toMatch(originalListName);
      });

      it(`should not save when editing and canceling`, async () => {
        const { name: originalListName } = await page.selectFirstItemInList();
        const newName = await page.changeDetailsName('new name');
        await page.closeDetails();
        expect(await page.getDetailNameInput().isPresent()).toBe(false);
        expect(originalListName).not.toMatch(newName);
      });

      it(`should save when editing and saving`, async () => {
        const { name: originalListName } = await page.selectFirstItemInList();
        const newName = await page.changeDetailsName('new name');
        await page.saveDetails();
        const updatedListName = await page.getNameElementFromList().getText();
        expect(await page.getDetailNameInput().isPresent()).toBe(false);
        expect(updatedListName).toMatch(newName);
        expect(originalListName).not.toMatch(updatedListName);
      });
    });
  }
});
