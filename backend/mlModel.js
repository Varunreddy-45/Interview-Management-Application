const weights = {
  experience: 0.45,
  communication: 0.35,
  technical: 0.20,
};

const bias = 0.02;

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function predictFit({ experience, communication, technical }) {
  const normalized = {
    experience: clamp(Number(experience) || 0),
    communication: clamp(Number(communication) || 0),
    technical: clamp(Number(technical) || 0),
  };

  const score = bias
    + normalized.experience * weights.experience
    + normalized.communication * weights.communication
    + normalized.technical * weights.technical;

  const percentage = Math.round(clamp(score, 0, 1) * 100);

  let label = "Needs more review";
  if (percentage >= 80) label = "Excellent fit";
  else if (percentage >= 65) label = "Strong fit";
  else if (percentage >= 45) label = "Promising fit";

  return { score: percentage, label };
}

module.exports = { predictFit };
