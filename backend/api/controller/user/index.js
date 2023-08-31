const multer = require('multer');
const path = require('path');
const { authorize, authorizeAdmin } = require('../../../_middleware')
const { createUser, registerSchema, login, loginSchema, uploadUserDoc, uploadUserDocSchema, updateProfileEmployeeSchema, updateProfileEmployee, } = require('./post')
const { getUserById, getAllEmployee, getEmployeeId, getProfile, getUserDocs, getupdateProfile } = require('./get');
const { log } = require('winston');

module.exports = (userModel, { config }) => {
    const router = config.express.Router();
    const
        storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if (file.fieldname == 'profile_photo') {
                    cb(null, 'uploads/profilepics');
                } else {
                    cb(null, 'uploads/');
                }
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
    router.post('/uploadDocs', authorize(), upload.fields([{ name: 'profile_photo' }, { name: 'aadhar_doc' }, { name: 'pan_doc' }, { name: 'resident_doc' }, { name: 'education_doc' }, { name: 'bank_doc' }, { name: 'exp_cer_doc' }, { name: 'sal_slip_doc' }]), uploadUserDocSchema, uploadUserDoc(userModel, { config }));
    router.post('/login', loginSchema, login(userModel, { config }));
    router.post('/updateEmployee', updateProfileEmployeeSchema, updateProfileEmployee(userModel, { config }));
    router.get('/getAllEmployee', authorize(), getAllEmployee(userModel, { config }));
    router.get('/getupdateProfile/:id', authorize(), getupdateProfile(userModel, { config }));
    router.get('/getEmployeeId', authorize(), getEmployeeId(userModel, { config }));
    router.get('/getEmployeeById/:id', authorize(), getUserById(userModel, { config }));
    router.get('/getEmployeeProfile', authorize(), getProfile(userModel, { config }));
    router.get('/getUserDocs', authorize(), getUserDocs(userModel, { config }));
    return router;
};