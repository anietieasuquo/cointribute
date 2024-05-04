import { MediaType } from '@/core/domain/MediaType';
import { Buffer } from 'buffer';

export type Nullable<T> = T | null | undefined;
export type GenericObject = { [key: string]: any };

export type KeyValue<K extends string | number | symbol, V> = {
  [key in K]?: V;
};

export interface MediaItem {
  hex: string;
  file: Buffer;
  type: MediaType;
  campaignName: string;
  creator: string;
  ipfs?: string;
  cid?: string;
}

export interface IPFSResponse {
  readonly imageMap: GenericObject;
  readonly cid: string;
}
