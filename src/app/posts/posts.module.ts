import { NgModule } from '@angular/core';
import { PostCreateComponent } from './posts-create/post-create.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PostsListComponent } from './posts-list/posts-list.component';

@NgModule({
  declarations: [
    PostCreateComponent,
    PostsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PostCreateComponent,
    PostsListComponent
  ]
})
export class PostsModule { }
