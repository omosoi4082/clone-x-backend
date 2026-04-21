import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  getAllUser() {
    return 'getAllUser';
  }

  async login(loginDto: { email: string; password: string }) {
    if (!loginDto.email) {
      throw new HttpException(
        'email must not be null or emtry',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!loginDto.password) {
      throw new HttpException(
        'password must not be null or emtry',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersRepository.findOne({
      where: { eamil: loginDto.email },
    });

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    if (user && !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new HttpException('invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload = { id: user.id, email: user.eamil };
    return {
      id: user.id,
      email: user.eamil,
      name: user.name,
      access_token: this.jwtService.sign(payload),
    };
  }

  async createUser(user: { name: string; email: string; password: string }) {
    if (!user.name) {
      throw new HttpException(
        'name must not be null or emtry',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user.email) {
      throw new HttpException(
        'email must not be null or emtry',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user.password) {
      throw new HttpException(
        'password must not be null or emtry',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassward = await bcrypt.hash(user.password);
    const newUser = {
      name: user.name,
      email: user.email,
      password: hashedPassward,
    };
    return this.usersRepository.save(newUser);
  }
}
