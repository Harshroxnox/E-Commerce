import {Router} from 'express'
import {createProduct,rateProduct,getProductById,getAllProducts,updateProduct,deleteProduct,createVariant,updateVariant,getVariantsByProduct,deleteVariant, getVariantById} from '../controllers/product.controller.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router =Router()

// product routes
router.route("/createproduct").post(createProduct);
router.route("/updateproduct/:productID").put(updateProduct);
router.route("/rateproduct/:productID").post(authMiddleware,rateProduct);
router.route("/getproduct/:productID").get(getProductById);
router.route("/getallproducts").get(getAllProducts);
router.route('/deleteproduct/:productID').delete(deleteProduct) ; 

// variant routes
router.route('/createvariant/:productID').post(createVariant);
router.route('/updatevariant/:variantID').put(updateVariant);
router.route('/getvariants/:productID').get(getVariantsByProduct);
router.route('/getvariant/:variantID').get(getVariantById);
router.route('/deletevariant/:variantID').delete(deleteVariant);

export default router