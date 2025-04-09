import { BadRequestException } from '@nestjs/common';

/**
 * 전화번호 유효성을 검사하는 함수
 * @param phoneNumber 검사할 전화번호 문자열
 * @returns 유효한 경우 전화번호 문자열 반환, 유효하지 않은 경우 예외 발생
 */
export function validatePhoneNumber(phoneNumber: string): string {
  // null 또는 undefined 처리
  if (phoneNumber === null || phoneNumber === undefined) {
    throw new BadRequestException('전화번호는 필수 입력값입니다.');
  }
  
  if (!phoneNumber) {
    throw new BadRequestException('전화번호는 필수 입력값입니다.');
  }
  
  // 010으로 시작하는 11자리 숫자인지 확인
  if (!/^010\d{8}$/.test(phoneNumber)) {
    throw new BadRequestException('유효하지 않은 전화번호 형식입니다.');
  }

  // 숫자로 변환하여 범위 검사
  const numericValue = parseInt(phoneNumber, 10);
  if (numericValue < 1000000000 || numericValue > 1099999999) {
    throw new BadRequestException('유효하지 않은 전화번호 범위입니다.');
  }

  return phoneNumber;
}

/**
 * 전화번호 유효성을 검사하는 함수 (예외 발생 없이 boolean 반환)
 * @param phoneNumber 검사할 전화번호 문자열
 * @returns 유효한 경우 true, 유효하지 않은 경우 false
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // null 또는 undefined 처리
  if (phoneNumber === null || phoneNumber === undefined) {
    return false;
  }
  
  if (!phoneNumber) {
    return false;
  }
  
  // 010으로 시작하는 11자리 숫자인지 확인
  if (!/^010\d{8}$/.test(phoneNumber)) {
    return false;
  }

  // 숫자로 변환하여 범위 검사
  const numericValue = parseInt(phoneNumber, 10);
  if (numericValue < 1000000000 || numericValue > 1099999999) {
    return false;
  }

  return true;
}