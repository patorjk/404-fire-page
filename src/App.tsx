import "./App.css";
import { DoomFireContainer } from "./components/DoomFireContainer.tsx";
import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useRef, useState } from "react";
import { DoomFireTorchContainer } from "./components/DoomFireTorchContainer.tsx";
import { useLoadFont } from "./components/useLoadFont.ts";

const defaultFireColors = [
  "#771f0700",
  "#771f07",
  "#DF4F07",
  "#cf770f",
  "#BF9F1F",
  "#B7B72F",
  "#DBDB97",
];

const purpleRedFireColor = [
  "#FF000000", // transparent
  "#FF0000", // Red
  "purple",
];

const greenFireColors = [
  "#66FF0000", // transparent
  "#66FF00",
  "#097969",
];

const yellowRedFireColors = ["#FF634700", "#FF6347", "#FFD700"];

const purpleFireColors = ["#FF69B400", "#FF69B4", "#BA55D3"];

function App() {
  const [colors, setColors] = useState<string[]>(defaultFireColors);

  useHotkeys("1", () => {
    setColors(defaultFireColors);
  });
  useHotkeys("2", () => {
    setColors(purpleRedFireColor);
  });
  useHotkeys("3", () => {
    setColors(greenFireColors);
  });
  useHotkeys("4", () => {
    setColors(yellowRedFireColors);
  });
  useHotkeys("5", () => {
    setColors(purpleFireColors);
  });

  const { isLoaded, isError } = useLoadFont();
  const fontLoaded = isLoaded || isError;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textCells, setTextCells] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!fontLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    if (canvas.width === 0 || canvas.height === 0) return;
    console.log("yo");
    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "90px 'PressStart2P', system-ui";
    ctx.fillText("404", canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = "26px 'PressStart2P', system-ui";
    ctx.fillText("Page not found", canvas.width / 2, canvas.height / 2 + 60);

    // Pre-compute which grid cells contain text
    const computedTextCells = new Set<string>();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        // Check if pixel is black (or dark)
        if (
          imageData.data[i] < 128 &&
          imageData.data[i + 1] < 128 &&
          imageData.data[i + 2] < 128
        ) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          const cellKey = `${Math.floor(x / 4)},${Math.floor(y / 4)}`;
          computedTextCells.add(cellKey);
        }
      }
    }

    setTextCells(computedTextCells);
  }, [fontLoaded]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}
      />

      {textCells.size > 0 && (
        <DoomFireTorchContainer colors={colors} flammable={textCells} />
      )}
      <DoomFireContainer colors={colors} />
    </div>
  );
}

export default App;
