const multer = require('multer');
const path = require('path');
const { checkSqlInjection, authorize, authorizeAdmin } = require('../../../_middleware')
const { createUser, registerSchema, login, loginSchema, } = require('./post')
const { getUserById, getAllEmployee, getEmployeeId } = require('./get');
const { update } = require('./put');
const { _delete } = require('./delete');

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
    router.post('/create_account',upload.fields([{ name: 'degrre_cert' }]),registerSchema, createUser(userModel, { config }));
    router.post('/login', loginSchema, login(userModel, { config }));
    router.get('/getAllEmployee', authorize(), getAllEmployee(userModel, { config }));
    router.get('/getEmployeeId', authorize(), getEmployeeId(userModel, { config }));
    router.get('/:id', checkSqlInjection(), authorize(), getUserById(userModel, { config }));
    router.put('/:id', checkSqlInjection(), authorize(), update(userModel, { config }));
    router.delete('/:id', checkSqlInjection(), authorizeAdmin(), _delete(userModel, { config }));
    return router;
};