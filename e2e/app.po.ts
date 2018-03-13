import { browser, by, element } from 'protractor';

by.addLocator(
  'formControlName',
  (value, opt_parentElement, opt_rootSelector) => {
    const using = opt_parentElement || document;

    return using.querySelectorAll(`[formControlName="${value}"]`);
  }
);

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

  getDetail() {
    return element(by.css('.detail-container'));
  }

  getDetailNameInputValue() {
    return (
      this.getDetailNameInput()
        // .element(by.css('input[formcontrolname="name"]'))
        .getAttribute('value')
    );
  }

  getDetailNameInput() {
    return this.getDetail().element(by.formControlName('name'));
  }

  getDetailTitle() {
    return this.getDetail().element(by.css('mat-card-title'));
  }

  getListItems() {
    return element.all(by.css('mat-card-content li'));
  }

  getNameElementFromList() {
    return this.getListItems()
      .first()
      .element(by.css('div.name'));
  }

  getTopButtons() {
    const buttons = element.all(by.css('control-panel .button-panel button'));
    return {
      refresh: buttons[0],
      add: buttons[1]
    };
  }

  async selectFirstItemInList() {
    const firstItem = this.getListItems().first();
    const nameElement = this.getNameElementFromList();
    const name = await nameElement.getText();
    await firstItem.click();

    return {
      firstItem,
      nameElement,
      name
    };
  }

  async closeDetails() {
    const cancelButton = await this.getDetail().element(
      by.cssContainingText('button', 'Cancel')
    );
    await cancelButton.click();
    return true;
  }

  async saveDetails() {
    const saveButton = await this.getDetail().element(
      by.cssContainingText('button', 'Save')
    );
    await saveButton.click();
    return true;
  }

  async changeDetailsName(newValue: string) {
    const name = await this.getDetailNameInput();
    name.sendKeys(newValue);
    return newValue;
  }
}
