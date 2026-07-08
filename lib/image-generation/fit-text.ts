export type FitTextInput = {
  text: string;
  boxWidth: number;
  boxHeight: number;
  maxFontSize: number;
  minFontSize: number;
  maxLines: number;
  lineHeightMultiplier: number;
};

export type FittedText = {
  lines: string[];
  fontSize: number;
  lineHeight: number;
  totalTextHeight: number;
};

function charWeight(char: string) {
  if (char === " ") {
    return 0.34;
  }
  if ("il.,'|![]()".includes(char)) {
    return 0.32;
  }
  if ("mwMW@#%&".includes(char)) {
    return 0.92;
  }
  if (char >= "A" && char <= "Z") {
    return 0.68;
  }
  return 0.56;
}

function measureText(text: string, fontSize: number) {
  return [...text].reduce((total, char) => total + charWeight(char) * fontSize, 0);
}

function splitLongWord(word: string, fontSize: number, maxWidth: number) {
  const chunks: string[] = [];
  let current = "";

  for (const char of [...word]) {
    const next = `${current}${char}`;
    if (current && measureText(next, fontSize) > maxWidth) {
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
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const parts =
      measureText(word, fontSize) > maxWidth ? splitLongWord(word, fontSize, maxWidth) : [word];

    for (const part of parts) {
      const next = current ? `${current} ${part}` : part;
      if (measureText(next, fontSize) <= maxWidth) {
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
  if (measureText(text, fontSize) <= maxWidth) {
    return text;
  }

  const ellipsis = "...";
  let output = text.trim();
  while (output && measureText(`${output}${ellipsis}`, fontSize) > maxWidth) {
    output = output.slice(0, -1).trimEnd();
  }

  return output ? `${output}${ellipsis}` : ellipsis;
}

export function fitTextToBox(input: FitTextInput): FittedText {
  const text = input.text.trim() || "-";
  const maxLines = Math.max(1, input.maxLines);
  const maxFontSize = Math.max(input.maxFontSize, input.minFontSize);

  for (let fontSize = maxFontSize; fontSize >= input.minFontSize; fontSize -= 1) {
    const lines = wrapText(text, fontSize, input.boxWidth, maxLines);
    const lineHeight = fontSize * input.lineHeightMultiplier;
    const totalTextHeight = lines.length * lineHeight;
    const fitsWidth = lines.every((line) => measureText(line, fontSize) <= input.boxWidth);

    if (lines.length <= maxLines && totalTextHeight <= input.boxHeight && fitsWidth) {
      return {
        lines,
        fontSize,
        lineHeight,
        totalTextHeight,
      };
    }
  }

  const fontSize = input.minFontSize;
  const lineHeight = fontSize * input.lineHeightMultiplier;
  const allowedLines = Math.max(1, Math.min(maxLines, Math.floor(input.boxHeight / lineHeight)));
  const lines = wrapText(text, fontSize, input.boxWidth, allowedLines).map((line) =>
    truncateToWidth(line, fontSize, input.boxWidth),
  );

  return {
    lines: lines.length ? lines : ["-"],
    fontSize,
    lineHeight,
    totalTextHeight: Math.max(1, lines.length) * lineHeight,
  };
}
