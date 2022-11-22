# Simple Angular carousel component

### Demo
Live [demo](https://pikus.spb.ru/code).

### About
This is a fork version of [ivylaboratory/angular-carousel](https://github.com/ivylaboratory/angular-carousel) with some changed styles and 
defaults both with some minor bugfixes.

## Installation
Install the npm package.
```
  npm i carousel-angular
```
Import module:
```ts
  import {IvyCarouselModule} from 'carousel-angular';

  @NgModule({
      imports: [IvyCarouselModule]
  })
```

## Usage
Put the contents of your cells in containers with the `carousel-cell` class.

```html
<carousel>
    <div class="carousel-cell">
        <img src="path_to_image"> <!-- Or any other HTML content -->
    </div>
    <div class="carousel-cell">
        ...
</carousel>
```

### Credits
Please see `angular-carousel` author's page respectively: [drozhzhin-n-e](https://github.com/drozhzhin-n-e) 
