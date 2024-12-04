import { Document, Model, Schema } from 'mongoose';

export function addSoftDelete(schema: Schema) {
  schema.add({
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  });

  schema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function () {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };
}

// Define a SoftDeleteModel interface
export interface SoftDeleteModel<T extends Document> extends Model<T> {
  softDelete(id: string): Promise<T | null>;
  restore(id: string): Promise<T | null>;
}
