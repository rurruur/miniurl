import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/users.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/user.interface';
import fetch from 'node-fetch';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepo: Repository<Users>) {}

  async findAll() {
    return await this.usersRepo.find();
  }

  async save(user: UserDto) {
    const found = await this.usersRepo.findOneBy({ email: user.email });
    if (found) return found;
    const created = await this.usersRepo.create(user);
    await this.usersRepo.save(created);
    return created;
  }

  async getUserInfo(accessToken: string) {
    const me = await (
      await fetch(`https://api.intra.42.fr/v2/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).json();
    const profile: UserDto = {
      email: me.email,
      login: me.login,
    };
    return profile;
  }
}
