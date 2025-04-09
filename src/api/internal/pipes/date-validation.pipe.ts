import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

export interface DateValidationPipeOptions {
  optional?: boolean;
}

@Injectable()
export class DateValidationPipe implements PipeTransform {
  private readonly optional: boolean;

  constructor(options: DateValidationPipeOptions = {}) {
    this.optional = options.optional || false;
  }

  transform(value: string, metadata: ArgumentMetadata) {
    // 선택적 파라미터이고 값이 없는 경우 undefined 반환
    if (this.optional && (value === undefined || value === null || value === '')) {
      return undefined;
    }

    // 필수 파라미터인데 값이 없는 경우 예외 발생
    if (!this.optional && (value === undefined || value === null || value === '')) {
      throw new BadRequestException('날짜는 필수 입력값입니다.');
    }

    // 날짜 형식 검증 (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException('날짜 형식은 YYYY-MM-DD 형태여야 합니다.');
    }

    // 유효한 날짜인지 검증
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('유효하지 않은 날짜입니다.');
    }

    // 날짜 문자열 그대로 반환 (컨트롤러에서 Date 객체로 변환)
    return value;
  }
}