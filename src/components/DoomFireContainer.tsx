import { useRef } from "react";
import { DoomFire } from "react-halloween";
import { useResizeObserver } from "usehooks-ts";

interface DoomFireContainerProps {
  colors: string[];
}

export const DoomFireContainer = ({ colors }: DoomFireContainerProps) => {
  const ref = useRef<HTMLElement>(null);

  const { width = 0 } = useResizeObserver({
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
        height: "250px",
      }}
    >
      <DoomFire
        fireEnabled={true}
        fireColors={colors}
        pixelSize={4}
        height={270}
        width={width}
      />
    </div>
  );
};
