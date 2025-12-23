import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { renewalDate, ...rest } = createSubscriptionDto;
    return this.prisma.subscription.create({
      data: {
        ...rest,
        renewalDate: new Date(renewalDate),
      },
    });
  }

  async findAll() {
    return this.prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    const { renewalDate, ...rest } = updateSubscriptionDto;
    const dataToUpdate: any = { ...rest };

    if (renewalDate) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      dataToUpdate.renewalDate = new Date(renewalDate);
    }

    try {
      return await this.prisma.subscription.update({
        where: { id },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: dataToUpdate,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2025') {
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.subscription.delete({
        where: { id },
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2025') {
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }
      throw error;
    }
  }
}
