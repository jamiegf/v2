import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CategoryIconsComponent } from 'src/app/pages/lobby/components/category-icons/category-icons.component';
import { PoolListComponent } from 'src/app/pages/lobby/components/pool-list/pool-list.component';

@Component({
  selector: 'mipools-front-end-lobby',
  standalone: true,
  imports: [CommonModule, CategoryIconsComponent, PoolListComponent],
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {}
