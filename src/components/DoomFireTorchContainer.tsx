import { useRef } from "react";
import { DoomFireTorch } from "react-halloween";
import { useResizeObserver } from "usehooks-ts";

interface DoomFireTorchContainerProps {
  colors: string[];
  flammable: Set<string>;
  fireEnabled?: boolean;
}

export const DoomFireTorchContainer = ({
  colors,
  flammable,
  fireEnabled = true,
}: DoomFireTorchContainerProps) => {
  const ref = useRef<HTMLElement>(null);

  const { width = 0, height = 0 } = useResizeObserver({
    // @ts-expect-error issue with hook
    ref,
    box: "border-box",
  });

  return (
    <div
      // @ts-expect-error issue with hook
      ref={ref}
      style={{
        position: "fixed",
        containerType: "size",
        bottom: "0",
        left: "0",
        right: "0",
        top: "0",
        zIndex: 1,
      }}
    >
      {height > 0 && width > 0 && (
        <DoomFireTorch
          fireEnabled={fireEnabled}
          fireColors={colors}
          pixelSize={4}
          height={height}
          width={width}
          flammable={flammable}
          fireDecay={7}
        />
      )}
    </div>
  );
};
