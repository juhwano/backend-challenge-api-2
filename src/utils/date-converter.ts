/**
 * 날짜 문자열을 유닉스 타임스탬프(초 단위)로 변환합니다.
 * @param dateString YYYY-MM-DD 형식의 날짜 문자열
 * @param endOfDay 하루의 끝(23:59:59)으로 설정할지 여부
 * @returns 유닉스 타임스탬프(초 단위)
 */
export function dateToTimestamp(dateString: string, endOfDay: boolean = false): number {
  const date = new Date(dateString);
  
  if (endOfDay) {
    // 하루의 끝(23:59:59.999)으로 설정
    date.setHours(23, 59, 59, 999);
  } else {
    // 하루의 시작(00:00:00.000)으로 설정
    date.setHours(0, 0, 0, 0);
  }
  
  return Math.floor(date.getTime() / 1000);
}

/**
 * 유닉스 타임스탬프(초 단위)를 YYYY-MM-DD 형식의 날짜 문자열로 변환합니다.
 * @param timestamp 유닉스 타임스탬프(초 단위)
 * @returns YYYY-MM-DD 형식의 날짜 문자열
 */
export function timestampToDateString(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}