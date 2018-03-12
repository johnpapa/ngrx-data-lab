import { browser, by, element } from 'protractor';

export class AppPage {
  navigateToHeroes() {
    return browser.get('/heroes');
  }

  navigateToVillains() {
    return browser.get('/villains');
  }

  getToolbarLinks() {
    return element.all(by.css('mat-toolbar a[routerlinkactive]'));
  }

  getActiveLink() {
    return element(by.css('mat-toolbar a.router-link-active'));
  }

  getListTitle() {
    return element(by.css('.list-container mat-card-title'));
  }

  getDetailTitle() {
    return element(by.css('.detail-container mat-card-title'));
  }

  getListItems() {
    return element.all(by.css('mat-card-content li'));
  }

  getTopButtons() {
    const buttons = element.all(by.css('control-panel .button-panel button'));
    return {
      refresh: buttons[0],
      add: buttons[1]
    };
  }
}
