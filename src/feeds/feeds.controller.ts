import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { Feed } from './feed.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  getFeeds() {
    return this.feedsService.getFeedsWithUser();
  }

  @Post()
  createdFeeds(
    @Body() feed: CreateFeedDto,
    @Req() request: Request & { user: { id: number } },
  ) {
    const userId = request.user.id;
    return this.feedsService.createFeed({ ...feed }, userId);
  }

  @Delete(':id')
  deleteFeed(@Param('id') id: number) {
    return this.feedsService.deleteFeed(id);
  }
}
