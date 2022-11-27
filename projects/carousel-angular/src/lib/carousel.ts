import {Properties} from './interfaces';

export class Carousel {
    cellsElement: HTMLElement | undefined;

    /* The slide length has been limited by the limitSlideLength() method */
    isSlideLengthLimited: boolean = false;

    isContentImages: boolean = true;
    visibleWidth!: number;
    isLazyLoad: boolean = true;
    isContainerLocked: boolean = true;
    alignCells: "left" | "center" = "left";
    initialContainerPosition: number = 0;
    autoplayId: any = null;
    containerPullLimit = 100;

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
        private slide: any) {

        this.init();
    }

    updateProperties(properties: Properties) {
        this.properties = properties;
    }

    init() {
        this.cellsElement = this.properties.cellsElement;
        this.visibleWidth = this.properties.visibleWidth || this.cellsElement!.parentElement!.clientWidth;
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
    }

    handleHorizontalSwipe = (event: any) => {
        this.container.handleHorizontalSwipe();
    }

    handleTouchend = (event: any) => {
        if (this.properties.freeScroll) {
            this.container.handleTouchend();
        } else {
            this.container.handleTouchend(true);
            this.slide.handleTouchend(event);
        }
    }

    handleTransitionend() {
        this.slide.handleTransitionend();
    }

    getImage(index:number) {
        return this.cells.getImage(index);
    }

    next(length: number = 1) {
        if (!this.isNextArrowDisabled()) {
            this.slide.next(length);
        }
    }

    prev(length: number = 1) {
        this.slide.prev(length);
    }

    isNextArrowDisabled = () => {
        return this.slide.isNextArrowDisabled();
    }

    isPrevArrowDisabled = () => {
        return this.slide.isPrevArrowDisabled();
    }

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
