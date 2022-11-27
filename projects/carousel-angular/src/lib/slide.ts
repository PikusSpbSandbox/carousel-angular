import {Properties as CarouselProperties} from './interfaces';

export interface Properties {
    carouselProperties: CarouselProperties;
}

export class Slide {
    slideLength: number = 0;
    isSlideInProgress: boolean = false;
    direction: 'left' | 'right' | undefined;
    counter: number = 0;
    _counter: number = 0;
    distance: number = 0;
    distanceAbs: number = 0;
    visibleWidth!: number;
    isNotClickOnArrow: boolean = false;
    initialPositionX: number = 0;
    currentPositionX: number = 0;

    /* The slide length has been limited by the limitSlideLength() method */
    isSlideLengthLimited: boolean = false;

    get fullCellWidth() {
        return this.carouselProperties.cellWidth + this.carouselProperties.margin;
    }

    get margin() {
        return this.carouselProperties.margin;
    }

    get minSwipeDistance() {
        return this.carouselProperties.minSwipeDistance;
    }

    get numberOfVisibleCells() {
        return this.utils.numberOfVisibleCells;
    }

    get visibleCellsOverflowContainer() {
        return this.utils.visibleCellsOverflowContainer;
    }

    /* The position to which the container returns after each slide
     * in the light DUM tree mode.
     */
    get fixedContainerPosition() {
        return -(this.overflowCellsLimit * this.fullCellWidth);
    }

    get overflowCellsLimit() {
        return this.utils.overflowCellsLimit;
    }

    /* Number of cell elements in the DUM tree */
    get cellLength() {
        return this.cells.cellLength;
    }

    constructor(private carouselProperties: CarouselProperties,
        private utils: any,
        private cells: any,
        private container: any) {

        this.init();
    }

    updateProperties(carouselProperties: CarouselProperties) {
        this.carouselProperties = carouselProperties;
        this.setVisibleWidth();
    }

    init() {
        this.visibleWidth = this.carouselProperties.visibleWidth || this.carouselProperties.hostElement.clientWidth;
    }

    handleTouchstart() {
        /* Touchstart event is not called for arrow */
        this.isNotClickOnArrow = true;
        this.isSlideLengthLimited = false;

        if (!this.isSlideInProgress) {
            this.initialPositionX = this.container.getCurrentPositionX();
        }
    }

    handleTouchend() {
        if (!this.isNotClickOnArrow) {
            return;
        }
        this.currentPositionX = this.container.getCurrentPositionX();
        this.distanceAbs = Math.abs(this.initialPositionX - this.currentPositionX);
        this.distance = this.initialPositionX - this.currentPositionX;
        this.direction = this.getDirection();
        this.isNotClickOnArrow = false;
        this.handleSlide();
    }

    handleTransitionend() {
        this.setCounter();
        this.isSlideInProgress = false;
    }

    handleSlide(customSlideLength: number | undefined = undefined) {
        let isUsingButton = customSlideLength;
        let newPositionX;

        if (isUsingButton && this.isSlideInProgress || !this.direction) {
            return;
        }

        /* Custom slide length is used in arrows */
        if (customSlideLength) {
            this.slideLength = this.limitSlideLength(customSlideLength);

            if (!this.isSlideInProgress) {
                this.initialPositionX = this.container.getCurrentPositionX();
            }
        } else {
            this.slideLength = this.getSlideLength(this.distanceAbs);
        }

        /* Store intermediate counter value */
        this._counter = this.getPreliminaryCounter();

        if (this.direction === 'left') {
            if (!customSlideLength) {
                this.slideLength = this.limitSlideLength(this.getSlideLength(this.distanceAbs));
            }

            this._counter = this.getPreliminaryCounter();
            let isSlidesEnd = this.isSlidesEnd(this._counter);
            newPositionX = this.getPositionByIndex(this._counter);

            if (isSlidesEnd) {
                this._counter = this.counter;

                newPositionX = this.getPositionByIndex(this.counter);
                this.slideLength = 0;
            }
        }

        if (this.direction === 'right') {
            if (!customSlideLength) {
                this.slideLength = this.getSlideLength(this.distanceAbs);
            }

            if (this._counter < 0) {
                this._counter = this.counter;
                this.slideLength = this.counter;
            }

            newPositionX = this.getPositionByIndex(this.counter - this.slideLength);
        }

        if (this.container.getCurrentPositionX() !== newPositionX) {
            this.isSlideInProgress = true;
            this.container.transformPositionX(newPositionX);
        }
    }

    next(length: number = 1) {
        this.direction = 'left';
        this.handleSlide(length);
    }

    prev(length: number = 1) {
        this.direction = 'right';
        this.handleSlide(length);
    }

    select(index: number) {
        if (index > this.cellLength - 1) {
            return;
        }

        if (index > this.counter) {
            let length = index - this.counter;
            this.next(length);
        }

        if (index < this.counter) {
            let length = this.counter - index;
            this.prev(length);
        }
    }

    getPreliminaryCounter() {
        if (this.direction === 'left') {
            return this.counter + this.slideLength;
        }

        if (this.direction === 'right') {
            return this.counter - this.slideLength;
        }

        return 0;
    }

    /*
     * Limits the length of the slide during calls to the next() and prev()
     * methods if the specified position is outside the cell length
     */
    limitSlideLength(slideLength: number) {
        if (slideLength > 1) {
            for (var i = 0; i < slideLength; i++) {
                let newCounter = this.counter + (slideLength - i);

                if (!this.isSlidesEnd(newCounter)) {
                    slideLength = slideLength - i;
                    this.isSlideLengthLimited = i > 0;
                    break;
                }
            }
        }
        return slideLength;
    }

    /* Offset the container to show the last cell completely */
    getPositionCorrection(counter:number) {
        let correction = 0;
        let isLastSlide = this.isLastSlide(counter);

        if (this.isSlideLengthLimited || isLastSlide) {
            let cellsWidth = this.cells.cellLengthInLightDOMMode * this.fullCellWidth;

            if (this.visibleWidth < cellsWidth) {
                correction = -(this.numberOfVisibleCells * this.fullCellWidth - this.visibleWidth - this.margin);
            }

            if (correction >= -this.margin) {
                correction = 0;
            }
        }

        return correction;
    }

    getSlideLength(distanceAbs: number) {
        let length = Math.floor(distanceAbs / this.fullCellWidth);

        if (distanceAbs % this.fullCellWidth >= this.minSwipeDistance) {
            length++;
        }

        return length;
    }

    getDistanceAbs() {
        return Math.abs(this.initialPositionX - this.currentPositionX);
    }

    getDirection() {
        const direction = Math.sign(this.initialPositionX - this.currentPositionX);

        if (direction === -1) {
            return 'right';
        }
        if (direction === 1) {
            return 'left';
        }

        return undefined;
    }

    isSlidesEnd(counter: number) {
        let margin = this.visibleCellsOverflowContainer ? 1 : 0;
        let imageLength = this.cells.cellLength;

        return (imageLength - counter + margin) < this.numberOfVisibleCells;
    }

    isLastSlide(counter: number) {
        return this.isSlidesEnd(counter + 1)
    }

    setCounter() {
        if (this.direction === 'left') {
            this.counter = this.counter + this.slideLength;
        }

        if (this.direction === 'right') {
            this.counter = this.counter - this.slideLength;
        }
    }

    getPositionByIndex(_counter: number) {
        let correction = this.getPositionCorrection(this.counter + this.slideLength);
        let position;

        if (correction !== 0) {
            correction = correction + this.fullCellWidth
        }

        if (this.direction === 'right') {
            correction = 0;
        }

        position = -((_counter * this.fullCellWidth) - correction);

        position = this.provideSafePosition(position);

        return position;
    }

    provideSafePosition(position: number) {
        const endPosition = this.container.getEndPosition();

        if (this.direction === 'left') {
            if (position > 0) {
                position = 0;
            }
        }

        if (this.direction === 'right') {
            if (position < endPosition) {
                position = endPosition;
            }
        }

        return position;
    }

    getPositionWithoutCorrection(value: number) {
        let remainder = Math.round(value) % this.fullCellWidth;

        if (remainder !== 0) {
            return value - (this.fullCellWidth + remainder);
        } else {
            return value;
        }
    }

    isNextArrowDisabled() {
        return this.isLastSlide(this.counter) ||
        (!this.visibleCellsOverflowContainer && this.cellLength <= this.numberOfVisibleCells) ||
        (this.visibleCellsOverflowContainer && this.cellLength < this.numberOfVisibleCells)
    }

    isPrevArrowDisabled() {
        return this.counter === 0;
    }

    alignContainerFast() {
      if (this.ifLeftDOMModeToBeginning(this.counter)) {
            /* If we have already exited the light DOM mode but
             * the cells are still out of place
             */
            if (this.cells.ifSequenceOfCellsIsChanged()) {
                let positionX = -(this.counter * this.fullCellWidth);
                this.container.transformPositionX(positionX, 0);

                this.cells.setCounter(this.counter);
                this.cells.lineUp();
            }
        }
    }

    ifLeftDOMModeToBeginning(counter: number) {
        let flag;

        if (counter <= this.overflowCellsLimit) {
            flag = true;
        }

        if (this.counter <= this.overflowCellsLimit) {
            flag = true;
        }

        return flag;
    }

    setVisibleWidth() {
        this.visibleWidth = this.carouselProperties.visibleWidth || this.carouselProperties.hostElement.clientWidth;
    }
}
