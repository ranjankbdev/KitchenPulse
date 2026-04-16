import mongoose from 'mongoose';

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    shopOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    broadcastedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['broadcasted', 'accepted', 'completed'],
      default: 'broadcasted',
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    commission: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

deliveryAssignmentSchema.index({ assignedTo: 1, status: 1 });
deliveryAssignmentSchema.index({ broadcastedTo: 1, status: 1 });
deliveryAssignmentSchema.index({ order: 1 });

const DeliveryAssignment = mongoose.model('DeliveryAssignment', deliveryAssignmentSchema);
export default DeliveryAssignment;
