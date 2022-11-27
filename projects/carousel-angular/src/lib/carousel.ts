import { Properties } from './interfaces';

export class Carousel {
  cellsElement: HTMLElement | undefined;

  visibleWidth!: number;

  autoplayId: any = null;

  get cellLength() {
    return this.cells.cellLength;
  }

  get lastCellIndex() {
    return this.cells.cellLength - 1;
  }

  get overflowCellsLimit() {
    return this.utils.overflowCellsLimit;
  }

  get autoplayIsPossible() {
    return this.properties.autoplayIsPossible;
  }

  get margin() {
    return this.properties.margin;
  }

  get minSwipeDistance() {
    return this.properties.minSwipeDistance;
  }

  get transitionDuration() {
    return this.properties.transitionDuration;
  }

  get transitionTimingFunction() {
    return this.properties.transitionTimingFunction;
  }

  get fullCellWidth() {
    return this.properties.cellWidth + this.margin;
  }

  get numberOfVisibleCells() {
    return this.utils.numberOfVisibleCells;
  }

  get slideCounter() {
    return this.slide.counter;
  }

  constructor(
    private properties: Properties,
    private utils: any,
    private cells: any,
    private container: any,
    private slide: any
  ) {
    this.init();
  }

  updateProperties(properties: Properties) {
    this.properties = properties;
  }

  init() {
    this.cellsElement = this.properties.cellsElement;
    this.visibleWidth =
      this.properties.visibleWidth ||
      this.cellsElement!.parentElement!.clientWidth;
  }

  destroy() {
    clearInterval(this.autoplayId);
  }

  lineUpCells() {
    this.cells.lineUp();
  }

  handleTouchstart = (event: any) => {
    this.container.handleTouchstart();
    this.slide.handleTouchstart(event);
  };

  handleHorizontalSwipe = (event: any) => {
    this.container.handleHorizontalSwipe();
  };

  handleTouchend = (event: any) => {
    if (this.properties.freeScroll) {
      this.container.handleTouchend();
    } else {
      this.container.handleTouchend(true);
      this.slide.handleTouchend(event);
    }
  };

  handleTransitionend() {
    this.slide.handleTransitionend();
  }

  next(length = 1) {
    if (!this.isNextArrowDisabled()) {
      this.slide.next(length);
    }
  }

  prev(length = 1) {
    this.slide.prev(length);
  }

  isNextArrowDisabled = () => this.slide.isNextArrowDisabled();

  isPrevArrowDisabled = () => this.slide.isPrevArrowDisabled();

  autoplay() {
    if (this.autoplayId === null) {
      this.autoplayId = setInterval(() => {
        if (this.autoplayIsPossible) {
          this.next();
        }
      }, this.properties.autoplayInterval);
    }
  }

  stopAutoplay() {
    if (this.autoplayId != null) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }
}
