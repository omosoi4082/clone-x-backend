import { Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from './feed.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Feed)
    private feedsRepository: Repository<Feed>,
  ) {}

  async getFeedsWithUser() {
    const feeds = await this.feedsRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
    const feedsWithUserInfo = feeds.map((feed) => ({
      ...feed,
      user: {
        id: feed.user.id,
        name: feed.user.name,
      },
    }));
    return feedsWithUserInfo;
  }

  async createFeed(feed: CreateFeedDto, userId: number) {
    //const user = await this.usersRepository.findOne({ where: { id: userId } });
    const newFeed = this.feedsRepository.create({
      content: feed.content,
      user: { id: userId },
    });
    return await this.feedsRepository.save(newFeed);
  }

  async deleteFeed(id: number) {
    return await this.feedsRepository.delete(id);
  }
}
