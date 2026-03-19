import { useState, useEffect } from "react";
import type { RefObject } from "react";

export type GridLayoutDefinition = {
  name: string;
  columns: number;
  rows: number;
  minTiles: number;
  maxTiles: number;
  minWidth: number;
  minHeight: number;
};

export type VideoSize = {
  width: number;
  height: number;
};

export const GRID_LAYOUTS: GridLayoutDefinition[] = [
  {
    columns: 1,
    rows: 1,
    name: "1x1",
    minTiles: 1,
    maxTiles: 1,
    minWidth: 0,
    minHeight: 0,
  },
  {
    columns: 1,
    rows: 2,
    name: "1x2",
    minTiles: 2,
    maxTiles: 2,
    minWidth: 900,
    minHeight: 0,
  },
  {
    columns: 2,
    rows: 1,
    name: "2x1",
    minTiles: 2,
    maxTiles: 2,
    minWidth: 900,
    minHeight: 0,
  },
  {
    columns: 2,
    rows: 2,
    name: "2x2",
    minTiles: 3,
    maxTiles: 4,
    minWidth: 560,
    minHeight: 0,
  },
  {
    columns: 3,
    rows: 3,
    name: "3x3",
    minTiles: 5,
    maxTiles: 9,
    minWidth: 700,
    minHeight: 0,
  },
  {
    columns: 4,
    rows: 4,
    name: "4x4",
    minTiles: 10,
    maxTiles: 16,
    minWidth: 960,
    minHeight: 0,
  },
  {
    columns: 5,
    rows: 5,
    name: "5x5",
    minTiles: 17,
    maxTiles: 25,
    minWidth: 1100,
    minHeight: 0,
  },
];

function selectGridLayout(
  layouts: GridLayoutDefinition[],
  tileCount: number,
  width: number,
  height: number,
): GridLayoutDefinition {
  let currentLayoutIndex = 0;
  let layout = layouts.find((layout_, index, allLayouts) => {
    currentLayoutIndex = index;
    const isBiggerLayoutAvailable =
      allLayouts.findIndex(
        (l, i) => i > index && l.maxTiles === layout_.maxTiles,
      ) !== -1;
    return layout_.maxTiles >= tileCount && !isBiggerLayoutAvailable;
  });

  if (!layout) {
    layout = layouts[layouts.length - 1];
    console.warn(
      `No layout found for: tileCount: ${tileCount}. Fallback to biggest layout (${layout?.name}).`,
    );
  }

  if (layout && (width < layout.minWidth || height < layout.minHeight)) {
    if (currentLayoutIndex > 0) {
      const smallerLayout = layouts[currentLayoutIndex - 1];
      layout = selectGridLayout(
        layouts.slice(0, currentLayoutIndex),
        smallerLayout.maxTiles,
        width,
        height,
      );
    }
  }

  return layout || layouts[0];
}

function calculateVideoSize(
  containerWidth: number,
  containerHeight: number,
  cols: number,
  rows: number,
  participantCount: number,
): VideoSize {
  let baseWidth = Math.floor(containerWidth / cols);
  let baseHeight = Math.floor(containerHeight / rows);

  const aspectRatio = 16 / 9;

  if (baseWidth / baseHeight > aspectRatio) {
    baseWidth = baseHeight * aspectRatio;
  } else {
    baseHeight = baseWidth / aspectRatio;
  }

  let maxWidth, maxHeight;

  if (participantCount === 1) {
    maxWidth = 1080;
    maxHeight = 650;
  } else if (participantCount === 2) {
    maxWidth = 700;
    maxHeight = 481;
  } else if (participantCount <= 4) {
    maxWidth = 450;
    maxHeight = 253;
  } else {
    maxWidth = 450;
    maxHeight = 425;
  }

  return {
    width: Math.min(baseWidth, maxWidth),
    height: Math.min(baseHeight, maxHeight),
  };
}

export function useGridLayout(
  gridRef: RefObject<HTMLDivElement | null>,
  participantCount: number,
): {
  layout: GridLayoutDefinition;
  videoSize: VideoSize;
} {
  const [layout, setLayout] = useState<GridLayoutDefinition>(GRID_LAYOUTS[0]);
  const [videoSize, setVideoSize] = useState<VideoSize>({
    width: 400,
    height: 225,
  });

  useEffect(() => {
    const updateLayout = () => {
      if (gridRef.current) {
        const { width, height } = gridRef.current.getBoundingClientRect();
        const newLayout = selectGridLayout(
          GRID_LAYOUTS,
          participantCount,
          width,
          height,
        );
        setLayout(newLayout);

        const newVideoSize = calculateVideoSize(
          width,
          height,
          newLayout.columns,
          newLayout.rows,
          participantCount,
        );
        setVideoSize(newVideoSize);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [gridRef, participantCount]);

  return { layout, videoSize };
}
