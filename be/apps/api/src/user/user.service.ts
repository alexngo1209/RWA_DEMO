import { User, UserDocument } from '@libs/db/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) { }

    async findByAddress(address: string) {
        return this.userModel.findOne({ address });
    }

    async createOrUpdateNonce(address: string, nonce: string) {
        return this.userModel.findOneAndUpdate(
            { address },
            { nonce },
            { upsert: true, new: true },
        );
    }

    async clearNonce(address: string) {
        return this.userModel.updateOne(
            { address },
            { nonce: null },
        );
    }
}