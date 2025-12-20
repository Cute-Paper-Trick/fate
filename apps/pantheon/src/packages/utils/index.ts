/**
 * 将日期字符串转换为相对时间格式
 * @param dateString - 日期字符串或时间戳
 * @returns 相对时间字符串，如：1年前、2个月前、7天前等
 */
export function formatRelativeTime(dateString: string | number | Date): string {
  if (!dateString) {
    return '';
  }

  const now = new Date();
  const date = new Date(dateString);

  // 计算时间差(毫秒)
  const diff = now.getTime() - date.getTime();

  // 如果是未来时间，返回具体日期
  if (diff < 0) {
    return date.toLocaleDateString('zh-CN');
  }

  // 转换为秒
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years}年前`;
  }
  if (months > 0) {
    return `${months}个月前`;
  }
  if (days > 0) {
    return `${days}天前`;
  }
  if (hours > 0) {
    return `${hours}小时前`;
  }
  if (minutes > 0) {
    return `${minutes}分钟前`;
  }
  if (seconds > 30) {
    return `${seconds}秒前`;
  }

  return '刚刚';
}

/**
 * 将数字格式化为简写格式
 * @param num - 要格式化的数字
 * @param digits - 保留的小数位数，默认为1
 * @returns 格式化后的字符串，如：1.2k、10.5M、1.8B
 */
export function formatNumber(num: number, digits: number = 1): string {
  if (num === 0) {
    return '0';
  }

  if (num < 1000) {
    return num.toString();
  }

  const units = ['', 'k', 'M', 'B', 'T'];
  const exponent = Math.floor(Math.log10(Math.abs(num)) / 3);
  const unitIndex = Math.min(exponent, units.length - 1);
  const scaledNum = num / Math.pow(1000, unitIndex);

  return scaledNum.toFixed(digits) + units[unitIndex];
}
