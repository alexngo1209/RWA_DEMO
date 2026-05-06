import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, index: true })
    address: string;

    @Prop([
        {
            address: String,
            isPrimary: Boolean,
        },
    ])
    wallets: {
        address: string;
        isPrimary: boolean;
    }[];

    @Prop()
    nonce: string;

    @Prop({
        enum: ['user', 'admin'],
        default: 'user',
    })
    role: string;

    @Prop({
        enum: ['active', 'blocked'],
        default: 'active',
    })
    status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);