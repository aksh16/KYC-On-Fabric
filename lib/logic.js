/**
 * To add A Bank
 * @param {org.kyc.network.AddBank} AddBank
 * @transaction
 */

async function AddBank(Bank) {
  var factory = getFactory();
  var NS = 'org.kyc.network';
  
  var bank = factory.newResource(NS, 'Bank','SBI001');
  bank.codetype = 'Bank';
  
  const createbank = await getParticipantRegistry('org.kyc.network.Bank');
  await createbank.add(bank);
}

/**
 * To add A Bank
 * @param {org.kyc.network.AddUser} AddUser
 * @transaction
 */

async function AddUser(UserResult) {
  var factory = getFactory();
  var NS = 'org.kyc.network';
  
  var user = factory.newResource(NS, 'UserResult', 'u000002');
  user.bank = factory.newRelationship(NS, 'Bank', 'SBI001');
  
  user.filetype = [];
  user.filetype.push('adhar card');
  user.filetype.push('pan card');
  user.filehash = [];
  user.filehash.push('b726t72t7v623bt5v62783t23b576');
  user.filehash.push('asdfknkashgas7y2348y482t23bb6');
  
  var today = new Date();
  var dd = today.getDate();
  user.timestamp = dd.toString();
  
  const createuser = await getAssetRegistry('org.kyc.network.UserResult');
  await createuser.add(user);
}

/**
 * To add A Bank
 * @param {org.kyc.network.EditUser} EditUser
 * @transaction
 */

async function EditUser(EditPara) {
  
  var NS = 'org.kyc.network';
  var details = EditPara.userres;
  
  details.filetype.push(EditPara.filetype);
  details.filehash.push(EditPara.filehash);
  
  
  const edituser = await getAssetRegistry('org.kyc.network.UserResult');
  await edituser.update(details);
}

