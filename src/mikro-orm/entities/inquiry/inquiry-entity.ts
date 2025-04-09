import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';

@Entity({ tableName: 'inquiry' })
export class InquiryEntity {
  @PrimaryKey({ name: 'id' })
  id?: number;

  @Property({ name: 'phone_number', length: 11 })
  @Index() 
  phoneNumber: string;

  @Property({ name: 'business_type', length: 150 })
  businessType: string;

  @Property({ name: 'business_number', length: 10, nullable: true })
  businessNumber?: string;

  @Property({ name: 'created_at', columnType: 'integer' })
  @Index() // 타임스탬프 기반 검색을 위한 인덱스
  createdAt: number = Math.floor(Date.now() / 1000); // 유닉스 타임스탬프 (초 단위)
}
