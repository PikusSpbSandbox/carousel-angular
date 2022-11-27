# Simple Angular carousel component
<img src="https://badgen.net/bundlephobia/min/carousel-angular" />

## Demo
Live [demo](https://pikus.spb.ru/code/carousel-angular-demo).

## About
This is a fork version of [ivylaboratory/angular-carousel](https://github.com/ivylaboratory/angular-carousel) with the following changes:
- Navigation arrows new design
- Bug fixes:
  - Fix scrolling to previous item scrolls to start only
  - Fix when drag & drop event starts on inner content (drag & drop is now blocked)
  - Fix autoplay stop when hovering carousel
- Removed 'images' and 'loop' functionality to reduce bundle size ('loop' never worked before without 'images')
- Changed default settings
- Performed .sass and .ts linting, overall code cleanup (removing unused members) and modernization
- Bundle size is reduced to 529 kB unpacked against 814 kB before
- Dependency versions upgrade to fit Angular 14

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

## Credits
Please see `angular-carousel` author's page respectively: [drozhzhin-n-e](https://github.com/drozhzhin-n-e) 
