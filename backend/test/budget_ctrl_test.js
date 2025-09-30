const sinon = require("sinon");
const { expect } = require("chai");
const BudgetFacade = require("../services/budgetFacade");
const budgetController = require("../controllers/budgetController");

describe("Budget Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: "user123" },
      body: { amount: 500 }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  });

  afterEach(() => {
    sinon.restore(); // restore all stubs
  });

  // -------- setBudget --------
  describe("setBudget", () => {
    it("should set budget successfully", async () => {
      const fakeBudget = { amount: 500, user: "user123" };
      sinon.stub(BudgetFacade, "setBudget").resolves(fakeBudget);

      await budgetController.setBudget(req, res);

      expect(BudgetFacade.setBudget.calledOnceWith("user123", 500)).to.be.true;
      expect(res.json.calledWith(fakeBudget)).to.be.true;
    });

    it("should return 400 if error occurs", async () => {
      sinon.stub(BudgetFacade, "setBudget").rejects(new Error("DB error"));

      await budgetController.setBudget(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match({ success: false, error: "DB error" }))).to.be.true;
    });
  });

  // -------- getRemaining --------
  describe("getRemaining", () => {
    it("should return remaining budget successfully", async () => {
      sinon.stub(BudgetFacade, "getRemaining").resolves(300);

      await budgetController.getRemaining(req, res);

      expect(BudgetFacade.getRemaining.calledOnceWith("user123")).to.be.true;
      expect(res.json.calledWith({ success: true, remaining: 300 })).to.be.true;
    });

    it("should return 400 if error occurs", async () => {
      sinon.stub(BudgetFacade, "getRemaining").rejects(new Error("Something went wrong"));

      await budgetController.getRemaining(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match({ success: false, error: "Something went wrong" }))).to.be.true;
    });
  });

  // -------- getBudget --------
  describe("getBudget", () => {
    it("should return budget successfully", async () => {
      const fakeBudget = { amount: 500, user: "user123" };
      sinon.stub(BudgetFacade, "getBudget").resolves(fakeBudget);

      await budgetController.getBudget(req, res);

      expect(BudgetFacade.getBudget.calledOnceWith("user123")).to.be.true;
      expect(res.json.calledWith(fakeBudget)).to.be.true;
    });

    it("should return 400 if error occurs", async () => {
      sinon.stub(BudgetFacade, "getBudget").rejects(new Error("Budget not found"));

      await budgetController.getBudget(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith(sinon.match({ success: false, error: "Budget not found" }))).to.be.true;
    });
  });
});
