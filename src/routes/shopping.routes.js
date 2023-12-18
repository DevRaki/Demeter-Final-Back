import { Router } from 'express';
import { getShopping, getShop, createShopping, disableShop, createMultipleShopping, getShopingAndShopingDetails ,getShoppingByDate, getShopingByProvider, getShoppingAndSuppliesBySupplierId, getShoppingAndSuppliesBySupplierIdAndDate, getShoppingAndSuppliesBySupplierIdAndDateTime } from '../controllers/shopping.controler.js'
import { getMostExpensiveSupply} from '../controllers/ShoppingDetail.controller.js'


const router = Router();

router.get('/shopping', getShopping);
router.get('/shopping/:id', getShop);
router.get('/shoppingByDate', getShoppingByDate);
router.get('/shoppingdetailExp', getMostExpensiveSupply);
router.post('/shopping', createShopping);
router.post('/multpleShopping', createMultipleShopping);
router.get('/getShopingByProvider', getShopingByProvider);
router.get('/getShoppingAndSuppliesBySupplierId/:id', getShoppingAndSuppliesBySupplierId);
router.get('/getShoppingAndSuppliesBySupplierIdAndDateTime/:id/:date', getShoppingAndSuppliesBySupplierIdAndDateTime);
router.get('/getShoppingAndSuppliesBySupplierIdAndDate/:id/:date', getShoppingAndSuppliesBySupplierIdAndDate);
router.get('/getShopingAndShopingDetails', getShopingAndShopingDetails);
router.put("/shopping/disable/:id", disableShop);


export default router;