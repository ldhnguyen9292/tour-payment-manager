import { Document, Model, Schema } from 'mongoose';

export function addSoftDelete(schema: Schema) {
  // Add the `isDeleted` field to the schema
  schema.add({ isDeleted: { type: Boolean, default: false } });

  // Add the `softDelete` static method
  schema.statics.softDelete = async function (id: string) {
    return this.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  };
}

// Define a SoftDeleteModel interface
export interface SoftDeleteModel<T extends Document> extends Model<T> {
  softDelete(id: string): Promise<T | null>;
}
