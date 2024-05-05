const StudentSkills = artifacts.require("StudentSkills");

module.exports = function(deployer) {
  deployer.deploy(StudentSkills, "initialPublicKey102234234234", "initalHashData10223423423432");
};