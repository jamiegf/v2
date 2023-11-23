import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from 'src/app/shared/footer/footer.component';
import { HeaderBarComponent } from 'src/app/shared/header-bar/header-bar.component';
import { NavMenuComponent } from 'src/app/shared/header-bar/nav-menu/nav-menu.component';
import { OverlayModule } from 'src/app/shared/overlay/overlay.module';

@Component({
  selector: 'mipools-front-end-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderBarComponent,
    MatSidenavModule,
    OverlayModule,
    FooterComponent,
    NavMenuComponent,
  ],
  template: `
    <mipools-front-end-overlay></mipools-front-end-overlay>
    <mat-sidenav-container>
      <mat-sidenav #navMenu class="side-nav" mode="over" position="start">
        <mipools-front-end-nav-menu
          [sideNavRef]="navMenu"
        ></mipools-front-end-nav-menu>
      </mat-sidenav>
      <mat-sidenav-content>
        <section class="page">
          <mipools-front-end-header-bar [sideNavRef]="navMenu">
          </mipools-front-end-header-bar>
          <div id="content">
            <router-outlet></router-outlet>
          </div>
        </section>
        <mipools-front-end-footer></mipools-front-end-footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
  @use 'colors';
  mat-sidenav-container {
    background-color: black;
  }
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;

  }

  .mat-sidenav-content {
    overflow-x: hidden;
  }

  .side-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    padding: 7vh 7vw 0 7vw;
    background-color: colors.$dark-grey;
    z-index: 999;

    @media screen and (min-width:480px) {
      width: 17.5rem;
      padding: 7vh 2vw 0 3vw;
    }

  }

  #content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: transparent;
    width: 100%;
    flex-grow: 1;
  }
`,
})
export class AppComponent {}
