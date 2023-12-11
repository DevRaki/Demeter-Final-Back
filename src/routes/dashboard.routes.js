import { Router } from 'express';
import {
    mostPurchasedSupplies,
    mostSoldProducts,
    totalProfitAndExpenses,
    organizeByDay,
    organizeByWeek,
    organizeByMonth,
    totalProfitAndExpensesByPaymentMethod,
    totalUnitsPurchasedBySupply,
    totalUnitsSoldByProduct,
    averageUnitsPerPurchase,
    averageUnitsPerSale,
    netIncomeByProduct,
    netIncomeBySupply
} from '../controllers/dashboard.controller.js';

import { authRequired } from '../middlewares/validateToken.js'
import ModuleValidationMiddleware from '../middlewares/ModuleValidation.middleware.js'

const router = Router();

const moduleValidation = new ModuleValidationMiddleware(
    ({
        res,
        error
    }) => {
        res.json({
            message: error.message
        })
    }
)

router.get("/dashboard/most-purchased-supplies", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), mostPurchasedSupplies);
router.get("/dashboard/most-sold-products", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), mostSoldProducts);
router.get("/dashboard/total-profit-expenses", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), totalProfitAndExpenses);
router.get("/dashboard/organize-by-day", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), organizeByDay);
router.get("/dashboard/organize-by-week", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), organizeByWeek);
router.get("/dashboard/organize-by-month", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), organizeByMonth);
router.get("/dashboard/profit-expenses-payment-method", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), totalProfitAndExpensesByPaymentMethod);
router.get("/dashboard/total-units-purchased-by-supply", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), totalUnitsPurchasedBySupply);
router.get("/dashboard/total-units-sold-by-product", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), totalUnitsSoldByProduct);
router.get("/dashboard/average-units-per-purchase", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), averageUnitsPerPurchase);
router.get("/dashboard/average-units-per-sale", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), averageUnitsPerSale);
router.get("/dashboard/net-income-by-product", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), netIncomeByProduct);
router.get("/dashboard/net-income-by-supply", authRequired, moduleValidation.hasPermissions(
    moduleValidation.MODULES.DASHBOARD
), netIncomeBySupply);

export default router;
