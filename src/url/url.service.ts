import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Url } from 'src/entity/url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlService {
  constructor(@InjectRepository(Url) private urlRepo: Repository<Url>) {}

  async checkUrlExists(url: string): Promise<boolean> {
    const found = await this.urlRepo.findOneBy({
      after: process.env.API_URL + url,
    });
    if (found) return true;
    else return false;
  }

  convertBase64(id: number): string {
    const base =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
    const digits: number[] = [];
    let remain;
    while (id > 0) {
      remain = id % 62;
      digits.unshift(remain);
      id = Math.floor(id / 62);
    }
    let shortened = '';
    for (const i of digits) {
      shortened += base[i];
    }
    return shortened;
  }

  async shorten(url: string): Promise<string> {
    const hash = createHash('sha512').update(url).digest('base64url');
    let asciiSum = 0;
    for (const char of hash) {
      asciiSum += char.charCodeAt(0);
    }
    let shortened = process.env.API_URL + this.convertBase64(asciiSum);
    while (await this.checkUrlExists(shortened)) {
      shortened = process.env.API_URL + this.convertBase64(++asciiSum);
    }
    return shortened;
  }

  validateUrl(url: string) {
    // http~로 시작해야 리다이렉트 가능
    if (url.indexOf('https://') !== 0 && url.indexOf('http://') !== 0)
      throw new BadRequestException('올바른 형식의 주소가 아닙니다.');
  }

  async findAll() {
    const result = await this.urlRepo.find();
    return result;
  }

  async getOriginal(miniUrl: string) {
    const url = process.env.API_URL + miniUrl;
    const obj = await this.urlRepo.findOneBy({ after: url });
    // 없으면 throw NotFound
    if (obj === null) throw new NotFoundException('등록되지 않은 url입니다.');
    return obj.pre;
  }

  async save(originalUrl: string) {
    const found = await this.urlRepo.findOneBy({ pre: originalUrl });
    if (found) return found.after;
    const result = await this.shorten(originalUrl);
    await this.urlRepo.save({
      pre: originalUrl,
      after: result,
    });
    return result;
  }

  async deleteById(id: number) {
    await this.urlRepo.delete({ id });
  }
}
