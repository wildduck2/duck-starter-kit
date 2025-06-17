import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true, trim: true, lowercase: true, minlength: 3, maxlength: 30 })
  username: string

  @Prop({ type: String, required: true, trim: true, lowercase: true, minlength: 3, maxlength: 30 })
  name: string

  @Prop({ type: String, required: true, minlength: 8, select: false })
  password: string

  // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  @Prop({ type: String, required: true, trim: true, lowercase: true })
  email: string

  @Prop({ type: String, required: true, enum: ['admin', 'user', 'moderator'], default: 'user' })
  role: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ username: 1 }, { unique: true })
UserSchema.index({ email: 1 }, { unique: true })

/**
 * TODO: If you have millions of users, consider:
 * Redis caching layer for repeated `findById/findOne`
 * Materialized views or denormalized collections for complex joins
 */
