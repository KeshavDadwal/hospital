const express = require("express");
const { validate } = require('express-validation');
const router = express.Router();
const multerMiddleware = require('../helpers/imageUpload');
const ClientController = require("../controllers/client.controller");
const RoleController = require("../controllers/role.controller");
const PermissionController = require("../controllers/permission.controller");
const RolePermissionController = require("../controllers/role_permission.controller");
const CarerController = require("../controllers/carer.controller");
const ProgramCareController = require("../controllers/programCare.controller");
const CarerVideoCountController = require("../controllers/carerVideo.controller");
const MobileClientController = require("../controllers/mobile.client.controller");
const CompanyController = require("../controllers/company.controller");
const verifyToken = require('../helpers/middleware');

router.use((req, res, next) => {
    if (req.path === '/login' || req.path === '/company' || req.path === '/resetpassword' || req.path === '/carerlogin') {
        next();
    } else {
        verifyToken(req, res, next);
    }
});

router.get('/role', RoleController.handlerGetRole);
router.post('/role', RoleController.handlerCreateRole);

router.get('/permission', PermissionController.handlerGetPermission);
router.post('/permission', PermissionController.handlerCreatePermission);

router.get('/role_permission', RolePermissionController.handlerGetRolePermission);
router.post('/role_permission', RolePermissionController.handlerCreateRolePermission);

router.post('/company', CompanyController.handlerCreateCompany);
router.post('/resetpassword', CompanyController.handlerResetCompanyPassword);
router.post('/login', CompanyController.handlerCompanyLogin);

router.post('/client', multerMiddleware.single('picture'), ClientController.handlerCreateClient);
router.get('/client/:id', ClientController.handlerGetClientById);
router.get('/client', ClientController.handlerGetClient);
router.put('/client/:id',multerMiddleware.single('picture'),ClientController.handlerUpdateClient);
router.delete('/client/:id', ClientController.handlerDeleteClient);


router.post('/carer', multerMiddleware.single('picture'), CarerController.handlerCreateCarer);
router.get('/carer/:id', CarerController.handlerGetCarerById);
router.get('/carer', CarerController.handlerGetCarer);
router.put('/carer/:id',multerMiddleware.single('picture'),CarerController.handlerUpdateCarer);
router.delete('/carer/:id', CarerController.handlerDeleteCarer);

router.delete('/video/:id', CarerController.handlerDeleteClientVideo);
router.put('/video/:id', CarerController.handlerUpdateVideo);
router.get('/procare', ProgramCareController.handlerGetPOCBYID);


router.get('/programcare', ProgramCareController.handlerGetProgramCare);
router.post('/programcare', ProgramCareController.handlerCreateProgramCare);
router.put('/programcare/:id', ProgramCareController.handlerUpdateProgramCare);

////////////////////////////////////////// Mobile
router.post('/carerlogin', CarerController.handlerCarerLogin);
router.get('/getcarer', MobileClientController.handlerGetMobileClient);
router.get('/video', CarerController.handlerGetCarerVideo);
router.get('/videolisting', CarerController.handlerGetCarerVideoListing);
router.post('/videocount', CarerVideoCountController.handlerUpdateVideoCount);
router.post('/uploadvideo', multerMiddleware.single('video'),CarerController.handlerCreateVideo);



module.exports = router;
