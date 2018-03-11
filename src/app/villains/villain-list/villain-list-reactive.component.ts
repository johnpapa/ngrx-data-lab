import { Component, Input } from '@angular/core';

import { MasterDetailCommands, Villain } from '../../core';

@Component({
  selector: 'app-villain-reactive-list',
  templateUrl: './villain-list.component.html',
  styleUrls: ['./villain-list.component.scss']
})
export class VillainReactiveListComponent {
  @Input() villains: Villain[];
  @Input() selectedVillain: Villain;
  @Input() commands: MasterDetailCommands<Villain>;

  byId(villain: Villain) {
    return villain.id;
  }

  onSelect(villain: Villain) {
    this.commands.select(villain);
  }

  deleteVillain(villain: Villain) {
    this.commands.delete(villain);
  }
}
