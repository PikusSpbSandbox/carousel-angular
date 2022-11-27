import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import { Properties as CarouselProperties } from './interfaces';
import { Touches } from './touches';
import { Carousel } from './carousel';
import { Container } from './container';
import { Cells } from './cells';
import { Slide } from './slide';
import { Utils } from './utils';

@Component({
  selector: 'carousel, [carousel]',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.sass']
})
export class CarouselComponent implements OnDestroy {
  carousel: any;

  container: any;

  utils: any;

  cells: any;

  slide: any;

  touches: any;

  landscapeMode: any;

  _isCounter = false;

  _cellWidth: number | '100%' = 200;

  isMoving = false;

  isNgContent = false;

  cellLength!: number;

  dotsArr: any;

  carouselProperties!: CarouselProperties;

  savedCarouselWidth!: number;

  get slideCounter() {
    if (this.carousel) {
      return this.carousel.slideCounter;
    }
  }

  get lapCounter() {
    if (this.carousel) {
      return this.carousel.lapCounter;
    }
  }

  get isLandscape() {
    return window.innerWidth > window.innerHeight;
  }

  get isSafari(): any {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1) {
      return !(ua.indexOf('chrome') > -1);
    }
  }

  get counter() {
    const counter = this.slideCounter;
    return counter + 1 + this.counterSeparator + this.cellLength;
  }

  get cellsElement() {
    return this.elementRef.nativeElement.querySelector('.carousel-cells');
  }

  get isArrows() {
    return this.arrows && !this.freeScroll;
  }

  get isCounter() {
    return this._isCounter && this.cellLength > 1;
  }

  get activeDotIndex() {
    return this.slideCounter % this.cellLength;
  }

  get cellLimit() {
    if (this.carousel) {
      return this.carousel.cellLimit;
    }
  }

  get carouselWidth() {
    return this.elementRef.nativeElement.clientWidth;
  }

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  @Input() id!: number;

  @Input() height = 450;

  @Input() width!: number;

  @Input() autoplay = true;

  @Input() autoplayInterval = 5000;

  @Input() pauseOnHover = true;

  @Input() dots = false;

  @Input() borderRadius!: number;

  @Input() margin = 10;

  @Input() objectFit: 'contain' | 'cover' | 'none' = 'cover';

  @Input() minSwipeDistance = 10;

  @Input() transitionDuration = 200;

  @Input() transitionTimingFunction:
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'linear' = 'ease-out';

  @Input() videoProperties: any;

  @Input() counterSeparator = ' / ';

  @Input() overflowCellsLimit = 3;

  @Input() listeners: 'auto' | 'mouse and touch' = 'mouse and touch';

  @Input() cellsToShow = 1;

  @Input() cellsToScroll = 1;

  @Input() freeScroll = false;

  @Input() arrows = true;

  @Input() arrowsOutside = false;

  @Input() arrowsTheme: 'light' | 'dark' = 'light';

  @Input('cellWidth') set cellWidth(value: number | '100%') {
    if (value) {
      this._cellWidth = value;
    }
  }

  @Input('counter') set isCounter(value: boolean) {
    if (value) {
      this._isCounter = value;
    }
  }

  @HostBinding('class.carousel') hostClassCarousel = true;

  @HostBinding('style.height') hostStyleHeight!: string;

  @HostBinding('style.width') hostStyleWidth!: string;

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    if (this.utils.visibleWidth !== this.savedCarouselWidth) {
      this.resize();
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter() {
    if (this.autoplay && this.pauseOnHover) {
      this.carouselProperties.autoplayIsPossible = false;
      this.carousel.stopAutoplay();
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave() {
    if (this.autoplay && this.pauseOnHover) {
      this.carouselProperties.autoplayIsPossible = true;
      this.carousel.autoplay();
    }
  }

  @HostListener('dragstart', ['$event'])
  onDragStart() {
    return false;
  }

  constructor(private elementRef: ElementRef, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.isNgContent = this.cellsElement.children.length > 0;

    this.touches = new Touches({
      element: this.cellsElement,
      listeners: this.listeners,
      mouseListeners: {
        mousedown: 'handleMousedown',
        mouseup: 'handleMouseup'
      }
    });

    this.touches.on('touchstart', this.handleTouchstart);
    this.touches.on('horizontal-swipe', this.handleHorizontalSwipe);
    this.touches.on('touchend', this.handleTouchend);
    this.touches.on('mousedown', this.handleTouchstart);
    this.touches.on('mouseup', this.handleTouchend);
    this.touches.on('tap', this.handleTap);

    this.setDimensions();
  }

  ngAfterViewInit() {
    this.initCarousel();
    this.cellLength = this.getCellLength();
    this.dotsArr = Array(this.cellLength).fill(1);
    this.ref.detectChanges();
    this.carousel.lineUpCells();
    this.savedCarouselWidth = this.carouselWidth;

    /* Start detecting changes in the DOM tree */
    this.detectDomChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
        const isFirstChange = Object.values(changes).some(change => change.isFirstChange());
    if (!isFirstChange && (changes.width || changes.height)) {
      this.setDimensions();
      this.initCarousel();
      this.carousel.lineUpCells();
      this.ref.detectChanges();
    }
  }

  ngOnDestroy() {
    this.touches.destroy();
    // this.carousel.destroy();
  }

  initCarousel() {
    this.carouselProperties = {
      id: this.id,
      cellsElement:
        this.elementRef.nativeElement.querySelector('.carousel-cells'),
      hostElement: this.elementRef.nativeElement,
      cellWidth: this.getCellWidth(),
      autoplayInterval: this.autoplayInterval,
      autoplayIsPossible: true,
      overflowCellsLimit: this.overflowCellsLimit,
      visibleWidth: this.width,
      margin: this.margin,
      minSwipeDistance: this.minSwipeDistance,
      transitionDuration: this.transitionDuration,
      transitionTimingFunction: this.transitionTimingFunction,
      videoProperties: this.videoProperties,
      eventHandler: this.events,
      freeScroll: this.freeScroll
    };

    this.utils = new Utils(this.carouselProperties);
    this.cells = new Cells(this.carouselProperties, this.utils);
    this.container = new Container(
      this.carouselProperties,
      this.utils,
      this.cells
    );
    this.slide = new Slide(
      this.carouselProperties,
      this.utils,
      this.cells,
      this.container
    );

    if (this.autoplay && this.carousel) {
      this.carousel.stopAutoplay();
    }
    this.carousel = new Carousel(
      this.carouselProperties,
      this.utils,
      this.cells,
      this.container,
      this.slide
    );

    if (this.autoplay) {
      this.carousel.autoplay();
    }
  }

  resize() {
    this.landscapeMode = this.isLandscape;
    this.savedCarouselWidth = this.carouselWidth;

    this.carouselProperties.cellWidth = this.getCellWidth();
    this.cells.updateProperties(this.carouselProperties);
    this.carousel.updateProperties(this.carouselProperties);
    this.container.updateProperties(this.carouselProperties);
    this.slide.updateProperties(this.carouselProperties);
    this.utils.updateProperties(this.carouselProperties);
    this.carousel.lineUpCells();
    this.slide.select(0);
    this.ref.detectChanges();
  }

  detectDomChanges() {
    const observer = new MutationObserver((mutations) => {
      this.onDomChanges();
    });

    const config = {
      attributes: true,
      childList: true,
      characterData: true
    };
    observer.observe(this.cellsElement, config);
  }

  onDomChanges() {
    this.cellLength = this.getCellLength();
    this.carousel.lineUpCells();
    this.ref.detectChanges();
  }

  setDimensions() {
    this.hostStyleHeight = `${this.height}px`;
    this.hostStyleWidth = `${this.width}px`;
  }

  handleTouchstart = (event: any) => {
    this.touches.addEventListeners('mousemove', 'handleMousemove');
    this.carousel.handleTouchstart(event);
    this.isMoving = true;
  };

  handleHorizontalSwipe = (event: any) => {
    event.preventDefault();
    this.carousel.handleHorizontalSwipe(event);
  };

  handleTouchend = (event: any) => {
    const { touches } = event;
    this.carousel.handleTouchend(event);
    this.touches.removeEventListeners('mousemove', 'handleMousemove');
    this.isMoving = false;
  };

  handleTap = (event: any) => {
    const outboundEvent: any = {
      name: 'click'
    };
    const nodes = Array.prototype.slice.call(this.cellsElement.children);
    const cellElement = event.srcElement.closest('.carousel-cell');
    const i = nodes.indexOf(cellElement);
    const cellIndex = nodes.indexOf(cellElement);

    outboundEvent.cellIndex = cellIndex;
  };

  handleTransitionendCellContainer(event: any) {
    if (event.target.className === 'carousel-cells') {
      this.carousel.handleTransitionend();
    }
  }

  getCellWidth() {
    const elementWidth = this.carouselWidth;

    if (this.cellsToShow) {
      const margin = this.cellsToShow > 1 ? this.margin : 0;
      const totalMargin = margin * (this.cellsToShow - 1);
      return (elementWidth - totalMargin) / this.cellsToShow;
    }

    if (this._cellWidth === '100%') {
      return elementWidth;
    }
    return this._cellWidth;
  }

  next() {
    this.carousel.next(this.cellsToScroll);
    this.carousel.stopAutoplay();
  }

  prev() {
    this.carousel.prev(this.cellsToScroll);
    this.carousel.stopAutoplay();
  }

  isNextArrowDisabled() {
    if (this.carousel) {
      return this.carousel.isNextArrowDisabled();
    }
  }

  isPrevArrowDisabled() {
    if (this.carousel) {
      return this.carousel.isPrevArrowDisabled();
    }
  }

  getCellLength() {
    return this.cellsElement.children.length;
  }
}
