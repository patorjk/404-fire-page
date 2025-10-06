import { useEffect, useState } from "react";
import fontUrl from "../assets/PressStart2P-Regular.ttf";

export const useLoadFont = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      try {
        const response = await fetch(fontUrl);
        const fontData = await response.arrayBuffer();
        const myFontFace = new FontFace("PressStart2P", fontData);
        document.fonts.add(myFontFace);
        await myFontFace.load();
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

    loadFont().catch((err: unknown) => {
      console.error(err);
    });
  }, []);

  return { isLoaded: fontLoaded, isError };
};
