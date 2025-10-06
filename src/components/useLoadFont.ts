import { useEffect, useState } from "react";
import fontUrl from "../assets/PressStart2P-Regular.ttf";

export const useLoadFont = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      try {
        console.log("Fetching font from:", fontUrl);
        const response = await fetch(fontUrl);
        console.log("Response status:", response.status, response.ok);

        const fontData = await response.arrayBuffer();
        console.log("Font data size:", fontData.byteLength);

        const myFontFace = new FontFace("PressStart2P", fontData);
        console.log("FontFace created");

        document.fonts.add(myFontFace);
        console.log("Font added to document");

        await myFontFace.load();
        console.log("Font loaded successfully");

        setFontLoaded(true);
      } catch (err) {
        console.error("Error at step:", err);
        if (err instanceof Error) {
          console.error("Error name:", err.name);
          console.error("Error message:", err.message);
        }
        setIsError(true);
      }
    };

    loadFont();
  }, []);

  return { isLoaded: fontLoaded, isError };
};
