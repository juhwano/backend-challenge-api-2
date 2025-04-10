import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class DateValidationPipe implements PipeTransform {
  constructor(private readonly options: { optional?: boolean } = {}) {}

  transform(value: any, metadata: ArgumentMetadata) {
    // 값이 없고 선택적 파라미터인 경우 undefined 반환
    if ((value === undefined || value === '') && this.options.optional) {
      return undefined;
    }

    // 값이 없고 필수 파라미터인 경우 예외 발생
    if ((value === undefined || value === '') && !this.options.optional) {
      throw new BadRequestException(`${metadata.data} 값이 필요합니다.`);
    }

    try {
      // 문자열을 Date 객체로 변환
      const date = new Date(value);
      
      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        throw new Error('유효하지 않은 날짜 형식입니다.');
      }
      
      return date;
    } catch (error) {
      throw new BadRequestException(`유효한 날짜 형식이 아닙니다: ${value}`);
    }
  }
}