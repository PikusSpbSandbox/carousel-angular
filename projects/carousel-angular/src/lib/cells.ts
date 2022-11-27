import { Properties as CarouselProperties } from './interfaces';

export class Cells {
  cells: HTMLCollection | undefined;

  element!: HTMLElement;

  visibleWidth: number | undefined;

  counter = 0;

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
    private utils: any
  ) {
    this.init(carouselProperties);
  }

  updateProperties(carouselProperties: CarouselProperties) {
    this.carouselProperties = carouselProperties;
  }

  lineUp() {
    const cells = this.element ? this.element.children : [];

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const positionX = this.getCellPositionInContainer(i);
      (cell as HTMLElement).style.transform = `translateX(${positionX}px)`;
      (
        cell as HTMLElement
      ).style.width = `${this.carouselProperties.cellWidth}px`;
    }
  }

  ifSequenceOfCellsIsChanged() {
    const cells: any = this.element.children;
    return cells[0].style.transform !== 'translateX(0px)';
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
    this.visibleWidth =
      this.carouselProperties.visibleWidth ||
      this.element!.parentElement!.clientWidth;
  }
}
