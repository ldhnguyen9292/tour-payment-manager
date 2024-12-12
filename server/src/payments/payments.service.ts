import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel('Activity') private activityModel,
    @InjectModel('Participant') private participantModel,
    @InjectModel('Tour') private tourModel,
  ) {}

  async calculateShares(tourId: string): Promise<{
    [participantId: string]: { totalOwed: number; totalPaid: number };
  }> {
    const tour = await this.tourModel
      .findById(tourId)
      .populate('activities participants');
    const balances = {};

    for (const participant of tour.participants) {
      balances[participant._id] = {
        totalOwed: 0,
        totalPaid: participant.totalPaid,
      };
    }

    for (const activity of tour.activities) {
      if (activity.splitType === 'equal') {
        const share = activity.cost / tour.participants.length;
        for (const participant of tour.participants) {
          balances[participant._id].totalOwed += share;
        }
      } else if (activity.splitType === 'percentage') {
        for (const detail of activity.splitDetails) {
          balances[detail.participantId].totalOwed +=
            (activity.cost * detail.percentage) / 100;
        }
      }
    }

    return balances;
  }

  async settleBalances(tourId: string): Promise<void> {
    const balances = await this.calculateShares(tourId);

    for (const participantId in balances) {
      const balance = balances[participantId];
      await this.participantModel.findByIdAndUpdate(participantId, {
        totalOwed: balance.totalOwed - balance.totalPaid,
      });
    }
  }
}
