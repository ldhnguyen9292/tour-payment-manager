import { Model, now, Schema, Types } from 'mongoose';

const objectId = (id: string) => new Types.ObjectId(id);

interface MongoosePluginModel<T> extends Model<T> {
  softDelete(id: string): Promise<T>;
  restore(id: string): Promise<T>;
}

const SoftDeletePlugin = (schema: Schema) => {
  schema.add({
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  });

  schema.statics.softDelete = function (id: string) {
    return this.findByIdAndUpdate(
      { _id: objectId(id) },
      { isDeleted: true, deletedAt: now() },
    );
  };

  schema.statics.restore = function (id: string) {
    return this.findByIdAndUpdate(
      { _id: objectId(id) },
      { isDeleted: false, deletedAt: null },
    );
  };
};

export { MongoosePluginModel, objectId, SoftDeletePlugin };
