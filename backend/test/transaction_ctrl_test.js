
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

    // Check save() was called once
    expect(saveStub.calledOnce).to.be.true;

    // Check response
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



// describe('Update Function Test', () => {

//   it('should update task successfully', async () => {
//     // Mock task data
//     const taskId = new mongoose.Types.ObjectId();
//     const existingTask = {
//       _id: taskId,
//       title: "Old Task",
//       description: "Old Description",
//       completed: false,
//       deadline: new Date(),
//       save: sinon.stub().resolvesThis(), // Mock save method
//     };
//     // Stub Task.findById to return mock task
//     const findByIdStub = sinon.stub(Task, 'findById').resolves(existingTask);

//     // Mock request & response
//     const req = {
//       params: { id: taskId },
//       body: { title: "New Task", completed: true }
//     };
//     const res = {
//       json: sinon.spy(),
//       status: sinon.stub().returnsThis()
//     };

//     // Call function
//     await updateTask(req, res);

//     // Assertions
//     expect(existingTask.title).to.equal("New Task");
//     expect(existingTask.completed).to.equal(true);
//     expect(res.status.called).to.be.false; // No error status should be set
//     expect(res.json.calledOnce).to.be.true;

//     // Restore stubbed methods
//     findByIdStub.restore();
//   });



//   it('should return 404 if task is not found', async () => {
//     const findByIdStub = sinon.stub(Task, 'findById').resolves(null);

//     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     await updateTask(req, res);

//     expect(res.status.calledWith(404)).to.be.true;
//     expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;

//     findByIdStub.restore();
//   });

//   it('should return 500 on error', async () => {
//     const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

//     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     await updateTask(req, res);

//     expect(res.status.calledWith(500)).to.be.true;
//     expect(res.json.called).to.be.true;

//     findByIdStub.restore();
//   });



// });



// describe('GetTask Function Test', () => {

//   it('should return tasks for the given user', async () => {
//     // Mock user ID
//     const userId = new mongoose.Types.ObjectId();

//     // Mock task data
//     const tasks = [
//       { _id: new mongoose.Types.ObjectId(), title: "Task 1", userId },
//       { _id: new mongoose.Types.ObjectId(), title: "Task 2", userId }
//     ];

//     // Stub Task.find to return mock tasks
//     const findStub = sinon.stub(Task, 'find').resolves(tasks);

//     // Mock request & response
//     const req = { user: { id: userId } };
//     const res = {
//       json: sinon.spy(),
//       status: sinon.stub().returnsThis()
//     };

//     // Call function
//     await getTasks(req, res);

//     // Assertions
//     expect(findStub.calledOnceWith({ userId })).to.be.true;
//     expect(res.json.calledWith(tasks)).to.be.true;
//     expect(res.status.called).to.be.false; // No error status should be set

//     // Restore stubbed methods
//     findStub.restore();
//   });

//   it('should return 500 on error', async () => {
//     // Stub Task.find to throw an error
//     const findStub = sinon.stub(Task, 'find').throws(new Error('DB Error'));

//     // Mock request & response
//     const req = { user: { id: new mongoose.Types.ObjectId() } };
//     const res = {
//       json: sinon.spy(),
//       status: sinon.stub().returnsThis()
//     };

//     // Call function
//     await getTasks(req, res);

//     // Assertions
//     expect(res.status.calledWith(500)).to.be.true;
//     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

//     // Restore stubbed methods
//     findStub.restore();
//   });

// });



// describe('DeleteTask Function Test', () => {

//   it('should delete a task successfully', async () => {
//     // Mock request data
//     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

//     // Mock task found in the database
//     const task = { remove: sinon.stub().resolves() };

//     // Stub Task.findById to return the mock task
//     const findByIdStub = sinon.stub(Task, 'findById').resolves(task);

//     // Mock response object
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     // Call function
//     await deleteTask(req, res);

//     // Assertions
//     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
//     expect(task.remove.calledOnce).to.be.true;
//     expect(res.json.calledWith({ message: 'Task deleted' })).to.be.true;

//     // Restore stubbed methods
//     findByIdStub.restore();
//   });

//   it('should return 404 if task is not found', async () => {
//     // Stub Task.findById to return null
//     const findByIdStub = sinon.stub(Task, 'findById').resolves(null);

//     // Mock request data
//     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

//     // Mock response object
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     // Call function
//     await deleteTask(req, res);

//     // Assertions
//     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
//     expect(res.status.calledWith(404)).to.be.true;
//     expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;

//     // Restore stubbed methods
//     findByIdStub.restore();
//   });

//   it('should return 500 if an error occurs', async () => {
//     // Stub Task.findById to throw an error
//     const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

//     // Mock request data
//     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

//     // Mock response object
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.spy()
//     };

//     // Call function
//     await deleteTask(req, res);

//     // Assertions
//     expect(res.status.calledWith(500)).to.be.true;
//     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

//     // Restore stubbed methods
//     findByIdStub.restore();
//   });

// });