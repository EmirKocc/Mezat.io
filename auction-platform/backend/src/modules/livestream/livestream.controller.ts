import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateStreamDto } from './dto/create-stream.dto';
import { LivestreamService } from './livestream.service';

@ApiTags('livestream')
@Controller('livestream')
export class LivestreamController {
  constructor(private readonly livestreamService: LivestreamService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start Agora livestream for an auction' })
  startStream(@Body() payload: CreateStreamDto) {
    return this.livestreamService.createStream(payload);
  }
}
