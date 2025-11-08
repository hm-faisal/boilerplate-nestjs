import { ApiProperty } from '@nestjs/swagger';

export class OkResponse {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful.',
  })
  success: boolean;

  @ApiProperty({ example: 200, description: 'The HTTP status code.' })
  statusCode: number;

  @ApiProperty({
    example: 'Request successful',
    description: 'A brief message about the response.',
  })
  message: string;

  @ApiProperty({ description: 'The timestamp of the response.' })
  timestamp: Date;

  @ApiProperty({
    example: '/example',
    description: 'The path of the request.',
  })
  path: string;
}
