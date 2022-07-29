import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RefreshTokenService {

    constructor(
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepo: Repository<RefreshToken>
    ) { }

    async create(userId: string) {
        let refreshToken: RefreshToken = new RefreshToken()

        const rawToken: string = crypto.randomBytes(32).toString('hex')
        const salt: string = await bcrypt.genSalt();
        const hashedToken: string = await bcrypt.hash(rawToken, salt)

        refreshToken.hashedToken = hashedToken
        refreshToken.createdAt = Date.now().toString()
        let user = new User()
        user.id = userId
        refreshToken.user = user

        return {
            hashedToken: this.refreshTokenRepo.save(refreshToken),
            rawToken: rawToken
        }
    }

    remove(id: number) {
        return this.refreshTokenRepo.delete({ id: id })
    }

    async removeByUserId(userId: string) {
        let user = new User()
        user.id = userId
        return this.refreshTokenRepo.delete({ user: user })
    }

    findOne(id: number) {
        return this.refreshTokenRepo.findOneBy({ id: id })
    }

    findOneByUserId(userId: string) {
        let user = new User()
        user.id = userId
        return this.refreshTokenRepo.findOneBy({ user: user })
    }
}
