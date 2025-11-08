import { Controller, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';

class UserDto {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: number;

  @ApiProperty({ example: 'Jon Doe', description: 'The name of the user' })
  name: string;
}

@ApiTags('auth')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  @Get()
  @ApiOperation({ summary: 'Get a list of users' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [UserDto],
  })
  getUsers(): UserDto[] {
    return [{ id: 1, name: 'Jon Doe' }];
  }
}
