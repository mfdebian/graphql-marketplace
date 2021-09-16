exports.sign = jest.fn().mockReturnValue('xxxx');

exports.verify = jest.fn().mockImplementation((_, __, cb) => {
  cb(new Error('OMG'));
});