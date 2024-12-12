import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivitiesModule } from './activities/activities.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { DashboardModule } from './dashboard/dashboard.module';
import { ParticipantsModule } from './participants/participants.module';
import { PaymentsModule } from './payments/payments.module';
import { ToursModule } from './tours/tours.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    PaymentsModule,
    ToursModule,
    DashboardModule,
    ActivitiesModule,
    ParticipantsModule,
  ],
})
export class AppModule {}
