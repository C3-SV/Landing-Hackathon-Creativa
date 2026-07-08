export type FitTextInput = {
  text: string;
  boxWidth: number;
  boxHeight: number;
  maxFontSize: number;
  minFontSize: number;
  fontFamily: string;
  maxLines: number;
};

export type FittedText = {
  lines: string[];
  fontSize: number;
  lineHeight: number;
  totalHeight: number;
  fontFamily: string;
};

function charWeight(char: string) {
  if (char === " ") {
    return 0.35;
  }
  if ("il.,'|!".includes(char)) {
    return 0.32;
  }
  if ("mwMW@#%&".includes(char)) {
    return 0.9;
  }
  if (char >= "A" && char <= "Z") {
    return 0.68;
  }
  return 0.56;
}

function estimateTextWidth(text: string, fontSize: number) {
  return [...text].reduce((total, char) => total + charWeight(char) * fontSize, 0);
}

function splitLongWord(word: string, fontSize: number, maxWidth: number) {
  const chunks: string[] = [];
  let current = "";

  for (const char of [...word]) {
    const next = `${current}${char}`;
    if (current && estimateTextWidth(next, fontSize) > maxWidth) {
      chunks.push(current);
      current = char;
    } else {
      current = next;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function wrapText(text: string, fontSize: number, maxWidth: number, maxLines: number) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const words = normalized.split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const parts =
      estimateTextWidth(word, fontSize) > maxWidth
        ? splitLongWord(word, fontSize, maxWidth)
        : [word];

    for (const part of parts) {
      const next = current ? `${current} ${part}` : part;
      if (estimateTextWidth(next, fontSize) <= maxWidth) {
        current = next;
        continue;
      }

      if (current) {
        lines.push(current);
      }
      current = part;

      if (lines.length >= maxLines) {
        return lines;
      }
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  return lines;
}

function truncateToWidth(text: string, fontSize: number, maxWidth: number) {
  if (estimateTextWidth(text, fontSize) <= maxWidth) {
    return text;
  }

  const ellipsis = "...";
  let output = text.trim();
  while (output.length > 0 && estimateTextWidth(`${output}${ellipsis}`, fontSize) > maxWidth) {
    output = output.slice(0, -1).trimEnd();
  }

  return output ? `${output}${ellipsis}` : ellipsis;
}

export function fitTextToBox(input: FitTextInput): FittedText {
  const text = input.text.trim() || "-";
  const maxLines = Math.max(1, input.maxLines);

  for (let fontSize = input.maxFontSize; fontSize >= input.minFontSize; fontSize -= 1) {
    const lines = wrapText(text, fontSize, input.boxWidth, maxLines);
    const lineHeight = Math.round(fontSize * 1.16);
    const totalHeight = lines.length * lineHeight;
    const fitsWidth = lines.every((line) => estimateTextWidth(line, fontSize) <= input.boxWidth);

    if (lines.length <= maxLines && totalHeight <= input.boxHeight && fitsWidth) {
      return {
        lines,
        fontSize,
        lineHeight,
        totalHeight,
        fontFamily: input.fontFamily,
      };
    }
  }

  const fontSize = input.minFontSize;
  const lineHeight = Math.round(fontSize * 1.16);
  const allowedLines = Math.max(1, Math.min(maxLines, Math.floor(input.boxHeight / lineHeight)));
  const lines = wrapText(text, fontSize, input.boxWidth, allowedLines).map((line) =>
    truncateToWidth(line, fontSize, input.boxWidth),
  );

  return {
    lines: lines.length ? lines : ["-"],
    fontSize,
    lineHeight,
    totalHeight: Math.max(1, lines.length) * lineHeight,
    fontFamily: input.fontFamily,
  };
}
