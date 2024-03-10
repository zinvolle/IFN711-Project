const StudentSkills = artifacts.require('StudentSkills');

contract('StudentSkills', (accounts) => {
  let studentSkillsInstance;

  before(async () => {
    studentSkillsInstance = await StudentSkills.deployed();
  });

  it('should return the correct public key', async () => {
    const publicKey = await studentSkillsInstance.getPublicKey();
    assert.equal(publicKey, 'expectedPublicKey', 'Public key does not match');
  });
  
});