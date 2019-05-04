/**
 * To add A Bank
 * @param {org.kyc.network.AddBank} AddBank
 * @transaction
 */

async function AddBank(Bank) {
  var factory = getFactory();
  var NS = 'org.kyc.network';
  
  var bank = factory.newResource(NS, 'Bank', Bank.code);
  bank.codetype = Bank.codetype;

  const createbank = await getParticipantRegistry('org.kyc.network.Bank');
  await createbank.add(bank);

  var bankvalue = factory.newResource(NS, 'BankBalance', Bank.code);
  bankvalue.bank = factory.newRelationship(NS, 'Bank', Bank.code);

  const createbankbalance = await getAssetRegistry('org.kyc.network.BankBalance');
  await createbankbalance.add(bankvalue); 

}

/**
 * To add A user
 * @param {org.kyc.network.AddUser} AddUser
 * @transaction
 */

async function AddUser(UserResult) {
  var factory = getFactory();
  var NS = 'org.kyc.network';
  var details = UserResult.bank;
  
  var user = factory.newResource(NS, 'UserResult', UserResult.userid);
  user.bank = factory.newRelationship(NS, 'Bank', details.code);
  user.status = 'Pending';

  user.filetype = [];
  user.filehash = [];
  
  var d = new Date();
  var dd = d.getUTCDate() + "-" + d.getUTCMonth() + "-" + d.getUTCFullYear();
  user.timestamp = dd.toString();
  
  const createuser = await getAssetRegistry('org.kyc.network.UserResult');
  await createuser.add(user);
  return 'Done';
}

/**
 * To Edit a user
 * @param {org.kyc.network.EditUser} EditUser
 * @transaction
 */

async function EditUser(EditPara) {
  var details = EditPara.userres;
  
  details.filetype.push(EditPara.filetype);
  details.filehash.push(EditPara.filehash);

  details.status = EditPara.status;

  var d = new Date();
  var dd = d.getUTCDate() + "-" + d.getUTCMonth() + "-" + d.getUTCFullYear();
  details.timestamp = dd.toString();
  
  const edituser = await getAssetRegistry('org.kyc.network.UserResult');
  await edituser.update(details);
}

/**
 * To Check status of kyc
 * @param {org.kyc.network.CheckKyc} CheckKyc
 * @transaction
 */

async function CheckKyc(CheckKycParameters) {
  var userdetails = CheckKycParameters.userres;
  var bankdetails = CheckKycParameters.bankb;

  var currentcost = userdetails.currentvalue;
  var currentstatus = userdetails.status;
  if( currentcost <= bankdetails.balance ){
    userdetails.currentvalue = ( currentcost / 2 );
    bankdetails.balance = ( bankdetails.balance - currentcost );
    const changeval = await getAssetRegistry('org.kyc.network.BankBalance');
    await changeval.update(bankdetails);
    const edituser = await getAssetRegistry('org.kyc.network.UserResult');
    await edituser.update(userdetails);
    return currentstatus;
  }
  else{
    return 'Not Sufficient Balance';
  }
}