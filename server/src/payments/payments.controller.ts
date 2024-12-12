import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get(':tourId/shares')
  @ApiOperation({ summary: 'Get payment shares for a tour' })
  @ApiParam({ name: 'tourId', description: 'The ID of the tour' })
  @ApiResponse({ status: 200 })
  async getPaymentShares(@Param('tourId') tourId: string) {
    return await this.paymentsService.calculateShares(tourId);
  }

  @Post(':tourId/settle')
  @ApiOperation({ summary: 'Settle balances for a tour' })
  @ApiParam({ name: 'tourId', description: 'The ID of the tour' })
  @ApiResponse({ status: 200 })
  async settleBalances(@Param('tourId') tourId: string) {
    await this.paymentsService.settleBalances(tourId);
    return { message: 'Balances settled successfully.' };
  }
}
