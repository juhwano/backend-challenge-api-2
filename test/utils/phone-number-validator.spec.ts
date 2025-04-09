import { BadRequestException } from '@nestjs/common';
import { validatePhoneNumber, isValidPhoneNumber } from '../../src/utils/phone-number-validator';

describe('PhoneNumberValidator', () => {
  describe('validatePhoneNumber', () => {
    it('유효한 전화번호를 검증해야 함', () => {
      // 유효한 전화번호 테스트
      expect(validatePhoneNumber('01012345678')).toBe('01012345678');
      expect(validatePhoneNumber('01099999999')).toBe('01099999999');
      expect(validatePhoneNumber('01000000000')).toBe('01000000000');
    });

    it('빈 전화번호에 대해 예외를 발생시켜야 함', () => {
      // 빈 전화번호 테스트
      expect(() => validatePhoneNumber('')).toThrow(BadRequestException);
      expect(() => validatePhoneNumber(null as unknown as string)).toThrow(BadRequestException);
      expect(() => validatePhoneNumber(undefined as unknown as string)).toThrow(BadRequestException);
    });

    it('010으로 시작하지 않는 전화번호에 대해 예외를 발생시켜야 함', () => {
      // 잘못된 형식의 전화번호 테스트
      expect(() => validatePhoneNumber('02012345678')).toThrow(BadRequestException);
      expect(() => validatePhoneNumber('01112345678')).toThrow(BadRequestException);
    });

    it('11자리가 아닌 전화번호에 대해 예외를 발생시켜야 함', () => {
      // 길이가 맞지 않는 전화번호 테스트
      expect(() => validatePhoneNumber('0101234567')).toThrow(BadRequestException);
      expect(() => validatePhoneNumber('010123456789')).toThrow(BadRequestException);
    });

    it('숫자가 아닌 문자가 포함된 전화번호에 대해 예외를 발생시켜야 함', () => {
      // 숫자가 아닌 문자가 포함된 전화번호 테스트
      expect(() => validatePhoneNumber('010-1234-5678')).toThrow(BadRequestException);
      expect(() => validatePhoneNumber('010abcdefgh')).toThrow(BadRequestException);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('유효한 전화번호에 대해 true를 반환해야 함', () => {
      // 유효한 전화번호 테스트
      expect(isValidPhoneNumber('01012345678')).toBe(true);
      expect(isValidPhoneNumber('01099999999')).toBe(true);
      expect(isValidPhoneNumber('01000000000')).toBe(true);
    });

    it('빈 전화번호에 대해 false를 반환해야 함', () => {
      // 빈 전화번호 테스트
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber(null as unknown as string)).toBe(false);
      expect(isValidPhoneNumber(undefined as unknown as string)).toBe(false);
    });

    it('010으로 시작하지 않는 전화번호에 대해 false를 반환해야 함', () => {
      // 잘못된 형식의 전화번호 테스트
      expect(isValidPhoneNumber('02012345678')).toBe(false);
      expect(isValidPhoneNumber('01112345678')).toBe(false);
    });

    it('11자리가 아닌 전화번호에 대해 false를 반환해야 함', () => {
      // 길이가 맞지 않는 전화번호 테스트
      expect(isValidPhoneNumber('0101234567')).toBe(false);
      expect(isValidPhoneNumber('010123456789')).toBe(false);
    });

    it('숫자가 아닌 문자가 포함된 전화번호에 대해 false를 반환해야 함', () => {
      // 숫자가 아닌 문자가 포함된 전화번호 테스트
      expect(isValidPhoneNumber('010-1234-5678')).toBe(false);
      expect(isValidPhoneNumber('010abcdefgh')).toBe(false);
    });
  });
});