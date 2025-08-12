const sinon = require('sinon');
const { expect } = require('chai');
const Category = require('../models/Category');
const { getCategories } = require('../controllers/catController');

describe('Get categories function test', () => {
  let findStub;

  afterEach(() => {
    if (findStub && findStub.restore) findStub.restore();
  });

  it('should fetch categories successfully', async () => {
    const fakeCategories = [
      { _id: '1', name: 'Food', icon: 'fas fa-hamburger' , color: '#FF5733' },
      { _id: '2', name: 'Transport', icon: 'fas fa-hamburger' , color: '#FF5733' },
    ];

    findStub = sinon.stub(Category, 'find').resolves(fakeCategories);

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getCategories({}, res);

    expect(findStub.calledOnce).to.be.true;
    expect(res.json.calledWith(fakeCategories)).to.be.true;
  });

  it('should return 500 if an error occurs', async () => {
    findStub = sinon.stub(Category, 'find').throws(new Error('DB Error'));

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getCategories({}, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});
