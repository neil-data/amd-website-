interface AiProbabilityInput {
  challengePoints: number;
  timeTaken: number;
  baselineScore?: number;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function estimateAiProbability(input: AiProbabilityInput): number {
  const normalizedTime = input.timeTaken > 0 ? 100 / input.timeTaken : 100;
  const baseline = input.baselineScore ?? 0;
  const raw = 35 + normalizedTime * 0.25 - baseline * 0.1 + input.challengePoints * 0.03;
  return Number(clamp(raw).toFixed(2));
}
