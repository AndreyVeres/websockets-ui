import { Model } from '../abstract/model';

export const extractData = (instances: Model[] | Model) => {
  if (Array.isArray(instances)) {
    return instances.map((instance) => instance.data);
  }

  return instances.data;
};
