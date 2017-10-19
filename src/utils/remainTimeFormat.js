const YEAR_LEN = 31536000000;
const MONTH_LEN = 2592000000;
const DAY_LEN = 86400000;
const HOUR_LEN = 3600000;
const MINUTE_LEN = 60000;
const SECOND_LEN = 1000;

export default (val) => {
  const result = [];
  if (val > YEAR_LEN) {
    const years = Math.floor(val / YEAR_LEN);
    result.push(`${years}year${years > 1 && 's'}`);
    val = val % YEAR_LEN;
  }
  if (val > MONTH_LEN) {
    const months = Math.floor(val / MONTH_LEN);
    result.push(`${months}month${months > 1 && 's'}`);
    val = val % MONTH_LEN;
  }
  if (val > DAY_LEN) {
    const days = Math.floor(val / DAY_LEN);
    result.push(`${days}day${days > 1 && 's'}`);
    val = val % DAY_LEN;
  }
  if (val > HOUR_LEN) {
    const hours = Math.floor(val / HOUR_LEN);
    result.push(`${hours}hour${hours > 1 && 's'}`);
    val = val % HOUR_LEN;
  }
  if (val > MINUTE_LEN) {
    const minutes = Math.floor(val / MINUTE_LEN);
    result.push(`${minutes}minute${minutes > 1 && 's'}`);
    val = val % MINUTE_LEN;
  }
  if (val > SECOND_LEN) {
    const seconds = Math.floor(val / SECOND_LEN);
    result.push(`${seconds}second${seconds > 1 && 's'}`);
  }

  return result.join(' ') || 'none';
};
