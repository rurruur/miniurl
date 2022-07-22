import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from 'src/entity/url.entity';
import { Repository } from 'typeorm';
import { UrlDto } from '../dto/url.interface';

@Injectable()
export class UrlService {
  constructor(@InjectRepository(Url) private urlRepo: Repository<Url>) {}

  convertBase(id: number): number[] {
    const digits: number[] = [];
    let remain;
    while (id > 0) {
      remain = id % 62;
      digits.unshift(remain);
      id = Math.floor(id / 62);
    }
    return digits;
  }

  shorten(id: number): string {
    const base =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const converted: number[] = this.convertBase(id);
    let shortened = process.env.URL_BASE;
    for (const i of converted) {
      shortened += base[i];
    }
    return shortened;
  }

  async findAll() {
    const result = await this.urlRepo.find();
    return result;
  }

  async getOriginal(miniUrl: string) {
    const url = process.env.URL_BASE + miniUrl;
    const obj = await this.urlRepo.findOneBy({ after: url });
    // 없으면 throw NotFound
    if (obj === null) throw new NotFoundException('등록되지 않은 url입니다.');
    return obj.pre;
  }

  async save(urlObj: UrlDto) {
    const found = await this.urlRepo.findOneBy({ pre: urlObj.pre });
    if (found) return found;
    const created = await this.urlRepo.create(urlObj);
    await this.urlRepo.save(created);
    const shortened = this.shorten(created.id);
    created.after = shortened;
    const result = await this.urlRepo.save(created);
    console.log(result);
    return created;
  }

  async deleteById(id: number) {
    await this.urlRepo.delete({ id });
  }
}
