import { Request, Response } from 'express';
import { UserService } from './UserService';

export class UserController {
  constructor(private userService: UserService) {}

  async store(req: Request, res: Response) {
    const { username, email, password, confirmPassword } = req.body;

    const user = await this.userService.create({
      username,
      email,
      password,
      confirmPassword,
    });

    return res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const payload = await this.userService.login(email, password);

    return res.status(200).json(payload);
  }

  async update(req: Request, res: Response) {
    const { username } = req.body;

    const userId = req.params.userId;

    await this.userService.update(userId, username);

    return res.status(200).send();
  }

  async destroy(req: Request, res: Response) {
    const userId = req.params.userId;

    await this.userService.remove(userId);

    return res.status(200).send();
  }

  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;

    const userId = req.params.userId;

    await this.userService.changePassword(userId, oldPassword, newPassword);

    return res.status(200).send();
  }
}
