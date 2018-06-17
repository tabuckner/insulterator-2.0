import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], totalPosts: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snacks: MatSnackBar) { }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts(pageSize: string | number, page: string | number) {
    const queryParams = `?pagesize=${pageSize}&page=${page}`;
    this.http
      .get<{ message: string, posts: any, totalPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          totalPosts: postData.totalPosts
        };
      }))
      .subscribe((transPostData) => {
        console.log(transPostData);
        this.posts = transPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          totalPosts: transPostData.totalPosts
        });
      });
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // Backend Expected Property; Title = filename
    this.http
      .post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
        this.snacks.open(response.message, 'Dismiss', { duration: 1500 });
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(
      `http://localhost:3000/api/posts/${id}`
    ); // DONT SUBSCRIBE HERE>
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof (image) === 'object') {
      // Form Data
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title); // Backend Expected Property; Title = filename
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.patch<{ message: string }>(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe((response) => {
        this.snacks.open(response.message, 'Dismiss', { duration: 1500 });
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) { // FIXME: Add Spinner
    return this.http.delete<{ message: string }>(`http://localhost:3000/api/posts/${id}`);
  }
}
