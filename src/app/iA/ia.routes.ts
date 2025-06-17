import { Routes } from '@angular/router';
import { UserComponent } from './forms/users/user/user.component';
import { ChangepasswordComponent } from './forms/users/change-password/change-password.component';
import { UploadFileProdComponent } from './forms/upload-file-prod/upload-file-prod.component';


export const IaRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'upload-file-prod',
        component: UploadFileProdComponent,
        data: {
          title: 'Product Management',
          urls: [
            { title: 'Home', url: '/dashboards/dashboard1' },
            { title: 'Home' },
          ],
        },
      },
      /*
      {
        path: 'users/edituser',
        component: UserComponent,
        data: {
          title: 'Editar Usuario',
          urls: [
            { title: 'iA/Users', url: '/ia/users' },
            { title: 'Editar Usuario' },
          ],
        },
      },
      {
        path: 'users/newuser',//'newuser/:id',
        component: UserComponent,
        data: {
          title: 'Nuevo Usuario',
          urls: [
            { title: 'iA/Users', url: '/ia/users' },
            { title: 'Nuevo Usuario' },
          ],
        },
      },
      {
        path: 'change-password',
        component: ChangepasswordComponent,
        data: {
          title: 'Cambiar contraseña',
          urls: [
            { title: 'iA/change-password', url: '/dashboards/dashboard1' },
            { title: 'Change Password' },
          ],
        },
      },
      */
    ],
  },
];
