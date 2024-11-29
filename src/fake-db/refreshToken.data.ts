import { RefreshToken } from '../models';

export const refreshToken = [
  new RefreshToken({
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJJZCI6ImlkMTIzIiwiZW1haWwiOiJraWVyYW4ubm9lbEBpY2xvdWQuY29tIiwiaXNBZG1pbiI6dHJ1ZX0sImp0aSI6ImJmMDg4OTA5LWU3MmUtNDZiMC05ZTQ0LWI2OWU3NmRhMDNjNCIsImlhdCI6MTczMjc5ODk0NSwiZXhwIjoxNzMzNDAzNzQ1fQ.LGWj1Dx4Uh2vdFe8xcLFzj-L-qvlptuygftsEhvuTc8',
    userId: '12345',
    status: 'expired'
  }),
  new RefreshToken({
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJJZCI6ImlkMTIzIiwiZW1haWwiOiJraWVyYW4ubm9lbEBpY2xvdWQuY29tIiwiaXNBZG1pbiI6dHJ1ZX0sImp0aSI6ImJmMDg4OTA5LWU3MmUtNDZiMC05ZTQ0LWI2OWU3NmRhMDNjNCIsImlhdCI6MTczMjc5ODk0NSwiZXhwIjoxNzMzNDAzNzQ1fQ.LGWj1Dx4Uh2vdFe8xcLFzj-L-qvlptuygftsEhvuTc8',
    _id: '12345',
    status: 'expired'
  })
];
