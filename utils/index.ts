export function formatNumber(num: number) {
  return Intl.NumberFormat().format(num);
}

export function formatHoursLeft(hours: number) {
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d ${hours % 24}h`;
}

export function formatRatio(a: number, b: number) {
  return (
    Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
    }).format(isNaN(a / b) ? 0 : a / b) +
    ':' +
    Math.min(b, 1)
  );
}

export function filterSelectAll(settings: UserSettings) {
  return (dragon: ScrollView) => {
    if (
      dragon.hatch !== '0' &&
      168 - dragon.hoursleft >= settings.hatchlingMinAge
    ) {
      return true;
    } else if (
      dragon.hatch === '0' &&
      168 - dragon.hoursleft >= settings.eggMinAge
    ) {
      return true;
    }

    return false;
  };
}

export function pluralise(word: string, count: number) {
  return count === 1 ? word : `${word}s`;
}
