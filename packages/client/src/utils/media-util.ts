import { Blob, File, NFTStorage } from 'nft.storage';
import { GenericObject, IPFSResponse, MediaItem } from '@/core/types';
import { fileTypeFromBuffer } from 'file-type';
import convert from 'heic-convert';

const NEXT_PUBLIC_NFT_STORAGE_API_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;
const unsupportedMimeTypes: string[] = [
  'image/heic',
  'image/heic-sequence',
  'image/heif',
  'image/heif-sequence'
];

const processIPFSRequest = async (media: MediaItem[]): Promise<IPFSResponse> => {
  console.log(`Media files:`, { media, nft: NEXT_PUBLIC_NFT_STORAGE_API_KEY });
  if (media.length === 0 || !NEXT_PUBLIC_NFT_STORAGE_API_KEY) {
    console.error('Media files is empty or NFT_STORAGE_API_KEY is not set in .env');
    throw new Error('Missing media file for IPFS push');
  }

  const client = new NFTStorage({ token: NEXT_PUBLIC_NFT_STORAGE_API_KEY });

  const imageMap: GenericObject = {};
  const extensionMap: GenericObject = {};

  const promises: Promise<File>[] = media.map(
    async (mediaFile: MediaItem): Promise<File> => {
      const { hex, file }: MediaItem = mediaFile;
      let fileContent: ArrayBuffer = file;
      const fileTypeResult = await fileTypeFromBuffer(fileContent);

      if (!fileTypeResult) {
        console.error(`File type not supported: ${fileTypeResult}`);
        throw new Error('File type not supported');
      }

      const { mime, ext } = fileTypeResult;
      let mimeType = mime;
      let extension = ext;
      if (unsupportedMimeTypes.includes(mime)) {
        console.warn(
          `File mime type is not supported: ${mimeType}, extension: ${extension}, now converting to jpeg`
        );
        fileContent = await convert({
          buffer: fileContent,
          format: 'PNG'
        });
        mimeType = 'image/png';
        extension = 'png';
      }

      extensionMap[hex] = extension;
      const finalFilePath = `${hex}.${extension}`;
      console.log(`Final file to pushed to ipfs: ${finalFilePath}`);
      const content: File = new File(
        [new Blob([fileContent])],
        finalFilePath,
        {
          type: mimeType
        }
      );

      const store = await client.storeBlob(content);
      const blobUrl = `ipfs://${store}`;

      console.log(`Stored blob on IPFS URL: ${blobUrl}`);

      const finalMediaItem: Partial<MediaItem> = { ...mediaFile, ipfs: blobUrl };
      delete finalMediaItem.file;

      imageMap[hex] = blobUrl;

      return new File(
        [JSON.stringify(finalMediaItem, null, 2)],
        `${hex}.json`,
        {
          type: 'application/json'
        }
      );
    }
  );

  const files: File[] = await Promise.all(promises);
  const cid = await client.storeDirectory(files);
  console.log(
    `Uploaded NFT.Storage CID before: ${JSON.stringify(
      cid
    )}, imageMap: ${JSON.stringify(imageMap)}`
  );

  media.forEach((item) => {
    const { hex } = item;
    if (!imageMap[hex]) {
      const link = `ipfs://${cid}/${hex}.${extensionMap[hex]}`;
      console.log(`IPFS Links: ${link}`);
      imageMap[hex] = link;
    }
  });

  return { cid, imageMap };
};

export { processIPFSRequest };
