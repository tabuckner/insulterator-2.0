import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  public activePost: Post;
  public isLoading = false;
  private mode = 'create';
  private activePostId: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.activePostId = paramMap.get('id');
        // Start
        this.isLoading = true;
        this.postsService.getPost(this.activePostId).subscribe(postData => {
          // End
          this.isLoading = false;
          this.activePost = { id: postData._id, title: postData.title, content: postData.content };
        });
      } else {
        this.mode = 'create';
        this.activePostId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
      form.resetForm();
    } else if (this.mode === 'edit') {
      this.postsService.updatePost(this.activePost.id, form.value.title, form.value.content);
    }
  }
}
