import {Properties as CarouselProperties, Image} from './interfaces';

export interface Cell {
    index: number,
    positionX: number,
    img: {
        image: Image,
        imageIndex: number
    }
}

export class ImageUtils {
    cellStack: Cell[] = [];
    element:any;

    constructor(element: HTMLElement | undefined) {
        this.element = element;
    }

    getImages() {
        return this.cellStack.filter(this.filter);
    }

    filter(cell: Cell) {
        return cell.img !== undefined;
    }
}

export class Cells {
    cells: HTMLCollection | undefined;
    element!: HTMLElement;
    visibleWidth: number | undefined;
    counter: number = 0;
    imageUtils;

    get cellLength() {
        return this.cells ? this.cells.length : 0;
    }

    get fullCellWidth() {
        return this.carouselProperties.cellWidth + this.carouselProperties.margin;
    }

    get cellLengthInLightDOMMode() {
        return this.cellLength;
    }

    get numberOfVisibleCells() {
        return this.utils.numberOfVisibleCells;
    }

    get overflowCellsLimit() {
        return this.utils.overflowCellsLimit;
    }

    constructor(
        private carouselProperties: CarouselProperties,
        private utils: any) {

        this.imageUtils = new ImageUtils(this.element);
        this.init(carouselProperties);
    }

    updateProperties(carouselProperties: CarouselProperties) {
        this.carouselProperties = carouselProperties;
    }

    lineUp() {
        const cells = this.element ? this.element.children : [];
        this.imageUtils.cellStack = [];

        for (var i = 0; i < cells.length; i++) {
            let cell = cells[i];
            let positionX = this.getCellPositionInContainer(i);
            (cell as HTMLElement).style.transform = 'translateX(' + positionX + 'px)';
            (cell as HTMLElement).style.width = this.carouselProperties.cellWidth + 'px';
        }
    }

    ifSequenceOfCellsIsChanged() {
        const cells:any = this.element.children;
        return cells[0]['style'].transform !== 'translateX(0px)';
    }

    getCellPositionInContainer(cellIndexInDOMTree: number) {
        return cellIndexInDOMTree * this.fullCellWidth;
    }

    setCounter(value: number) {
        this.counter = value;
    }

    init(carouselProperties: CarouselProperties) {
        this.element = this.carouselProperties.cellsElement;
        this.cells = this.element.children;
        this.visibleWidth = this.carouselProperties.visibleWidth || this.element!.parentElement!.clientWidth;
    }
}
