import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.kyc.network{
   export class UserResult extends Asset {
      userid: string;
      filetype: string[];
      filehash: string[];
      timestamp: string;
      bank: Bank;
   }
   export class Bank extends Participant {
      codetype: string;
      code: string;
   }
   export class AddUser extends Transaction {
   }
   export class AddBank extends Transaction {
   }
   export class EditUser extends Transaction {
      filetype: string;
      filehash: string;
      userres: UserResult;
   }
// }
