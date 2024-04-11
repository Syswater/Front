import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { compactDecrypt, CompactEncrypt } from 'jose';
import { createECDH } from 'crypto';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncryptECDHService {

  privateKeyPath: string = environment.privateKeyPath

  constructor(private httpClient: HttpClient) { }

  protected async decrypt(params: any) {
    try {
      const { jwe } = params;
      const serverSecret = await this.getSecretKey(params);
      const { plaintext } = await compactDecrypt(jwe, serverSecret)
      const originalMessage = new TextDecoder().decode(plaintext);
      let jsonMessage, finalMessage;

      try {
        jsonMessage = JSON.parse(originalMessage);
        if (typeof jsonMessage === "string") finalMessage = JSON.parse(jsonMessage);
        else finalMessage = jsonMessage
      } catch (error) {
        finalMessage = jsonMessage || originalMessage;
      }

      return { success: true, message: finalMessage }

    } catch (error) {
      console.error("Error en desencriptado:", error);
      return { success: false }
    }
  }

  protected async encrypt(params: any) {
    try {
      const { message } = params;
      const serverSecret = await this.getSecretKey(params);
      let jwe = await new CompactEncrypt(
        new TextEncoder().encode(JSON.stringify(message)),
      ).setProtectedHeader({ alg: 'dir', enc: 'A256GCM' }).encrypt(serverSecret)
      return { success: true, jwe }
    } catch (error) {
      console.error("Error en encriptado:", error)
      return { success: false }
    }
  }

  private async getSecretKey(params: any) {
    const { clientKey } = params;
    const clientPublicKey = Buffer.from(clientKey, 'base64');
    const privateKey = await firstValueFrom(this.httpClient.get(this.privateKeyPath, { responseType: 'text' }))
    const server = createECDH('prime256v1');
    server.setPrivateKey(Buffer.from(privateKey));
    return server.computeSecret(clientPublicKey);
  }


}