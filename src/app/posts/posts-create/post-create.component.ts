import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';
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
  public form: FormGroup;
  public imagePreview: string;
  private mode = 'create';
  private activePostId: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      // tslint:disable-next-line:max-line-length
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }), // TODO: Remove required validator.
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.activePostId = paramMap.get('id');
        this.isLoading = true;
        this.postsService.getPost(this.activePostId).subscribe(postData => {
          this.isLoading = false;
          this.activePost = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            'title': this.activePost.title,
            'content': this.activePost.content,
            'image': this.activePost.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.activePostId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ 'image': file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader(); // Provided by JS
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
      this.form.reset();
    } else if (this.mode === 'edit') {
      this.postsService.updatePost(
        this.activePost.id,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
  }
}
