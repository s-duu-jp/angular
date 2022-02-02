/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT} from '@angular/common';
import {Component, Inject, Injectable, NgModule} from '@angular/core';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Router, RouterModule, RouterStateSnapshot, TitleStrategy} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

describe('title strategy', () => {
  describe('DefaultTitleStrategy', () => {
    let router: Router;
    let document: Document;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          TestModule,
        ],
      });
      router = TestBed.inject(Router);
      document = TestBed.inject(DOCUMENT);
    });

    it('sets page title from data', fakeAsync(() => {
         router.resetConfig([{path: 'home', title: 'My Application', component: BlankCmp}]);
         router.navigateByUrl('home');
         tick();
         expect(document.title).toBe('My Application');
       }));

    it('sets page title from resolved data', fakeAsync(() => {
         router.resetConfig([{path: 'home', title: TitleResolver, component: BlankCmp}]);
         router.navigateByUrl('home');
         tick();
         expect(document.title).toBe('resolved title');
       }));

    it('sets title with child routes', fakeAsync(() => {
         router.resetConfig([{
           path: 'home',
           title: 'My Application',
           children: [
             {path: '', title: 'child title', component: BlankCmp},
           ]
         }]);
         router.navigateByUrl('home');
         tick();
         expect(document.title).toBe('child title');
       }));

    it('sets title with child routes and named outlets', fakeAsync(() => {
         router.resetConfig([
           {
             path: 'home',
             title: 'My Application',
             children: [
               {path: '', title: 'child title', component: BlankCmp},
               {path: '', outlet: 'childaux', title: 'child aux title', component: BlankCmp},
             ],
           },
           {path: 'compose', component: BlankCmp, outlet: 'aux', title: 'compose'}
         ]);
         router.navigateByUrl('home(aux:compose)');
         tick();
         expect(document.title).toBe('child title');
       }));

    it('sets page title with paramsInheritanceStrategy=always', fakeAsync(() => {
         router.paramsInheritanceStrategy = 'always';
         router.resetConfig([
           {
             path: 'home',
             title: 'My Application',
             children: [
               {
                 path: '',
                 title: TitleResolver,
                 component: BlankCmp,
               },
             ],
           },
         ]);
         router.navigateByUrl('home');
         tick();
         expect(document.title).toBe('resolved title');
       }));

    it('sets page title with paramsInheritanceStrategy=always with `null`', fakeAsync(() => {
         router.paramsInheritanceStrategy = 'always';
         router.resetConfig([
           {
             path: 'home',
             title: 'My Application',
             children: [
               {
                 path: '',
                 // `null` prevents inheriting from parent if it doesn't have its own value.
                 // The effect is still that the title is the parent value because of how the
                 // traversal works in PageTitleStrategy
                 title: null,
                 component: BlankCmp,
               },
             ],
           },
         ]);
         router.navigateByUrl('home');
         tick();
         expect(document.title).toBe('My Application');
       }));
  });

  describe('custom strategies', () => {
    it('overriding the setTitle method', fakeAsync(() => {
         @Injectable({providedIn: 'root'})
         class TemplatePageTitleStrategy extends TitleStrategy {
           constructor(@Inject(DOCUMENT) private readonly document: Document) {
             super();
           }

           // Example of how setTitle could implement a template for the title
           override updateTitle(state: RouterStateSnapshot) {
             const title = this.buildTitle(state);
             this.document.title = `My Application | ${title}`;
           }
         }

         TestBed.configureTestingModule({
           imports: [
             RouterTestingModule,
             TestModule,
           ],
           providers: [{provide: TitleStrategy, useClass: TemplatePageTitleStrategy}]
         });
         const router = TestBed.inject(Router);
         const document = TestBed.inject(DOCUMENT);
         router.resetConfig([
           {
             path: 'home',
             title: 'Home',
             children: [
               {path: '', title: 'Child', component: BlankCmp},
             ],
           },
         ]);

         router.navigateByUrl('home');
         tick();
         expect(document.title).toEqual('My Application | Child');
       }));
  });
});

@Component({template: ''})
export class BlankCmp {
}

@Component({
  template: `
<router-outlet></router-outlet>
<router-outlet name="aux"></router-outlet>
`
})
export class RootCmp {
}

@NgModule({
  declarations: [BlankCmp],
  imports: [RouterModule],
})
export class TestModule {
}


@Injectable({providedIn: 'root'})
export class TitleResolver {
  resolve() {
    return 'resolved title';
  }
}
