import { ApiProperty } from '@nestjs/swagger';
import { OkResponse } from 'src/common/dto/responses/200';

export class healthResponse extends OkResponse {
  @ApiProperty({
    example: 'Server is running',
    description: 'message about server conditions',
  })
  data: string;
}
