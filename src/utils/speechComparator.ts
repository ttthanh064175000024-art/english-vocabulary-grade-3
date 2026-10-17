import { ComparisonResult, PronunciationScore } from '../types';

// Map common number digits to words
const NUM_MAP: Record<string, string> = {
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  '10': 'ten',
};

// Clean text for speech matching
export function cleanSpokenText(text: string): string {
  let cleaned = text.toLowerCase().trim();

  // Replace digits with words
  Object.entries(NUM_MAP).forEach(([digit, word]) => {
    cleaned = cleaned.replace(new RegExp(`\\b${digit}\\b`, 'g'), word);
  });

  // Remove punctuation
  cleaned = cleaned.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ');

  // Collapse multiple whitespaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

// Levenshtein distance between two strings
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  for (let i = 0; i <= bLen; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= aLen; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bLen; i++) {
    for (let j = 1; j <= aLen; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bLen][aLen];
}

// String similarity percentage [0, 100]
function calculateStringSimilarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 100;

  const distance = levenshteinDistance(longer, shorter);
  return Math.max(0, Math.round(((longer.length - distance) / longer.length) * 100));
}

export function comparePronunciation(
  spokenRaw: string,
  targetRaw: string,
  isSentenceMode: boolean = false
): ComparisonResult {
  const spoken = cleanSpokenText(spokenRaw);
  const target = cleanSpokenText(targetRaw);

  if (!spoken) {
    return {
      score: 'retry',
      similarity: 0,
      spokenText: '(Chưa nhận được âm thanh)',
      targetText: targetRaw,
      praiseTitle: 'Chưa nghe thấy giọng của con!',
      feedbackMessage: 'Con hãy bấm micro lần nữa, lại gần máy và nói to, rõ ràng hơn nhé!',
      earnedStars: 1,
    };
  }

  // Exact match
  if (spoken === target) {
    return {
      score: 'excellent',
      similarity: 100,
      spokenText: spokenRaw,
      targetText: targetRaw,
      praiseTitle: 'Tuyệt vời! Chuẩn 100% ⭐⭐⭐',
      feedbackMessage: 'Con phát âm rất chuẩn và rõ ràng! Hãy tiếp tục phát huy nhé!',
      earnedStars: 3,
    };
  }

  // Check if spoken text contains target word (e.g. kid said "a book" or "it's a pen" when target is "book")
  const targetTokens = target.split(' ');
  const spokenTokens = spoken.split(' ');

  let score: PronunciationScore = 'retry';
  let similarity = 0;

  if (!isSentenceMode) {
    // Single word mode:
    // Check if the target word is directly contained in what they said (e.g. "a pen" for "pen")
    if (spokenTokens.includes(target) || spoken.endsWith(` ${target}`) || spoken.startsWith(`${target} `)) {
      similarity = 95;
      score = 'excellent';
    } else if (targetTokens.length > 1 && spoken.includes(target)) {
      // Compound words like "pencil case", "school bag"
      similarity = 95;
      score = 'excellent';
    } else {
      // Calculate best token match or direct string similarity
      const directSim = calculateStringSimilarity(spoken, target);
      const bestTokenSim = Math.max(
        ...spokenTokens.map(tok => calculateStringSimilarity(tok, target)),
        0
      );
      similarity = Math.max(directSim, bestTokenSim);

      if (similarity >= 75) {
        score = 'excellent';
      } else if (similarity >= 50) {
        score = 'good';
      } else {
        score = 'retry';
      }
    }
  } else {
    // Sentence mode:
    // Token overlap + overall similarity
    const matchedTokens = targetTokens.filter(t => spokenTokens.includes(t));
    const tokenMatchRatio = matchedTokens.length / targetTokens.length;
    const stringSim = calculateStringSimilarity(spoken, target);

    similarity = Math.round(tokenMatchRatio * 60 + stringSim * 0.4);

    if (similarity >= 75) {
      score = 'excellent';
    } else if (similarity >= 50) {
      score = 'good';
    } else {
      score = 'retry';
    }
  }

  // Formulate friendly praise & feedback
  if (score === 'excellent') {
    const praises = [
      'Tuyệt vời quá! Con nói rất chuẩn! ⭐⭐⭐',
      'Đúng rồi! Bạn nhỏ thông minh quá! ⭐⭐⭐',
      'Xuất sắc! Chuẩn Cambridge Starters rồi nè! ⭐⭐⭐',
    ];
    const praise = praises[Math.floor(Math.random() * praises.length)];

    return {
      score: 'excellent',
      similarity: Math.min(100, Math.max(85, similarity)),
      spokenText: spokenRaw,
      targetText: targetRaw,
      praiseTitle: praise,
      feedbackMessage: 'Hệ thống đã nhận diện chính xác! Con bấm "Từ tiếp theo" để rinh thêm sao nhé!',
      earnedStars: 3,
    };
  }

  if (score === 'good') {
    return {
      score: 'good',
      similarity: Math.max(55, Math.min(79, similarity)),
      spokenText: spokenRaw,
      targetText: targetRaw,
      praiseTitle: 'Rất cố gắng! Gần đúng rồi! ⭐⭐',
      feedbackMessage:
        'Con đọc khá tốt! Hãy bấm vào chiếc loa để nghe lại mẫu một lần nữa và thử lại cho thật chuẩn nhé!',
      earnedStars: 2,
    };
  }

  // Score retry
  return {
    score: 'retry',
    similarity: Math.max(10, Math.min(49, similarity)),
    spokenText: spokenRaw,
    targetText: targetRaw,
    praiseTitle: 'Chưa chính xác hoặc chưa nghe rõ! ⭐',
    feedbackMessage:
      'Đừng nản lòng nhé! Con bấm biểu tượng Loa để nghe lại cách đọc chậm rãi, rồi bấm Micro thử lại nào!',
    earnedStars: 1,
  };
}
