const multer = require('multer');
const path = require('path');
const { authorize, authorizeAdmin } = require('../../../_middleware')
const { createUser, registerSchema, login, loginSchema, uploadUserDoc, uploadUserDocSchema, updateProfileEmployeeSchema, updateProfileEmployee, } = require('./post')
const { getUserById, getAllEmployee, getEmployeeId } = require('./get');

module.exports = (userModel, { config }) => {
    const router = config.express.Router();
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {

            cb(null, Date.now() + path.extname(file.originalname));
        },
    });
    function fileFilter(req, file, cb) {
        const allowedExtensions = ['.jpeg', '.jpg', '.png', '.yaml', '.json', '.pdf'];

        // Check if the file extension is in the allowedExtensions array
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Invalid file extension.'), false); // Reject the file
        }
    }
    const upload = multer({ storage: storage, fileFilter: fileFilter, });
    router.post('/create_account', upload.fields([{ name: 'degrre_cert' }]), registerSchema, createUser(userModel, { config }));
    router.post('/uploadDocs', authorize(), upload.fields([{ name: 'profilePhoto' }, { name: 'aadharDoc' }, { name: 'panDoc' }, { name: 'residentDoc' }, { name: 'educationDoc' }, { name: 'bankDoc' }, { name: 'expCerDoc' }, { name: 'salSlipDoc' }]), uploadUserDocSchema, uploadUserDoc(userModel, { config }));
    router.post('/login', loginSchema, login(userModel, { config }));
    router.post('/updateEmployee', updateProfileEmployeeSchema, updateProfileEmployee(userModel, { config }));
    router.get('/getAllEmployee', authorize(), getAllEmployee(userModel, { config }));
    router.get('/getEmployeeId', authorize(), getEmployeeId(userModel, { config }));
    router.get('/getEmployeeById/:id', authorize(), getUserById(userModel, { config }));
    return router;
};