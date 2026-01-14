import "./App.css";
import { DoomFireContainer } from "./components/DoomFireContainer.tsx";
import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useRef, useState } from "react";
import { DoomFireTorchContainer } from "./components/DoomFireTorchContainer.tsx";
import { useLoadFont } from "./components/useLoadFont.ts";
import { useWindowSize } from "usehooks-ts";

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
const pinkFireColors = ["#FF69B400", "#FF69B4", "pink"];
const blueFireColors = ["#0000FF00", "skyblue"];
const purpleFireColors = ["#6666FF00", "#CBC3E3"];
const eightColors = ["#771A0F00", "#E8541A", "#F6C363", "#F3DEC3"];
const nineColors = ["#0F1A7700", "#1A54E8", "#63C3F6", "#C3DEF3"];

const grayFire = [
  "#37373700",
  "#373737",
  "#727272",
  "#858585",
  "#9a9a9a",
  "#a7a7a7",
  "#d3d3d3",
];

const colorOptions = [
  grayFire,
  defaultFireColors,
  purpleRedFireColor,
  greenFireColors,
  yellowRedFireColors,
  pinkFireColors,
  blueFireColors,
  purpleFireColors,
  eightColors,
  nineColors,
];

interface AppInnerProps {
  colors: string[];
  isDarkMode?: boolean;
  fireEnabled?: boolean;
}

function AppInner({
  colors,
  isDarkMode = false,
  fireEnabled = true,
}: AppInnerProps) {
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

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = isDarkMode ? "black" : "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const title = urlParams.get("title") || "404";
    const subtitle = urlParams.get("subtitle") || "Page not found";

    // Draw text
    ctx.fillStyle = isDarkMode ? "white" : "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "90px 'PressStart2P', system-ui";
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = "26px 'PressStart2P', system-ui";
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 60);

    // Pre-compute which grid cells contain text
    const computedTextCells = new Set<string>();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const pixelCheck = isDarkMode
          ? imageData.data[i] > 128 &&
            imageData.data[i + 1] > 128 &&
            imageData.data[i + 2] > 128
          : imageData.data[i] < 128 &&
            imageData.data[i + 1] < 128 &&
            imageData.data[i + 2] < 128;
        if (pixelCheck) {
          const cellKey = `${Math.floor(x / 4)},${Math.floor(y / 4)}`;
          computedTextCells.add(cellKey);
        }
      }
    }

    setTextCells(computedTextCells);
  }, [fontLoaded, isDarkMode]);

  const goHome = () => {
    window.location.href = "https://patorjk.com/";
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }}
      />

      {textCells.size > 0 && (
        <DoomFireTorchContainer
          colors={colors}
          flammable={textCells}
          fireEnabled={fireEnabled}
        />
      )}
      <DoomFireContainer colors={colors} fireEnabled={fireEnabled} />

      <div
        style={{
          position: "fixed",
          height: "80px",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <button
          type={"button"}
          className={"nes-btn "}
          style={{ justifySelf: "center", pointerEvents: "auto" }}
          onClick={goHome}
        >
          Home
        </button>
      </div>
    </>
  );
}

function App() {
  const { width = 0, height = 0 } = useWindowSize();
  const [count, setCount] = useState(0);
  const [fireEnabled, setFireEnabled] = useState<boolean>(true);
  const [colors, setColors] = useState<string[]>(() => {
    const index = Math.floor(Math.random() * 9) + 1;
    return colorOptions[index];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useHotkeys("1", () => {
    setColors(colorOptions[1]);
  });
  useHotkeys("2", () => {
    setColors(colorOptions[2]);
  });
  useHotkeys("3", () => {
    setColors(colorOptions[3]);
  });
  useHotkeys("4", () => {
    setColors(colorOptions[4]);
  });
  useHotkeys("5", () => {
    setColors(colorOptions[5]);
  });
  useHotkeys("6", () => {
    setColors(colorOptions[6]);
  });
  useHotkeys("7", () => {
    setColors(colorOptions[7]);
  });
  useHotkeys("8", () => {
    setColors(colorOptions[8]);
  });
  useHotkeys("9", () => {
    setColors(colorOptions[9]);
  });
  useHotkeys("0", () => {
    setColors(colorOptions[0]);
  });

  useHotkeys("r", () => {
    setCount((prev) => prev + 1);
  });
  useHotkeys("t", () => {
    setIsDarkMode((prev) => !prev);
  });
  useHotkeys("f", () => {
    setFireEnabled((prev) => !prev);
  });

  useEffect(() => {
    let timer: number;
    const toggleFire = () => {
      window.clearTimeout(timer);
      setFireEnabled(false);
      timer = window.setTimeout(() => {
        setFireEnabled(true);
      }, 1000);
    };
    window.addEventListener("dblclick", toggleFire);

    return () => {
      window.removeEventListener("dblclick", toggleFire);
    };
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <AppInner
        key={`${width},${height},${count},${isDarkMode}`}
        colors={colors}
        isDarkMode={isDarkMode}
        fireEnabled={fireEnabled}
      />
    </div>
  );
}

export default App;
