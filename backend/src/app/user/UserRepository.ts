import { prisma } from './../../connection/prisma';
import { IUser, IUserRepository } from './IUserRepository';

export class UserRepository implements IUserRepository {
  async create({ username, email, password }: IUser): Promise<IUser> {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    return user;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    return user;
  }

  async remove(id: string): Promise<string> {
    const user = await prisma.user.delete({
      where: { id },
    });

    return user.id;
  }

  async update(userId: string, username: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { username },
    });
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }
}
