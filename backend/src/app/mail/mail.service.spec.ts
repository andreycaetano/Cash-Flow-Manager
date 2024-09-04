import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

describe('MailService', () => {

  jest.mock('nodemailer');
  
  let service: MailService;
  let transporterMock;

  beforeEach(async () => {

    transporterMock = {
      sandMail: jest.fn()
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendPasswordResetEmail', async () => {
    it('should send password reset email successfully', async () => {
      const to = 'example@mail.com';
      const token = 'Jwt-Token';
      const mockResponse = {
        response: '250 OK',
        envelope: { from: 'example@mail.com', to: [to]},
        messageId: 'some-id',
      };

      transporterMock.sendMail.mockResolveValueOnce(mockResponse);

      const result = await service.sendPasswordResetEmail(to, token);

      expect(result).toEqual(mockResponse);
      expect(transporterMock.sendMail).toHaveBeenCalledWith({
        from: process.env.SMTP_USER,
        to,
        subject: 'Recuperação de senha',
        text: expect.stringContaining(`http://${process.env.URL_BASE}.com/reset-password?token=${token}`),
        html: expect.stringContaining(`http://${process.env.URL_BASE}.com/reset-password?token=${token}`), 
      });
    });
  });
});
