import { bench, describe } from 'vitest';
import diffler from '../index';
import { metadataV2 } from './data/json-metadata-v2';
import { metadataV3 } from './data/json-metadata-v3';

describe('diffler', () => {
  bench('nested metadata comparison', () => {
    diffler(metadataV2, metadataV3);
  });

  bench('identical objects', () => {
    diffler(metadataV2, metadataV2);
  });

  bench('empty objects', () => {
    diffler({}, {});
  });
});
