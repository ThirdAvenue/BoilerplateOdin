import { model } from './models';

export abstract class AbstractPartsModel {
  public abstract init(data: model): Promise<void>;
}
