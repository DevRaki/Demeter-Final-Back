import { Router } from "express";
import { createSaleDetail, getDetails, createManyDetails, lotUpd, deleteSaleDetail} from "../controllers/saledetail.controller.js";

import { authRequired } from '../middlewares/validateToken.js'
import ModuleValidationMiddleware from '../middlewares/ModuleValidation.middleware.js'

const router = Router();

<<<<<<< Updated upstream
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

router.use(moduleValidation.hasPermissions(
    moduleValidation.MODULES.SALES
))

router.post('/Csaledetail', authRequired, createSaleDetail);
router.post('/CManyDetails', authRequired, createManyDetails);
router.get('/details/:id', authRequired, getDetails);
router.get('/detailsWproduct/:id', authRequired, getDetailsWithProductInfo);
router.put('/update', authRequired, lotUpd )
router.delete('/deleteDetailS/:ID_SaleDetail', authRequired, deleteSaleDetail )
=======
router.post('/Csaledetail', createSaleDetail);
router.post('/CManyDetails', createManyDetails);
router.get('/details/:id', getDetails);
router.put('/update',lotUpd )
router.delete('/deleteDetailS/:ID_SaleDetail',deleteSaleDetail )
>>>>>>> Stashed changes

export default router;