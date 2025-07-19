import { Routes } from '@angular/router';
import { RightCardComponent } from './components/right-card/right-card.component';
import { MainComponent } from './components/main/main.component';
import { AddHelperComponent } from './components/add-helper/add-helper.component';

export const routes: Routes = [
    {
        path: 'main',
        component: MainComponent,
        children:[
            {
                path: 'helpers/:id',
                component: RightCardComponent,
            }
        ]
    },
    {
        path: 'add-helper',
        component: AddHelperComponent,
    },
    {
        path: 'add-helper/:id',
        component: AddHelperComponent,
    },
    {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
    }
];
