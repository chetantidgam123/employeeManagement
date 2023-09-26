const multer = require('multer');
const path = require('path');
const { authorize, authorizeAdmin } = require('../../../_middleware')
const {add_Holiday_schema, addHoliday, toggleHoliday} = require('./post')
const { getHolidaysList, getHolidayById, getHolidaysList_emp } = require('./get');

module.exports = (model, { config }) => {
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
    // ********************* employee *****************************
    router.get('/getHolidaysList_emp', authorize(), getHolidaysList_emp(model, { config }));
    
    
    // ********************* admin *****************************
    router.get('/getHolidaysList', authorizeAdmin(), getHolidaysList(model, { config }));
    router.post('/addholiday', authorizeAdmin(), add_Holiday_schema, addHoliday(model, { config }));
    router.post('/toggleHoliday', authorizeAdmin(), toggleHoliday(model, { config }));
    router.get('/getHolidayById/:id', authorizeAdmin(),  getHolidayById(model, { config }));
    return router;
};