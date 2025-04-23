// hooks/useDominantColor.ts
import { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';


export function useDominantColor(base64Image?: string): string {
  const [color, setColor] = useState('#fae292'); // default fallback

  useEffect(() => {
    const fac = new FastAverageColor();
    fac.getColorAsync(`data:image/png;base64,${base64Image}`)
      .then(result => setColor(result.hex))
      .catch(() => setColor('#fae292'));
  }, [base64Image]);

  return color;
}

