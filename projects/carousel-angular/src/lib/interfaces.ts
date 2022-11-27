export interface Properties {
  id: number;
  cellsElement: HTMLElement;
  hostElement: HTMLElement;
  cellWidth: number;
  autoplayInterval: number;
  autoplayIsPossible: boolean;
  overflowCellsLimit: number;
  visibleWidth: number;
  margin: number;
  minSwipeDistance: number;
  transitionDuration: number;
  transitionTimingFunction:
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'linear';
  videoProperties: any;
  eventHandler?: any;
  freeScroll: boolean;
}
