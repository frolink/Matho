import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import appConfig from './config/app.config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { LiveModule } from './modules/live/live.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      load: [appConfig],
    }),

    PrismaModule,

    AuthModule,
    UsersModule,
    MerchantModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    LiveModule,
    AffiliateModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
