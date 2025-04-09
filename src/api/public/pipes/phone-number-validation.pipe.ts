import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validatePhoneNumber } from '../../../utils/phone-number-validator';

export interface PhoneNumberValidationPipeOptions {
  optional?: boolean;
}

@Injectable()
export class PhoneNumberValidationPipe implements PipeTransform {
  private readonly optional: boolean;

  constructor(options: PhoneNumberValidationPipeOptions = {}) {
    this.optional = options.optional || false;
  }

  transform(value: string, metadata: ArgumentMetadata) {
    // 선택적 파라미터이고 값이 없는 경우 undefined 반환
    if (this.optional && (value === undefined || value === null || value === '')) {
      return undefined;
    }

    // 필수 파라미터인데 값이 없는 경우 예외 발생
    if (!this.optional && (value === undefined || value === null || value === '')) {
      throw new BadRequestException('전화번호는 필수 입력값입니다.');
    }

    // 값이 있는 경우 검증
    try {
      return validatePhoneNumber(value);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('유효하지 않은 전화번호 형식입니다.');
    }
  }
}