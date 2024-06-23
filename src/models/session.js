import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
    {
        refreshToken: { type: String, required: true },
        accessToken: { type: String, required: true },
        refreshTokenValidity: { type: Date, required: true },
        accessTokenValidity: { type: Date, required: true },
        userId: { type: Schema.Types.ObjectId, required: true, unique: true },

  },
  { timestamps: true, versionKey: false }
);

export const Session = model('Session', sessionSchema);
