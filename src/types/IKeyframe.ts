export interface IKeyframe {
  [step: string]: {
    [property: string]:
      | string
      | number
      | Array<string | number>;
  };
}
