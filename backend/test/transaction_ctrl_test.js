
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Transaction = require('../models/Transaction');
const { getTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('Add Transaction Function Test', () => {
  let saveStub;

  afterEach(() => {
    if (saveStub && saveStub.restore) {
      saveStub.restore();
    }
  });

  it('should add a new record successfully', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },  // matches controller user field name
      body: {
        amount: 100,
        type: "expense",
        category: new mongoose.Types.ObjectId(),
        note: "test",
        date: "2025-08-07"
      }
    };

    const createdTrs = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      user: req.user._id
    };

    saveStub = sinon.stub(Transaction.prototype, 'save').resolves(createdTrs);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createTransaction(req, res);


    expect(saveStub.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdTrs)).to.be.true;
  });

  it('should return 400 if an error occurs', async () => {
    saveStub = sinon.stub(Transaction.prototype, 'save').throws(new Error('DB Error'));

    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      body: {
        amount: 150,
        type: "expense",
        category: new mongoose.Types.ObjectId(),
        note: "test1",
        date: "2025-08-08"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createTransaction(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ error: 'Failed to create transaction' })).to.be.true;
  });
});


describe('updateTransaction Function Test', () => {
  let findByIdStub, saveStub;

  afterEach(() => {
    if (findByIdStub && findByIdStub.restore) findByIdStub.restore();
    if (saveStub && saveStub.restore) saveStub.restore();
  });

  it('should update a transaction successfully', async () => {
    const transactionId = new mongoose.Types.ObjectId();
    const req = {
      params: { id: transactionId },
      body: {
        amount: 200,
        type: 'income',
        category: new mongoose.Types.ObjectId(),
        note: 'updated note',
        date: '2025-08-10',
      },
    };

    const existingTransaction = new Transaction({
      _id: transactionId,
      amount: 100,
      type: 'expense',
      category: new mongoose.Types.ObjectId(),
      note: 'old note',
      date: '2025-08-05',
    });

    findByIdStub = sinon.stub(Transaction, 'findById').resolves(existingTransaction);
    saveStub = sinon.stub(existingTransaction, 'save').resolves(existingTransaction);

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await updateTransaction(req, res);

    expect(findByIdStub.calledOnceWith(transactionId)).to.be.true;
    expect(existingTransaction.amount).to.equal(200);
    expect(existingTransaction.type).to.equal('income');
    expect(existingTransaction.note).to.equal('updated note');
    expect(saveStub.calledOnce).to.be.true;
    expect(res.json.calledWith(existingTransaction)).to.be.true;
  });

  it('should return 404 if transaction not found', async () => {
    const transactionId = new mongoose.Types.ObjectId();
    const req = {
      params: { id: transactionId },
      body: {
        amount: 200,
        type: 'income',
        category: new mongoose.Types.ObjectId(),
        note: 'updated note',
        date: '2025-08-10',
      },
    };

    findByIdStub = sinon.stub(Transaction, 'findById').resolves(null);

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await updateTransaction(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ error: 'Transaction not found' })).to.be.true;
  });

  it('should return 400 if error occurs during update', async () => {
    const transactionId = new mongoose.Types.ObjectId();
    const req = {
      params: { id: transactionId },
      body: {
        amount: 200,
        type: 'income',
        category: new mongoose.Types.ObjectId(),
        note: 'updated note',
        date: '2025-08-10',
      },
    };

    const existingTransaction = new Transaction({
      _id: transactionId,
      amount: 100,
      type: 'expense',
      category: new mongoose.Types.ObjectId(),
      note: 'old note',
      date: '2025-08-05',
    });

    findByIdStub = sinon.stub(Transaction, 'findById').resolves(existingTransaction);
    saveStub = sinon.stub(existingTransaction, 'save').throws(new Error('DB Error'));

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await updateTransaction(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ error: 'Failed to update transaction' })).to.be.true;
  });
});

describe('deleteTransaction Function Test', () => {
  let findByIdStub, removeStub;

  afterEach(() => {
    if (findByIdStub && findByIdStub.restore) findByIdStub.restore();
    if (removeStub && removeStub.restore) removeStub.restore();
  });

  it('should delete a transaction successfully', async () => {
    const transactionId = new mongoose.Types.ObjectId();

    const transaction = new Transaction({
      _id: transactionId,
      amount: 100,
      user: new mongoose.Types.ObjectId(),
    });

    removeStub = sinon.stub(transaction, 'remove').resolves();
    findByIdStub = sinon.stub(Transaction, 'findById').resolves(transaction);

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await deleteTransaction({ params: { id: transactionId } }, res);

    expect(findByIdStub.calledOnceWith(transactionId)).to.be.true;
    expect(removeStub.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Transaction deleted' })).to.be.true;
  });

  it('should return 404 if transaction not found', async () => {
    const transactionId = new mongoose.Types.ObjectId();

    findByIdStub = sinon.stub(Transaction, 'findById').resolves(null);

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await deleteTransaction({ params: { id: transactionId } }, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ error: 'Transaction not found' })).to.be.true;
  });

  it('should return 400 if error occurs during delete', async () => {
    const transactionId = new mongoose.Types.ObjectId();

    const transaction = new Transaction({
      _id: transactionId,
      amount: 100,
      user: new mongoose.Types.ObjectId(),
    });

    removeStub = sinon.stub(transaction, 'remove').throws(new Error('DB Error'));
    findByIdStub = sinon.stub(Transaction, 'findById').resolves(transaction);

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await deleteTransaction({ params: { id: transactionId } }, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ error: 'Failed to delete transaction' })).to.be.true;
  });
});

describe('getTransactions Function Test', () => {
  let findStub;

  afterEach(() => {
    if (findStub && findStub.restore) findStub.restore();
  });

  it('should fetch transactions successfully', async () => {
    const req = {
      user: { _id: new mongoose.Types.ObjectId() },
      query: { month: '8', year: '2025' },
    };

    const fakeTransactions = [
      { _id: new mongoose.Types.ObjectId(), amount: 100, user: req.user._id },
    ];

    findStub = sinon.stub(Transaction, 'find').returns({
      populate: sinon.stub().resolves(fakeTransactions),
    });

    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await getTransactions(req, res);

    expect(findStub.calledOnce).to.be.true;
    expect(res.json.calledWith(fakeTransactions)).to.be.true;
  });
});