var PacketReader = require('../packets/PacketReader'),
  PacketWriter = require('../packets/PacketWriter'),
  CloseDatabasePacket = require('../packets/CloseDatabasePacket'),
  CAS = require('../constants/CASConstants');

exports['test_CloseConnectionPacket'] = function (test) {
  test.expect(14);
  console.log('Unit test ' + module.filename.toString() + ' started...');
  var packetReader = new PacketReader();
  var packetWriter = new PacketWriter();
  var options = {casInfo : [0, 255, 255, 255]};
  var closeDatabasePacket = new CloseDatabasePacket(options);

  closeDatabasePacket.write(packetWriter);
  test.equal(packetWriter._toBuffer()[3], 1); //total length

  test.equal(packetWriter._toBuffer()[4], 0); //casInfo
  test.equal(packetWriter._toBuffer()[5], 255); //casInfo
  test.equal(packetWriter._toBuffer()[6], 255); //casInfo
  test.equal(packetWriter._toBuffer()[7], 255); //casInfo

  test.equal(packetWriter._toBuffer()[8], CAS.CASFunctionCode.CAS_FC_CON_CLOSE);

  packetReader.write(new Buffer([0, 0, 0, 0, 0, 255, 255, 255, 0, 0, 0, 0]));

  test.equal(packetReader._packetLength(), 12);

  closeDatabasePacket.parse(packetReader);

  test.equal(closeDatabasePacket.casInfo[0], 0); //casInfo
  test.equal(closeDatabasePacket.casInfo[1], 255); //casInfo
  test.equal(closeDatabasePacket.casInfo[2], 255); //casInfo
  test.equal(closeDatabasePacket.casInfo[3], 255); //casInfo

  test.equal(closeDatabasePacket.responseCode, 0);

  test.equal(closeDatabasePacket.errorCode, 0);
  test.equal(closeDatabasePacket.errorMsg, '');
  console.log('Unit test ended OK.');
  test.done();
};

