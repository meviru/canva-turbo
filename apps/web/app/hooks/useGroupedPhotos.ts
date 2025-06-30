import { useMemo } from "react";

export interface PhotoItem {
  id: string;
  width: number;
  height: number;
  [key: string]: any;
}

export const useGroupedPhotos = (
  photos: PhotoItem[] = [],
  maxRowRatio: number = 3,
  minPhotosPerRow: number = 2
) => {
  return useMemo(() => {
    const rows: PhotoItem[][] = [];
    let currentRow: PhotoItem[] = [];
    let ratioSum = 0;

    for (const photo of photos) {
      const ratio = photo.width / photo.height;
      currentRow.push(photo);
      ratioSum += ratio;

      if (ratioSum >= maxRowRatio && currentRow.length >= minPhotosPerRow) {
        rows.push(currentRow);
        currentRow = [];
        ratioSum = 0;
      }
    }

    if (currentRow.length > 0) {
      if (currentRow.length < minPhotosPerRow && rows.length > 0) {
        const lastRow = rows[rows.length - 1];
        if (lastRow) {
          rows[rows.length - 1] = [...lastRow, ...currentRow];
        }
      } else {
        rows.push(currentRow);
      }
    }

    return rows;
  }, [photos, maxRowRatio, minPhotosPerRow]);
};
